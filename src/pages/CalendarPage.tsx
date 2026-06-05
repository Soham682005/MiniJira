import { CalendarDays } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useAppStore } from '../store/appStore';
import { priorityMeta } from '../lib/constants';
import { formatDate, isOverdue } from '../utils/format';

export function CalendarPage() {
  const tasks = useAppStore((state) => state.tasks);
  const sorted = [...tasks].sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Calendar</h1>
        <p className="mt-1 text-sm text-slate-500">Upcoming deadlines, due today items, and overdue work.</p>
      </div>
      <div className="grid gap-3">
        {sorted.map((task) => (
          <div key={task.id} className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-slate-950">{task.title}</p>
              <p
                className={`mt-1 flex items-center gap-2 text-sm ${
                  isOverdue(task.due_date) && task.status !== 'done' ? 'text-red-600' : 'text-slate-500'
                }`}
              >
                <CalendarDays className="h-4 w-4" /> {formatDate(task.due_date)}
              </p>
            </div>
            <Badge className={priorityMeta[task.priority].className}>{priorityMeta[task.priority].label}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}


