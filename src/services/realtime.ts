import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function subscribeToWorkspace(workspaceId: string, onChange: () => void): RealtimeChannel {
  return supabase
    .channel(`workspace:${workspaceId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks', filter: `workspace_id=eq.${workspaceId}` },
      onChange,
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, onChange)
    .subscribe();
}
