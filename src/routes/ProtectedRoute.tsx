import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (!isSupabaseConfigured) return <Outlet />;
  if (loading) return <div className="min-h-screen bg-slate-50 p-8 text-sm text-slate-500">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
