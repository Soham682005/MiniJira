import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Plus, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import type { Priority, Task, TaskStatus } from '../../types';
import { priorityMeta, statusLabels, taskColumns } from '../../lib/constants';
import { formatDate } from '../../utils/format';
import { isSupabaseConfigured } from '../../lib/supabase';

type NewTaskDrawerProps = {
  open: boolean;
  projectId: string;
  workspaceId: string;
  onClose: () => void;
  onCreated?: (task: Task) => void;
};

export function NewTaskDrawer({ open, projectId, workspaceId, onClose, onCreated }: NewTaskDrawerProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState<string>('');
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = useMemo(() => taskColumns.map((c) => c.id), []);

  async function handleSubmit() {
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const createdBy = user?.id ?? 'demo-user';
      const payload = {
        id: crypto.randomUUID(),
        workspace_id: workspaceId,
        project_id: projectId,
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        assigned_to: assigneeName ? assigneeName : undefined,
        created_by: createdBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && !projectId.startsWith('project-')) {
        const { data } = await api.upsertTask(payload);
        if (data) onCreated?.(data as Task);
      } else {
        onCreated?.(payload as Task);
      }
      onClose();

      // reset
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
      setAssigneeName('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-slate-900/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-white shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">New task</p>
                <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-950">
                  <Plus className="h-5 w-5 text-teal-700" />
                  Create in this project
                </h2>
              </div>
              <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close new task">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-900">Title</label>
                  <input
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Review API contract"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-900">Description</label>
                  <textarea
                    className="min-h-28 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What needs to be done?"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-900">Priority</label>
                    <Badge className={priorityMeta[priority].className}>{priorityMeta[priority].label}</Badge>
                  </div>
                  <select
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    {Object.keys(priorityMeta).map((k) => (
                      <option key={k} value={k}>
                        {priorityMeta[k as Priority].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-900">Status</label>
                    <Badge className="border-slate-200 bg-slate-50 text-slate-700">{statusLabels[status]}</Badge>
                  </div>
                  <select
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s as TaskStatus]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-900">Due date</label>
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3">
                    <CalendarDays className="h-4 w-4 text-slate-500" />
                    <input className="h-10 flex-1 bg-transparent text-sm outline-none" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  {dueDate && <p className="text-xs text-slate-500">Selected: {formatDate(new Date(dueDate).toISOString())}</p>}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-900">Assignee (optional)</label>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3">
                    <Avatar name={assigneeName || user?.user_metadata?.full_name || 'Me'} size="sm" />
                    <input
                      className="h-10 flex-1 bg-transparent text-sm outline-none"
                      value={assigneeName}
                      onChange={(e) => setAssigneeName(e.target.value)}
                      placeholder="Type name (stored as assigned_to)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                icon={<Plus className="h-4 w-4" />}
                onClick={() => void handleSubmit()}
                disabled={submitting || !title.trim()}
              >
                {submitting ? 'Creating...' : 'Create task'}
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

