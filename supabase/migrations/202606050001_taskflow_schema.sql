create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'project_manager', 'team_member');
create type public.project_status as enum ('planning', 'active', 'paused', 'completed', 'archived');
create type public.task_status as enum ('todo', 'in_progress', 'review', 'done');
create type public.priority_level as enum ('low', 'medium', 'high', 'critical');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  avatar_url text,
  role public.app_role not null default 'team_member',
  created_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'team_member',
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text not null default '',
  status public.project_status not null default 'planning',
  start_date date,
  due_date date,
  created_at timestamptz not null default now()
);

create table public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'team_member',
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  status public.task_status not null default 'todo',
  priority public.priority_level not null default 'medium',
  due_date date,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  public_id text not null,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  entity_type text not null check (entity_type in ('workspace', 'project', 'task', 'comment', 'attachment', 'notification')),
  entity_id uuid not null,
  created_at timestamptz not null default now()
);

create index idx_workspace_members_user on public.workspace_members(user_id);
create index idx_projects_workspace on public.projects(workspace_id);
create index idx_project_members_user on public.project_members(user_id);
create index idx_tasks_workspace on public.tasks(workspace_id);
create index idx_tasks_project_status on public.tasks(project_id, status);
create index idx_tasks_assigned_to on public.tasks(assigned_to);
create index idx_comments_task on public.comments(task_id);
create index idx_attachments_task on public.attachments(task_id);
create index idx_notifications_user_read on public.notifications(user_id, is_read);
create index idx_activity_workspace_created on public.activity_logs(workspace_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_workspaces_updated_at before update on public.workspaces for each row execute function public.touch_updated_at();
create trigger touch_tasks_updated_at before update on public.tasks for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;
alter table public.attachments enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;

create or replace function public.is_workspace_member(workspace uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = workspace and user_id = auth.uid()
  );
$$;

create or replace function public.workspace_role(workspace uuid)
returns public.app_role language sql stable security definer as $$
  select role from public.workspace_members
  where workspace_id = workspace and user_id = auth.uid()
  limit 1;
$$;

create policy "Users can read own profile" on public.profiles for select using (id = auth.uid());
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid());

create policy "Members read workspaces" on public.workspaces for select using (public.is_workspace_member(id) or owner_id = auth.uid());
create policy "Authenticated users create workspaces" on public.workspaces for insert with check (owner_id = auth.uid());
create policy "Admins manage workspaces" on public.workspaces for update using (owner_id = auth.uid() or public.workspace_role(id) = 'admin');
create policy "Owners delete workspaces" on public.workspaces for delete using (owner_id = auth.uid());

create policy "Members read workspace members" on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy "Admins manage workspace members" on public.workspace_members for all using (public.workspace_role(workspace_id) = 'admin') with check (public.workspace_role(workspace_id) = 'admin');

create policy "Members read projects" on public.projects for select using (public.is_workspace_member(workspace_id));
create policy "Managers manage projects" on public.projects for all using (public.workspace_role(workspace_id) in ('admin', 'project_manager')) with check (public.workspace_role(workspace_id) in ('admin', 'project_manager'));

create policy "Project members read" on public.project_members for select using (exists (select 1 from public.projects p where p.id = project_id and public.is_workspace_member(p.workspace_id)));
create policy "Managers manage project members" on public.project_members for all using (exists (select 1 from public.projects p where p.id = project_id and public.workspace_role(p.workspace_id) in ('admin', 'project_manager'))) with check (exists (select 1 from public.projects p where p.id = project_id and public.workspace_role(p.workspace_id) in ('admin', 'project_manager')));

create policy "Members read tasks" on public.tasks for select using (public.is_workspace_member(workspace_id));
create policy "Managers create tasks" on public.tasks for insert with check (public.workspace_role(workspace_id) in ('admin', 'project_manager') or assigned_to = auth.uid());
create policy "Assigned users and managers update tasks" on public.tasks for update using (assigned_to = auth.uid() or created_by = auth.uid() or public.workspace_role(workspace_id) in ('admin', 'project_manager'));
create policy "Managers delete tasks" on public.tasks for delete using (public.workspace_role(workspace_id) in ('admin', 'project_manager'));

create policy "Task members read comments" on public.comments for select using (exists (select 1 from public.tasks t where t.id = task_id and public.is_workspace_member(t.workspace_id)));
create policy "Task members write comments" on public.comments for insert with check (user_id = auth.uid() and exists (select 1 from public.tasks t where t.id = task_id and public.is_workspace_member(t.workspace_id)));
create policy "Comment owners update" on public.comments for update using (user_id = auth.uid());
create policy "Comment owners delete" on public.comments for delete using (user_id = auth.uid());

create policy "Task members read attachments" on public.attachments for select using (exists (select 1 from public.tasks t where t.id = task_id and public.is_workspace_member(t.workspace_id)));
create policy "Task members add attachments" on public.attachments for insert with check (uploaded_by = auth.uid() and exists (select 1 from public.tasks t where t.id = task_id and public.is_workspace_member(t.workspace_id)));
create policy "Upload owners delete attachments" on public.attachments for delete using (uploaded_by = auth.uid());

create policy "Users read own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update using (user_id = auth.uid());

create policy "Members read activity" on public.activity_logs for select using (workspace_id is null or public.is_workspace_member(workspace_id));
create policy "Members create activity" on public.activity_logs for insert with check (user_id = auth.uid() and (workspace_id is null or public.is_workspace_member(workspace_id)));

alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.activity_logs;
