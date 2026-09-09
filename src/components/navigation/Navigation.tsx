import React, { useState } from 'react';
import {
  Home,
  Wallet,
  Search,
  ShieldCheck,
  User,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationsModal } from '../notifications/NotificationsModal';
import { AuthModal } from '../auth/AuthModal';

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
    currentUser,
    darkMode,
    setDarkMode,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'money', label: 'Money', icon: Wallet },
    { id: 'lostfound', label: 'Lost & Found', icon: Search },
    {
      id: currentUser.role === 'admin' ? 'admin' : 'verification',
      label: currentUser.role === 'admin' ? 'Admin' : 'Verify',
      icon: currentUser.role === 'admin' ? ShieldAlert : ShieldCheck,
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 shrink-0 justify-between sticky top-0 h-screen z-30">
        <div>
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <img src="/icon.svg" alt="StudentMate" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-display bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                StudentMate
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Campus Life Companion</p>
            </div>
          </div>

          {/* Current Campus Pill */}
          <div className="mb-6 px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium truncate text-slate-700 dark:text-slate-300">
              {currentUser.university}
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'home' && unreadNotificationsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Sidebar Bottom Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-2.5">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {darkMode ? 'On' : 'Off'}
            </span>
          </button>

          {/* User Profile Footer */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {currentUser.role} • {currentUser.verificationStatus}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/icon.svg" alt="StudentMate" className="w-7 h-7 rounded-xl" />
            <div>
              <span className="font-extrabold text-base tracking-tight font-display bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                StudentMate
              </span>
              <p className="text-[9px] text-slate-400 truncate max-w-[150px]">
                {currentUser.university}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="ml-1 ring-2 ring-emerald-500/20 rounded-full"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Render Page Content */}
        <main className="flex-1">{children}</main>

        {/* Mobile Bottom Navigation (Strictly as instructed) */}
        <nav
          id="mobile-bottom-nav"
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.id === 'home' && unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Auth Modal for manual sign-in / registration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
