import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { NewTaskDrawer } from '../components/kanban/NewTaskDrawer';
import { demoProjects, demoTasks } from '../data/demo';
import { useAppStore } from '../store/appStore';
import type { Project, Task, TaskStatus } from '../types';

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projects = useAppStore((state) => state.projects);
  const activeProject = useAppStore((state) => state.activeProject);
  const tasks = useAppStore((state) => state.tasks);
  const updateTaskStatus = useAppStore((state) => state.updateTaskStatus);
  const refreshProject = useAppStore((state) => state.refreshProject);
  const setActiveProject = useAppStore((state) => state.setActiveProject);

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [demoActiveProject, setDemoActiveProject] = useState<Project>(demoProjects[0]);
  const [demoBoardTasks, setDemoBoardTasks] = useState<Task[]>(demoTasks);

  const liveMode = projects.length > 0 && Boolean(activeProject);
  const visibleProjects = liveMode ? projects : demoProjects;
  const visibleProject = liveMode ? activeProject : demoActiveProject;
  const visibleTasks = useMemo(
    () => (liveMode ? tasks : demoBoardTasks).filter((task) => task.project_id === visibleProject?.id),
    [demoBoardTasks, liveMode, tasks, visibleProject?.id],
  );

  useEffect(() => {
    if (searchParams.get('newTask') === '1') {
      window.setTimeout(() => setNewTaskOpen(true), 0);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function handleStatusChange(taskId: string, status: TaskStatus) {
    if (liveMode) {
      void updateTaskStatus(taskId, status);
      return;
    }
    setDemoBoardTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
  }

  function handleTaskCreated(task: Task) {
    if (liveMode) {
      void refreshProject();
      return;
    }
    setDemoBoardTasks((current) => [task, ...current]);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Project board</p>
          {visibleProject ? (
            <>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">{visibleProject.title}</h1>
              <p className="mt-1 text-sm text-slate-600">{visibleProject.description}</p>
            </>
          ) : (
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">No project selected</h1>
          )}
        </div>

        <Button
          icon={<Plus className="h-4 w-4" />}
          disabled={!visibleProject}
          onClick={() => setNewTaskOpen(true)}
        >
          Create task
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {visibleProjects.map((project) => (
          <button
            key={project.id}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              visibleProject?.id === project.id
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => {
              if (liveMode) void setActiveProject(project);
              else setDemoActiveProject(project);
            }}
          >
            {project.title}
          </button>
        ))}
      </div>

      <KanbanBoard tasks={visibleTasks} onStatusChange={handleStatusChange} />

      {visibleProject && (
        <NewTaskDrawer
          open={newTaskOpen}
          projectId={visibleProject.id}
          workspaceId={visibleProject.workspace_id}
          onClose={() => setNewTaskOpen(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
