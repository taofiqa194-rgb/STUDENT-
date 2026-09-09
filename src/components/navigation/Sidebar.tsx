import React from 'react';
import {
  Home,
  Wallet,
  Search,
  User,
  ShieldCheck,
  ShieldAlert,
  Moon,
  Sun,
  Smartphone,
  LogOut,
  Sparkles,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    darkMode,
    setDarkMode,
    logoutUser,
  } = useApp();

  const { isInstallable, isInstalled, install } = usePWAInstall();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'money', label: 'Student Money', icon: Wallet },
    { id: 'lostfound', label: 'Lost & Found', icon: Search },
    { id: 'verification', label: 'Student ID Check', icon: ShieldCheck },
    { id: 'profile', label: 'Profile & Settings', icon: User },
    ...(currentUser.role === 'admin'
      ? [{ id: 'admin', label: 'Admin Console', icon: ShieldAlert }]
      : []),
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-5 select-none shrink-0"
    >
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center p-2 shadow-md shadow-emerald-600/20">
            <img src="/icon.svg" alt="StudentMate" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white font-display tracking-tight">
              StudentMate
            </span>
            <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              Campus Hub
            </span>
          </div>
        </div>

        {/* User Mini Profile Card */}
        <div
          onClick={() => setActiveTab('profile')}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser.fullName}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {currentUser.shortUni || currentUser.university}
            </p>
          </div>
          {currentUser.verificationStatus === 'verified' && (
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id as unknown as Parameters<typeof setActiveTab>[0])}
                className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar utilities */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* PWA Install Button if not yet installed */}
        {!isInstalled && (
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                alert('Add to your desktop or phone home screen from your browser menu.');
              }
            }}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Install App</span>
            </span>
            <Download className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Theme switch */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
        >
          <span className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {darkMode ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-2 py-2 px-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
