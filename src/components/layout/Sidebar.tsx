import { BarChart3, CalendarDays, FolderKanban, LayoutDashboard, Search, Settings, ShieldCheck, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={clsx('fixed inset-0 z-30 bg-slate-950/50 lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-emerald-700 text-sm font-bold text-white">TF</div>
            <div>
              <p className="text-lg font-bold text-white">TaskFlow</p>
              <p className="text-xs text-slate-400">Project collaboration</p>
            </div>
          </div>
          <button className="rounded-md p-2 text-slate-400 hover:bg-slate-900 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-900 hover:text-white',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-sm font-semibold text-white">Enterprise-ready</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Supabase auth, RLS, realtime tasks, and Cloudinary uploads are wired in.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
