import React from 'react';
import { motion } from 'motion/react';
import { X, Bell, Check, Sparkles, ShieldCheck, Wallet, Search, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    setActiveTab,
  } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (notifId: string, type: string) => {
    markNotificationAsRead(notifId);
    if (type === 'money') {
      setActiveTab('money');
    } else if (type === 'item_match') {
      setActiveTab('lostfound');
    } else if (type === 'verification') {
      setActiveTab('verification');
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'money':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'item_match':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        id="notification-drawer"
        className="w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base font-display">Campus Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={markAllNotificationsAsRead}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
          <button
            onClick={clearNotifications}
            className="text-slate-400 hover:text-rose-500 font-medium"
          >
            Clear all
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs px-6">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                No active notifications
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                You&apos;ll be notified of matching lost items, daily budget checks, and student updates.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.type)}
                className={`p-4 transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                  !notif.read
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold text-slate-900 dark:text-white truncate ${
                          !notif.read ? 'text-emerald-900 dark:text-emerald-300' : ''
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
