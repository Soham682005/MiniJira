import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays, GripVertical, Paperclip } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { priorityMeta, taskColumns } from '../../lib/constants';
import { formatDate, isOverdue } from '../../utils/format';
import type { Task } from '../../types';

export function TaskCard({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const statusMeta = taskColumns.find((column) => column.id === task.status);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md ${isDragging ? 'opacity-60' : ''}`}
      onClick={() => onOpen(task)}
    >
      <div className={`h-1 ${statusMeta?.rail ?? 'bg-slate-400'}`} />
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <button
            className="mt-0.5 rounded p-1 text-slate-400 hover:bg-stone-100 hover:text-slate-700"
            aria-label="Drag task"
            onClick={(event) => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h4 className="flex-1 text-sm font-semibold leading-5 text-slate-950 group-hover:text-teal-900">{task.title}</h4>
          <Badge className={priorityMeta[task.priority].className}>{priorityMeta[task.priority].label}</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{task.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className={`flex items-center gap-1 text-xs ${isOverdue(task.due_date) && task.status !== 'done' ? 'text-red-600' : 'text-slate-500'}`}>
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(task.due_date)}
          </div>
          <div className="flex items-center gap-2">
            <Paperclip className="h-3.5 w-3.5 text-slate-400" />
            <Avatar name={task.assignee?.full_name} size="sm" />
          </div>
        </div>
      </div>
    </article>
  );
}
