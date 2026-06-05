import type { ActivityLog, DashboardMetrics, Project, Task, Workspace, WorkspaceMember } from '../types';

export const demoWorkspace: Workspace = {
  id: 'workspace-demo',
  name: 'Acme Product',
  description: 'Internal product, engineering, and launch collaboration.',
  owner_id: 'user-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoMembers: WorkspaceMember[] = [
  { id: 'm1', workspace_id: demoWorkspace.id, user_id: 'user-1', role: 'admin', created_at: new Date().toISOString(), profile: { id: 'user-1', full_name: 'Aarav Mehta', email: 'aarav@acme.test', role: 'admin', created_at: new Date().toISOString() } },
  { id: 'm2', workspace_id: demoWorkspace.id, user_id: 'user-2', role: 'project_manager', created_at: new Date().toISOString(), profile: { id: 'user-2', full_name: 'Maya Singh', email: 'maya@acme.test', role: 'project_manager', created_at: new Date().toISOString() } },
  { id: 'm3', workspace_id: demoWorkspace.id, user_id: 'user-3', role: 'team_member', created_at: new Date().toISOString(), profile: { id: 'user-3', full_name: 'Rohan Kapoor', email: 'rohan@acme.test', role: 'team_member', created_at: new Date().toISOString() } },
];

export const demoProjects: Project[] = [
  { id: 'project-1', workspace_id: demoWorkspace.id, title: 'Web Platform Launch', description: 'Public beta for the customer portal.', status: 'active', start_date: '2026-05-20', due_date: '2026-07-15', created_at: new Date().toISOString() },
  { id: 'project-2', workspace_id: demoWorkspace.id, title: 'Mobile Redesign', description: 'Refresh mobile task workflows.', status: 'planning', start_date: '2026-06-10', due_date: '2026-08-01', created_at: new Date().toISOString() },
];

export const demoTasks: Task[] = [
  { id: 'task-1', workspace_id: demoWorkspace.id, project_id: 'project-1', title: 'Finalize workspace onboarding', description: 'Review onboarding checklist, invite flow, and first workspace setup.', status: 'todo', priority: 'high', due_date: '2026-06-12', assigned_to: 'user-2', created_by: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assignee: demoMembers[1].profile },
  { id: 'task-2', workspace_id: demoWorkspace.id, project_id: 'project-1', title: 'Implement activity timeline', description: 'Record task status changes, comments, and upload events.', status: 'in_progress', priority: 'medium', due_date: '2026-06-18', assigned_to: 'user-3', created_by: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assignee: demoMembers[2].profile },
  { id: 'task-3', workspace_id: demoWorkspace.id, project_id: 'project-1', title: 'Cloudinary upload QA', description: 'Verify image, PDF, DOCX, and ZIP uploads with metadata persistence.', status: 'review', priority: 'critical', due_date: '2026-06-08', assigned_to: 'user-1', created_by: 'user-2', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assignee: demoMembers[0].profile },
  { id: 'task-4', workspace_id: demoWorkspace.id, project_id: 'project-1', title: 'Dashboard chart polish', description: 'Tighten status distribution and monthly progress charts.', status: 'done', priority: 'low', due_date: '2026-06-04', assigned_to: 'user-2', created_by: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assignee: demoMembers[1].profile },
];

export const demoMetrics: DashboardMetrics = {
  totalProjects: demoProjects.length,
  totalTasks: demoTasks.length,
  completedTasks: demoTasks.filter((task) => task.status === 'done').length,
  activeTasks: demoTasks.filter((task) => task.status !== 'done').length,
  teamMembers: demoMembers.length,
};

export const demoActivity: ActivityLog[] = [
  { id: 'a1', user_id: 'user-2', action: 'moved Cloudinary upload QA to Review', entity_type: 'task', entity_id: 'task-3', created_at: new Date(Date.now() - 1800000).toISOString(), profile: demoMembers[1].profile },
  { id: 'a2', user_id: 'user-3', action: 'commented on Activity timeline', entity_type: 'comment', entity_id: 'task-2', created_at: new Date(Date.now() - 7200000).toISOString(), profile: demoMembers[2].profile },
  { id: 'a3', user_id: 'user-1', action: 'created Web Platform Launch', entity_type: 'project', entity_id: 'project-1', created_at: new Date(Date.now() - 86400000).toISOString(), profile: demoMembers[0].profile },
];
