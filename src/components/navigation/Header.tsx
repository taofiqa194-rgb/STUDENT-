import React, { useState } from 'react';
import {
  Bell,
  School,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/mockData';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    darkMode,
    setDarkMode,
    changeUniversity,
    unreadNotificationsCount,
    setActiveTab,
  } = useApp();

  const [showUniSelect, setShowUniSelect] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between">
      {/* Mobile brand & Campus selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 md:hidden">
          <img src="/icon.svg" alt="StudentMate" className="w-8 h-8 rounded-xl shadow-xs" />
          <span className="font-extrabold text-base text-slate-900 dark:text-white font-display">
            StudentMate
          </span>
        </div>

        {/* University Badge Selector */}
        <div className="relative">
          <button
            onClick={() => setShowUniSelect(!showUniSelect)}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <School className="w-3.5 h-3.5 text-emerald-500" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">
              {currentUser.shortUni || currentUser.university}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUniSelect && (
            <div className="absolute left-0 mt-1 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Select Your Campus
              </p>
              {UNIVERSITIES.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    changeUniversity(u.name);
                    setShowUniSelect(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition ${
                    currentUser.university === u.name
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {u.name} ({u.shortName})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Tools: Dark mode, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2">
        {/* Dark Mode toggle for mobile */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <button
          id="header-notification-btn"
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
            {currentUser.fullName.charAt(0)}
          </div>
        </button>
      </div>
    </header>
  );
};
