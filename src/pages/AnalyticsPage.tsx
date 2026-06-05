import { PriorityChart, StatusChart } from '../components/dashboard/Charts';
import { useAppStore } from '../store/appStore';

export function AnalyticsPage() {
  const tasks = useAppStore((state) => state.tasks);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Completion rate, productivity trends, and workload balance.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <StatusChart tasks={tasks} />
        <PriorityChart tasks={tasks} />
      </div>
    </div>
  );
}

