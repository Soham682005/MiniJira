import { Bell, LogOut, Menu, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { NotificationPanel } from './NotificationPanel';
import { authService } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.user_metadata.full_name ?? user?.email ?? 'TaskFlow User';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <form
          className="hidden h-10 min-w-80 items-center gap-2 rounded-md border border-stone-300 bg-stone-50 px-3 text-sm text-slate-500 shadow-inner md:flex"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/search${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ''}`);
          }}
        >
          <Search className="h-4 w-4" />
          <input
            className="h-full flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
            placeholder="Search projects, tasks, members"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Button className="hidden sm:inline-flex" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/projects?newTask=1')}>New task</Button>
        <div className="relative">
          <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          {notificationsOpen && <NotificationPanel />}
        </div>
        <Avatar name={name} />
        <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={() => authService.signOut()} aria-label="Log out">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
