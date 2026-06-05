import { CheckCircle2, FolderKanban, ListTodo, Users } from 'lucide-react';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { Avatar } from '../components/common/Avatar';
import { MetricCard } from '../components/dashboard/MetricCard';
import { PriorityChart, StatusChart } from '../components/dashboard/Charts';
import { useAppStore } from '../store/appStore';

export function DashboardPage() {
  const tasks = useAppStore((state) => state.tasks);
  const members = useAppStore((state) => state.members);
  const projects = useAppStore((state) => state.projects);

  const metrics = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.status === 'done').length,
    activeTasks: tasks.filter((task) => task.status !== 'done').length,
    teamMembers: members.length,
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-l-4 border-emerald-700 p-5 lg:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Workspace command center</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950 lg:text-3xl">Plan, assign, and ship team work</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Track delivery health, workload, and project movement across your workspace.
              </p>
            </div>
            <div className="grid min-w-72 grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="text-xs font-medium text-slate-500">Completion rate</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">
                  {Math.round((metrics.completedTasks / Math.max(metrics.totalTasks, 1)) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Open work</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{metrics.activeTasks}</p>
              </div>
              <div className="col-span-2 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-xs font-medium text-slate-500">Team online</span>
                <div className="flex -space-x-2">
                  {members.slice(0, 4).map((member) => (
                    <div key={member.id} className="rounded-full border-2 border-slate-50">
                      <Avatar name={member.profile?.full_name} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Projects" value={metrics.totalProjects} caption="Across this workspace" icon={<FolderKanban className="h-5 w-5" />} />
        <MetricCard title="Tasks" value={metrics.totalTasks} caption="Total tracked work" icon={<ListTodo className="h-5 w-5" />} />
        <MetricCard title="Completed" value={metrics.completedTasks} caption="Closed this cycle" icon={<CheckCircle2 className="h-5 w-5" />} />
        <MetricCard title="Active" value={metrics.activeTasks} caption="Still in motion" icon={<ListTodo className="h-5 w-5" />} />
        <MetricCard title="Members" value={metrics.teamMembers} caption="Workspace collaborators" icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <StatusChart tasks={tasks} />
        <PriorityChart tasks={tasks} />
      </div>

      <ActivityTimeline activity={[]} />
    </div>
  );
}

