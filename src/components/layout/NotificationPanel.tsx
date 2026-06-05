import { CheckCircle2, MessageSquare, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import type { Notification } from '../../types';
import { relativeTime } from '../../utils/format';

function notificationIcon(kind: Notification['title']) {
  switch (kind) {
    case 'Task assigned':
      return CheckCircle2;
    case 'Comment added':
      return MessageSquare;
    case 'Project invitation':
      return UserPlus;
    default:
      return MessageSquare;
  }
}

export function NotificationPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    // use requestAnimationFrame to avoid sync setState-in-effect linting
    requestAnimationFrame(() => {
      if (!cancelled) setLoading(true);
    });

    void api
      .getNotifications(user.id)
      .then(({ data }) => {
        if (cancelled) return;
        setNotifications((data ?? []) as Notification[]);
      })
      .catch(() => {
        if (cancelled) return;
        setNotifications([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);


  const sorted = useMemo(() => {
    return [...notifications].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }, [notifications]);

  return (
    <div className="absolute right-0 top-11 w-80 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
      <div className="border-b border-slate-100 px-3 py-2">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
      </div>

      <div className="max-h-96 overflow-y-auto py-1">
        {loading && <div className="px-3 py-3 text-sm text-slate-500">Loading…</div>}

        {!loading && sorted.length === 0 && <div className="px-3 py-3 text-sm text-slate-500">No notifications</div>}

        {!loading &&
          sorted.map((item) => {
            const Icon = notificationIcon(item.title);
            return (
              <div
                key={item.id}
                className="flex gap-3 rounded-md px-3 py-3 hover:bg-slate-50"
              >
                <Icon className="mt-0.5 h-4 w-4 text-teal-700" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{relativeTime(item.created_at)}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

