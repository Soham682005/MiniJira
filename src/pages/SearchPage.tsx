import { Search } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { demoMembers, demoProjects, demoTasks } from '../data/demo';
import { useAppStore } from '../store/appStore';
import { priorityMeta, statusLabels } from '../lib/constants';
import { formatDate, isOverdue } from '../utils/format';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projects = useAppStore((state) => state.projects);
  const tasks = useAppStore((state) => state.tasks);
  const members = useAppStore((state) => state.members);
  const query = searchParams.get('q') ?? '';
  const filter = searchParams.get('filter') ?? 'all';
  const sourceProjects = projects.length ? projects : demoProjects;
  const sourceTasks = tasks.length ? tasks : demoTasks;
  const sourceMembers = members.length ? members : demoMembers;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredProjects = useMemo(
    () =>
      sourceProjects.filter((project) => {
        if (filter !== 'all' && filter !== 'projects') return false;
        if (!normalizedQuery) return true;
        return `${project.title} ${project.description}`.toLowerCase().includes(normalizedQuery);
      }),
    [filter, normalizedQuery, sourceProjects],
  );

  const filteredTasks = useMemo(
    () =>
      sourceTasks.filter((task) => {
        if (filter === 'projects' || filter === 'members') return false;
        if (filter === 'priority' && task.priority !== 'critical' && task.priority !== 'high') return false;
        if (filter === 'status' && task.status !== 'in_progress' && task.status !== 'review') return false;
        if (filter === 'due' && !isOverdue(task.due_date)) return false;
        if (filter === 'assigned' && !task.assigned_to) return false;
        if (!normalizedQuery) return true;
        return `${task.title} ${task.description} ${task.priority} ${task.status} ${task.assignee?.full_name ?? ''}`.toLowerCase().includes(normalizedQuery);
      }),
    [filter, normalizedQuery, sourceTasks],
  );

  const filteredMembers = useMemo(
    () =>
      sourceMembers.filter((member) => {
        if (filter !== 'all' && filter !== 'members' && filter !== 'assigned') return false;
        if (!normalizedQuery) return true;
        return `${member.profile?.full_name ?? ''} ${member.profile?.email ?? ''} ${member.role}`.toLowerCase().includes(normalizedQuery);
      }),
    [filter, normalizedQuery, sourceMembers],
  );

  const totalResults = filteredProjects.length + filteredTasks.length + filteredMembers.length;

  function updateSearch(nextQuery: string) {
    const next = new URLSearchParams(searchParams);
    if (nextQuery.trim()) next.set('q', nextQuery);
    else next.delete('q');
    setSearchParams(next);
  }

  function updateFilter(nextFilter: string) {
    const next = new URLSearchParams(searchParams);
    if (nextFilter === 'all') next.delete('filter');
    else next.set('filter', nextFilter);
    setSearchParams(next);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Global search</h1>
        <p className="mt-1 text-sm text-slate-500">Find projects, tasks, members, and comments with filters.</p>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <input
            className="h-full flex-1 outline-none placeholder:text-slate-400"
            placeholder="Search everything"
            value={query}
            onChange={(event) => updateSearch(event.target.value)}
            autoFocus
          />
        </div>
        {[
          ['all', 'All'],
          ['priority', 'Priority'],
          ['status', 'Status'],
          ['due', 'Overdue'],
          ['assigned', 'Assigned'],
        ].map(([filterId, label]) => (
          <button
            key={filterId}
            className={`h-10 rounded-md border px-3 text-sm font-medium transition ${
              filter === filterId || (filterId === 'all' && filter === 'all')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => updateFilter(filterId)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">{totalResults} result{totalResults === 1 ? '' : 's'} found</p>

      <div className="grid gap-3">
        {filteredProjects.map((project) => (
          <div key={project.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Project</p>
            <p className="font-medium text-slate-950">{project.title}</p>
            <p className="mt-1 text-sm text-slate-600">{project.description}</p>
          </div>
        ))}

        {filteredTasks.map((task) => (
          <div key={task.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Task</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-950">{task.title}</p>
              <Badge className={priorityMeta[task.priority].className}>{priorityMeta[task.priority].label}</Badge>
              <Badge className="border-slate-200 bg-slate-50 text-slate-700">{statusLabels[task.status]}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{task.description}</p>
            <p className="mt-2 text-xs text-slate-500">Due {formatDate(task.due_date)} · {task.assignee?.full_name ?? 'Unassigned'}</p>
          </div>
        ))}

        {filteredMembers.map((member) => (
          <div key={member.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Member</p>
            <p className="font-medium text-slate-950">{member.profile?.full_name}</p>
            <p className="mt-1 text-sm text-slate-600">{member.profile?.email} · {member.role.replace('_', ' ')}</p>
          </div>
        ))}

        {totalResults === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-medium text-slate-900">No results found</p>
            <p className="mt-1 text-sm text-slate-500">Try a task title, member name, status, or priority.</p>
          </div>
        )}
      </div>
    </div>
  );
}
