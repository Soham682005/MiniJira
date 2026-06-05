import { supabase } from '../lib/supabase';
import type { Attachment, Comment, Project, Task, TaskStatus, Workspace, WorkspaceMember } from '../types';

export const api = {
  async getWorkspaces() {
    return supabase.from('workspaces').select('*').order('created_at', { ascending: false });
  },
  async createWorkspace(payload: Pick<Workspace, 'name' | 'description' | 'owner_id'>) {
    return supabase.from('workspaces').insert(payload).select().single();
  },
  async getMembers(workspaceId: string) {
    return supabase
      .from('workspace_members')
      .select('*, profile:profiles(*)')
      .eq('workspace_id', workspaceId)
      .returns<WorkspaceMember[]>();
  },
  async getProjects(workspaceId: string) {
    return supabase.from('projects').select('*').eq('workspace_id', workspaceId).order('created_at').returns<Project[]>();
  },
  async createProject(payload: Omit<Project, 'id' | 'created_at'>) {
    return supabase.from('projects').insert(payload).select().single();
  },
  async getTasks(projectId: string) {
    return supabase
      .from('tasks')
      .select('*, assignee:profiles!tasks_assigned_to_fkey(*)')
      .eq('project_id', projectId)
      .order('created_at')
      .returns<Task[]>();
  },
  async upsertTask(payload: Partial<Task> & Pick<Task, 'project_id' | 'title'>) {
    return supabase.from('tasks').upsert(payload).select().single();
  },
  async updateTaskStatus(taskId: string, status: TaskStatus) {
    return supabase.from('tasks').update({ status }).eq('id', taskId).select().single();
  },
  async deleteTask(taskId: string) {
    return supabase.from('tasks').delete().eq('id', taskId);
  },
  async getComments(taskId: string) {
    return supabase
      .from('comments')
      .select('*, profile:profiles(*)')
      .eq('task_id', taskId)
      .order('created_at')
      .returns<Comment[]>();
  },
  async addComment(payload: Pick<Comment, 'task_id' | 'user_id' | 'content'>) {
    return supabase.from('comments').insert(payload).select().single();
  },
  async getAttachments(taskId: string) {
    return supabase.from('attachments').select('*').eq('task_id', taskId).returns<Attachment[]>();
  },
  async addAttachment(payload: Omit<Attachment, 'id' | 'created_at'>) {
    return supabase.from('attachments').insert(payload).select().single();
  },
  async getNotifications(userId: string) {
    return supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  },
  async getActivity(workspaceId: string) {
    return supabase
      .from('activity_logs')
      .select('*, profile:profiles(*)')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(30);
  },
};
