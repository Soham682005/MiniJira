import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { AttachmentUploader } from '../attachments/AttachmentUploader';
import { priorityMeta, statusLabels } from '../../lib/constants';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import type { Task } from '../../types';

export function TaskDrawer({ task, onClose }: { task?: Task; onClose: () => void }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(['Looks good. Please add the mobile empty state before approval.']);

  function handleAddComment() {
    if (!comment.trim()) return;
    setComments((current) => [comment.trim(), ...current]);
    setComment('');
    toast.success('Comment added.');
  }

  function handleDeleteTask() {
    toast.success('Task delete action triggered.');
    onClose();
  }

  return (
    <AnimatePresence>
      {task && (
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
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Task details</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">{task.title}</h2>
              </div>
              <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close task">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-2">
                <Badge className={priorityMeta[task.priority].className}>{priorityMeta[task.priority].label}</Badge>
                <Badge className="border-slate-200 bg-slate-50 text-slate-700">{statusLabels[task.status]}</Badge>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">{task.description}</p>
              <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Assignee</p>
                  <div className="mt-2 flex items-center gap-2 font-medium text-slate-900">
                    <Avatar name={task.assignee?.full_name} size="sm" />
                    {task.assignee?.full_name ?? 'Unassigned'}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500">Due date</p>
                  <p className="mt-2 flex items-center gap-2 font-medium text-slate-900"><CalendarDays className="h-4 w-4" />{formatDate(task.due_date)}</p>
                </div>
              </div>
              <section className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900">Attachments</h3>
                <AttachmentUploader taskId={task.id} uploadedBy={user?.id ?? task.created_by} />
              </section>
              <section className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900">Comments</h3>
                <div className="mt-3 space-y-3">
                  {comments.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600">{item}</div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      className="h-10 flex-1 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleAddComment();
                      }}
                    />
                    <Button icon={<Send className="h-4 w-4" />} onClick={handleAddComment}>Send</Button>
                  </div>
                </div>
              </section>
            </div>
            <footer className="flex justify-between border-t border-slate-200 px-5 py-4">
              <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={handleDeleteTask}>Delete</Button>
              <Button variant="secondary" onClick={onClose}>Close</Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
