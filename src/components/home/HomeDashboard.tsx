import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  HelpCircle,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Bell,
  Clock,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../data/mockData';
import { AddExpenseModal } from '../money/AddExpenseModal';
import { AddIncomeModal } from '../money/AddIncomeModal';
import { CanIAffordThisModal } from '../money/CanIAffordThisModal';
import { ReportItemModal } from '../lostfound/ReportItemModal';
import { ItemDetailsModal } from '../lostfound/ItemDetailsModal';
import { ChatModal } from '../lostfound/ChatModal';
import { CampusItem } from '../../types';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    currentBalance,
    totalExpenses,
    recommendedDailySpending,
    todaySpending,
    campusItems,
    expenses,
    setActiveTab,
    startOrOpenChat,
    currentChatSession,
    closeChat,
  } = useApp();

  const { isInstalled, isInstallable, install } = usePWAInstall();

  // Modals state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showCanIAfford, setShowCanIAfford] = useState(false);
  const [showReportItem, setShowReportItem] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Recent items filtered to university
  const recentCampusItems = campusItems.slice(0, 4);

  // Daily budget percentage
  const dailyPercent = Math.min(
    100,
    Math.round((todaySpending / recommendedDailySpending) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Top Welcome Bar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {timeGreeting}, {currentUser.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{currentUser.university}</span>
            {currentUser.verificationStatus === 'verified' && (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3 ml-0.5 inline" />
              </span>
            )}
          </p>
        </div>

        {currentUser.verificationStatus !== 'verified' && (
          <button
            onClick={() => setActiveTab('verification')}
            className="text-[11px] font-semibold py-1.5 px-3 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 hover:bg-amber-200 transition shrink-0"
          >
            🟡 Verify Account
          </button>
        )}
      </div>

      {/* Main Hero Wallet Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-900/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/90">
                Available Student Balance
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 font-display">
                {formatNaira(currentBalance)}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('money')}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition"
              title="Open Money Analytics"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          {/* Daily Budget Status Meter */}
          <div className="mt-5 p-3 rounded-2xl bg-emerald-800/50 backdrop-blur-xs border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-emerald-100">
                Today&apos;s Spending: <strong>{formatNaira(todaySpending)}</strong>
              </span>
              <span className="text-emerald-200">
                Limit: <strong>{formatNaira(recommendedDailySpending)}/day</strong>
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-emerald-950/60 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  dailyPercent > 85 ? 'bg-amber-300' : 'bg-white'
                }`}
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Buttons Grid (As instructed) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            id="quick-add-expense-btn"
            onClick={() => setShowAddExpense(true)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-sm text-left transition flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Add Expense
            </span>
            <span className="text-[10px] text-slate-400">Track food, bus</span>
          </button>

          <button
            id="quick-add-income-btn"
            onClick={() => setShowAddIncome(true)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-sm text-left transition flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Add Income
            </span>
            <span className="text-[10px] text-slate-400">Allowance, gig</span>
          </button>

          <button
            id="quick-can-i-afford-btn"
            onClick={() => setShowCanIAfford(true)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-sm text-left transition flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Can I Afford?
            </span>
            <span className="text-[10px] text-slate-400">Budget simulator</span>
          </button>

          <button
            id="quick-report-lost-btn"
            onClick={() => {
              setReportType('lost');
              setShowReportItem(true);
            }}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-sm text-left transition flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Report Lost
            </span>
            <span className="text-[10px] text-slate-400">ID, keys, phone</span>
          </button>

          <button
            id="quick-report-found-btn"
            onClick={() => {
              setReportType('found');
              setShowReportItem(true);
            }}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-sm text-left transition flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Report Found
            </span>
            <span className="text-[10px] text-slate-400">Safe handover</span>
          </button>
        </div>
      </div>

      {/* Campus Announcement / Tip Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-teal-500/10 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-500 text-white shrink-0 mt-0.5">
          <Bell className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Campus Tip: Mid-Semester Planning
            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Exam Season
            </span>
          </h4>
          <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Double check all course handouts and calculators before leaving the lecture theatres. Any unattended ID card should be submitted to the nearest Department Security Desk.
          </p>
        </div>
      </div>

      {/* Recent Lost & Found Around Campus */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Recent Campus Lost &amp; Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Items reported around {currentUser.university}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('lostfound')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {recentCampusItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition flex items-center gap-3"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    {item.type === 'lost' ? '🔎' : '📦'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.type === 'lost'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </p>
              </div>

              {item.reward && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-lg shrink-0">
                  {formatNaira(item.reward)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Spending Summary */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            Recent Spending Activity
          </h3>
          <button
            onClick={() => setActiveTab('money')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Analytics &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.slice(0, 3).map((exp) => (
            <div key={exp.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">
                  💳
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {exp.note}
                  </h5>
                  <span className="text-[10px] text-slate-400">
                    {exp.category} • {exp.date}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-display">
                -{formatNaira(exp.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PWA Install Card inside feed if not yet installed */}
      {!isInstalled && isInstallable && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold">Install StudentMate App</h4>
              <p className="text-[11px] text-slate-300">
                Add to your home screen for quick offline access.
              </p>
            </div>
          </div>
          <button
            onClick={install}
            className="py-2 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shrink-0 transition"
          >
            Install
          </button>
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} />
      <AddIncomeModal isOpen={showAddIncome} onClose={() => setShowAddIncome(false)} />
      <CanIAffordThisModal isOpen={showCanIAfford} onClose={() => setShowCanIAfford(false)} />
      <ReportItemModal
        isOpen={showReportItem}
        onClose={() => setShowReportItem(false)}
        initialType={reportType}
      />
      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenChat={(uid, iid) => startOrOpenChat(uid, iid)}
      />
      <ChatModal chatSession={currentChatSession} onClose={closeChat} />
    </div>
  );
};
