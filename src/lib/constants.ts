import type { Priority, TaskStatus } from '../types';

export const taskColumns: Array<{ id: TaskStatus; title: string; tone: string; rail: string }> = [
  { id: 'todo', title: 'Todo', tone: 'bg-stone-100 text-stone-700 border-stone-300', rail: 'bg-stone-500' },
  { id: 'in_progress', title: 'In Progress', tone: 'bg-teal-50 text-teal-800 border-teal-200', rail: 'bg-teal-600' },
  { id: 'review', title: 'Review', tone: 'bg-amber-50 text-amber-800 border-amber-200', rail: 'bg-amber-500' },
  { id: 'done', title: 'Done', tone: 'bg-emerald-50 text-emerald-800 border-emerald-200', rail: 'bg-emerald-600' },
];

export const priorityMeta: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  medium: { label: 'Medium', className: 'bg-teal-50 text-teal-800 border-teal-200' },
  high: { label: 'High', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  critical: { label: 'Critical', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};
