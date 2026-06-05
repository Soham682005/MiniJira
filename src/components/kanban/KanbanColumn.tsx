import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { taskColumns } from '../../lib/constants';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

export function KanbanColumn({ status, tasks, onOpen }: { status: TaskStatus; tasks: Task[]; onOpen: (task: Task) => void }) {
  const { setNodeRef } = useDroppable({ id: status });
  const columnMeta = taskColumns.find((column) => column.id === status);
  const title = columnMeta?.title ?? status;

  return (
    <section ref={setNodeRef} className="flex min-h-[32rem] min-w-72 flex-1 flex-col overflow-hidden rounded-lg border border-slate-300 bg-stone-50 shadow-sm transition hover:shadow-md">
      <div className={`h-1.5 ${columnMeta?.rail ?? 'bg-slate-500'}`} />
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${columnMeta?.tone ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-3 p-3">
          {tasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}
        </div>
      </SortableContext>
    </section>
  );
}
