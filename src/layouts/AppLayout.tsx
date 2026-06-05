import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { useAppStore } from '../store/appStore';
import { isSupabaseConfigured } from '../lib/supabase';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loadWorkspaces = useAppStore((state) => state.loadWorkspaces);

  useEffect(() => {
    if (isSupabaseConfigured) void loadWorkspaces();
  }, [loadWorkspaces]);

  return (
    <div className="min-h-screen bg-[#eef2f7] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          {!isSupabaseConfigured && (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 lg:px-6">
              Demo mode: add Supabase and Cloudinary variables to `.env` to enable live authentication, realtime data, and uploads.
            </div>
          )}
          <main className="p-4 lg:p-6 xl:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
