import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { taskColumns } from '../../lib/constants';
import type { Task, TaskStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { TaskDrawer } from './TaskDrawer';

export function KanbanBoard({ tasks, onStatusChange }: { tasks: Task[]; onStatusChange: (taskId: string, status: TaskStatus) => void }) {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const grouped = useMemo(
    () => Object.fromEntries(taskColumns.map((column) => [column.id, tasks.filter((task) => task.status === column.id)])) as Record<TaskStatus, Task[]>,
    [tasks],
  );

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : undefined;
    if (!overId) return;
    const targetStatus = taskColumns.find((column) => column.id === overId)
      ? (overId as TaskStatus)
      : tasks.find((task) => task.id === overId)?.status;
    const task = tasks.find((item) => item.id === taskId);
    if (task && targetStatus && task.status !== targetStatus) onStatusChange(taskId, targetStatus);
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {taskColumns.map((column) => (
            <KanbanColumn key={column.id} status={column.id} tasks={grouped[column.id]} onOpen={setSelectedTask} />
          ))}
        </div>
      </DndContext>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(undefined)} />
    </>
  );
}
