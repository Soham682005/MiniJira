import { Avatar } from './common/Avatar';
import { relativeTime } from '../utils/format';
import type { ActivityLog } from '../types';

export function ActivityTimeline({ activity }: { activity: ActivityLog[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
      <div className="mt-4 space-y-4">
        {activity.map((item) => (
          <div key={item.id} className="flex gap-3">
            <Avatar name={item.profile?.full_name} size="sm" />
            <div>
              <p className="text-sm text-slate-700">
                <span className="font-medium text-slate-950">{item.profile?.full_name ?? 'Team member'}</span> {item.action}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{relativeTime(item.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
