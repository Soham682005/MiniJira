import { ShieldCheck, Users, FolderKanban, ListTodo } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { useAppStore } from '../store/appStore';

export function AdminPage() {
  const members = useAppStore((state) => state.members);
  const projects = useAppStore((state) => state.projects);
  const tasks = useAppStore((state) => state.tasks);

  const metrics = {
    totalUsers: members.length,
    totalProjects: projects.length,
    totalTasks: tasks.length,
    activeUsers: members.length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Admin panel</h1>
        <p className="mt-1 text-sm text-slate-500">Manage users, workspace access, project inventory, and activity monitoring.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Users" value={metrics.totalUsers} caption="Active accounts" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Projects" value={metrics.totalProjects} caption="All workspaces" icon={<FolderKanban className="h-5 w-5" />} />
        <MetricCard title="Tasks" value={metrics.totalTasks} caption="Tracked tasks" icon={<ListTodo className="h-5 w-5" />} />
        <MetricCard title="Active users" value={metrics.activeUsers} caption="Last 24 hours" icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{member.profile?.full_name}</td>
                <td className="px-4 py-3 text-slate-600">{member.profile?.email}</td>
                <td className="px-4 py-3 text-slate-600">{member.role.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

