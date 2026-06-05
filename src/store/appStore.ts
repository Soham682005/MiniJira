import { create } from 'zustand';
import { api } from '../services/api';
import type { Project, Task, Workspace, WorkspaceMember } from '../types';

interface AppState {
  workspaces: Workspace[];
  activeWorkspace?: Workspace;
  members: WorkspaceMember[];
  projects: Project[];
  activeProject?: Project;
  tasks: Task[];
  loading: boolean;
  setActiveWorkspace: (workspace?: Workspace) => Promise<void>;
  setActiveProject: (project?: Project) => Promise<void>;
  loadWorkspaces: () => Promise<void>;
  refreshProject: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  workspaces: [],
  members: [],
  projects: [],
  tasks: [],
  loading: false,
  async loadWorkspaces() {
    set({ loading: true });
    const { data } = await api.getWorkspaces();
    const workspaces = data ?? [];
    set({ workspaces, activeWorkspace: get().activeWorkspace ?? workspaces[0], loading: false });
    if (workspaces[0] && !get().activeWorkspace) await get().setActiveWorkspace(workspaces[0]);
  },
  async setActiveWorkspace(workspace) {
    set({ activeWorkspace: workspace, loading: true });
    if (!workspace) {
      set({ projects: [], members: [], tasks: [], activeProject: undefined, loading: false });
      return;
    }
    const [projectsResult, membersResult] = await Promise.all([
      api.getProjects(workspace.id),
      api.getMembers(workspace.id),
    ]);
    const projects = projectsResult.data ?? [];
    set({ projects, members: membersResult.data ?? [], activeProject: projects[0], loading: false });
    if (projects[0]) await get().setActiveProject(projects[0]);
  },
  async setActiveProject(project) {
    set({ activeProject: project, loading: true });
    if (!project) {
      set({ tasks: [], loading: false });
      return;
    }
    const { data } = await api.getTasks(project.id);
    set({ tasks: data ?? [], loading: false });
  },
  async refreshProject() {
    const project = get().activeProject;
    if (project) await get().setActiveProject(project);
  },
  async updateTaskStatus(taskId, status) {
    const previous = get().tasks;
    set({ tasks: previous.map((task) => (task.id === taskId ? { ...task, status } : task)) });
    const { error } = await api.updateTaskStatus(taskId, status);
    if (error) set({ tasks: previous });
  },
}));
