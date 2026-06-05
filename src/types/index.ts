export type Role = 'admin' | 'project_manager' | 'team_member';
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: Role;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  profile?: Profile;
}

export interface Project {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  start_date?: string;
  due_date?: string;
  created_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  due_date?: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assignee?: Profile;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface Attachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  public_id: string;
  uploaded_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: 'workspace' | 'project' | 'task' | 'comment' | 'attachment' | 'notification';
  entity_id: string;
  created_at: string;
  profile?: Profile;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  teamMembers: number;
}
