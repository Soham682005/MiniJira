import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Task } from '../../types';
import { statusLabels } from '../../lib/constants';

const colors = ['#78716c', '#0f766e', '#d97706', '#059669'];

export function StatusChart({ tasks }: { tasks: Task[] }) {
  const data = Object.entries(statusLabels).map(([status, label]) => ({
    name: label,
    value: tasks.filter((task) => task.status === status).length,
  }));
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-white">
      <h3 className="text-sm font-semibold text-slate-900">Task status distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
            {data.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriorityChart({ tasks }: { tasks: Task[] }) {
  const data = ['low', 'medium', 'high', 'critical'].map((priority) => ({
    name: priority[0].toUpperCase() + priority.slice(1),
    tasks: tasks.filter((task) => task.priority === priority).length,
  }));
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-white">
      <h3 className="text-sm font-semibold text-slate-900">Priority distribution</h3>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="tasks" radius={[4, 4, 0, 0]} fill="#0f766e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
