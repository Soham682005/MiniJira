import type { ReactNode } from 'react';

export function MetricCard({ title, value, caption, icon }: { title: string; value: string | number; caption: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className="rounded-md border border-emerald-100 bg-emerald-50 p-2 text-emerald-700">{icon}</div>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">{caption}</p>
    </div>
  );
}
