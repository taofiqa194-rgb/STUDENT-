import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  ShieldCheck,
  Moon,
  Sun,
  Smartphone,
  Bell,
  Lock,
  LogOut,
  HelpCircle,
  School,
  Hash,
  BookOpen,
  DollarSign,
  Download,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    darkMode,
    setDarkMode,
    setActiveTab,
    switchRole,
    logoutUser,
  } = useApp();

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [notificationToggle, setNotificationToggle] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Profile &amp; Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your student identity, security, and campus preferences
        </p>
      </div>

      {/* User Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20"
          />
          {currentUser.verificationStatus === 'verified' && (
            <div
              title="Verified Student"
              className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">
              {currentUser.fullName}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                currentUser.verificationStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : currentUser.verificationStatus === 'rejected'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              }`}
            >
              {currentUser.verificationStatus === 'verified'
                ? '🟢 Verified'
                : currentUser.verificationStatus === 'rejected'
                ? '🔴 Rejected'
                : '🟡 Pending Verification'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentUser.email}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
              🏫 {currentUser.university}
            </span>
            {currentUser.level && (
              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                🎓 {currentUser.level}
              </span>
            )}
            {currentUser.matricNumber && (
              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl font-mono text-[11px]">
                Matric: {currentUser.matricNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Action Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Student Identity Verification
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Submit or update your university matriculation details for safe lost &amp; found recovery.
            </p>
          </div>
        </div>

        <button
          id="profile-verification-btn"
          onClick={() => setActiveTab('verification')}
          className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs rounded-xl shrink-0 transition"
        >
          Check Status
        </button>
      </div>

      {/* App Preferences */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Preferences &amp; Device
        </h3>

        {/* Dark Mode */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Dark Theme</p>
              <p className="text-[11px] text-slate-400">Easy on the eyes for night study sessions</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              darkMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Currency setting */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              ₦
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Currency Preference</p>
              <p className="text-[11px] text-slate-400">Nigerian Naira (₦ NGN)</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Active Default
          </span>
        </div>

        {/* In-app Notifications */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Match &amp; Chat Alerts</p>
              <p className="text-[11px] text-slate-400">Notify when matching lost item is found</p>
            </div>
          </div>

          <button
            onClick={() => setNotificationToggle(!notificationToggle)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationToggle ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationToggle ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Permanent "Install App" Option inside Profile as requested */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">📱 Install StudentMate App</p>
              <p className="text-[11px] text-slate-400">
                {isInstalled
                  ? 'Application is currently installed on this device'
                  : 'Fast home screen launch with offline database sync'}
              </p>
            </div>
          </div>

          {!isInstalled ? (
            <button
              id="profile-install-app-btn"
              onClick={install}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Install App
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Installed
            </span>
          )}
        </div>
      </div>

      {/* Evaluator & Role Switching Tools */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <ShieldAlert className="w-4 h-4 text-purple-600" />
          <span>Evaluator Demo Switcher</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Switch between regular student mode and verified campus admin mode to test user verification approvals and item moderation.
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => switchRole('student')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              currentUser.role === 'student'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            👤 Student View ({currentUser.fullName.split(' ')[0]})
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              currentUser.role === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            🛡️ Admin Panel
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logoutUser}
        className="w-full py-3 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-100 transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out from Campus Session</span>
      </button>
    </div>
  );
};
