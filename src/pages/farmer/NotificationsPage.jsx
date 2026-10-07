import { useState } from 'react';
import { PageHeader, AlertCard } from '../../components/ui/index';
import { NOTIFICATIONS } from '../../data/mockData';
import { CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notifications`}
        breadcrumb="Notifications"
        actions={
          unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-200 rounded-xl px-4 py-2 hover:bg-green-50 transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Mark All as Read
            </button>
          )
        }
      />

      {notifs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-3">🔔</p>
          <h3 className="font-semibold text-gray-700 mb-1">No notifications</h3>
          <p className="text-gray-400 text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`cursor-pointer rounded-2xl border transition-all ${n.read ? 'bg-white border-gray-100 opacity-70' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}
            >
              <div className={`p-4 flex items-start gap-3 ${!n.read ? 'border-l-4 rounded-l-2xl ' + (n.color === 'red' ? 'border-l-red-500' : n.color === 'yellow' ? 'border-l-amber-500' : n.color === 'green' ? 'border-l-green-500' : 'border-l-blue-500') : ''}`}>
                <div className="flex-shrink-0 text-xl mt-0.5">
                  {n.color === 'red' ? '🔴' : n.color === 'yellow' ? '🟡' : n.color === 'green' ? '🟢' : n.color === 'orange' ? '🟠' : 'ℹ️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${n.read ? 'text-gray-500' : 'text-gray-800'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
