import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  HelpCircle,
  Target,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../data/mockData';
import { ExpenseCategory } from '../../types';
import { AddExpenseModal } from './AddExpenseModal';
import { AddIncomeModal } from './AddIncomeModal';
import { CanIAffordThisModal } from './CanIAffordThisModal';
import { SavingsGoalsModal } from './SavingsGoalsModal';

export const MoneyManagerView: React.FC = () => {
  const {
    currentBalance,
    totalIncome,
    totalExpenses,
    totalSavings,
    recommendedDailySpending,
    todaySpending,
    expenses,
    incomes,
    deleteExpense,
    spendingByCategory,
  } = useApp();

  const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Year'>('Month');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showCanIAfford, setShowCanIAfford] = useState(false);
  const [showSavingsGoals, setShowSavingsGoals] = useState(false);

  // Determine biggest spending category
  const biggestCategory = useMemo(() => {
    let maxCat: ExpenseCategory = 'Food';
    let maxAmount = 0;
    (Object.keys(spendingByCategory) as ExpenseCategory[]).forEach((cat) => {
      if (spendingByCategory[cat] > maxAmount) {
        maxAmount = spendingByCategory[cat];
        maxCat = cat;
      }
    });
    return { category: maxCat, amount: maxAmount };
  }, [spendingByCategory]);

  // Average daily spending
  const avgDailySpending = useMemo(() => {
    const days = timeframe === 'Week' ? 7 : timeframe === 'Month' ? 30 : 365;
    return Math.round(totalExpenses / (timeframe === 'Week' ? 7 : 20));
  }, [totalExpenses, timeframe]);

  // Spending chart bars for current timeframe
  const chartData = useMemo(() => {
    if (timeframe === 'Week') {
      return [
        { label: 'Mon', amount: 1200, height: '40%' },
        { label: 'Tue', amount: 2400, height: '65%' },
        { label: 'Wed', amount: 800, height: '28%' },
        { label: 'Thu', amount: 3100, height: '85%' },
        { label: 'Fri', amount: 1900, height: '52%' },
        { label: 'Sat', amount: 3500, height: '95%' },
        { label: 'Sun', amount: 1500, height: '45%' },
      ];
    } else if (timeframe === 'Month') {
      return [
        { label: 'Wk 1', amount: 8500, height: '70%' },
        { label: 'Wk 2', amount: 11200, height: '92%' },
        { label: 'Wk 3', amount: 6400, height: '55%' },
        { label: 'Wk 4', amount: 4800, height: '42%' },
      ];
    } else {
      return [
        { label: 'Jan', amount: 22000, height: '45%' },
        { label: 'Feb', amount: 28000, height: '58%' },
        { label: 'Mar', amount: 32000, height: '65%' },
        { label: 'Apr', amount: 24000, height: '50%' },
        { label: 'May', amount: 41000, height: '85%' },
        { label: 'Jun', amount: 39000, height: '80%' },
        { label: 'Jul', amount: 18000, height: '38%' },
        { label: 'Aug', amount: 45000, height: '95%' },
        { label: 'Sep', amount: 30200, height: '62%' },
      ];
    }
  }, [timeframe]);

  const categoryIcons: Record<ExpenseCategory, string> = {
    Food: '🍚',
    Transport: '🚌',
    'Data/Airtime': '📱',
    Education: '📚',
    Accommodation: '🏠',
    Entertainment: '🎮',
    Shopping: '🛍️',
    Other: '📦',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            My Money
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Smart budgeting, daily target recommendations, and expense tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-can-i-afford-btn"
            onClick={() => setShowCanIAfford(true)}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold text-xs border border-amber-200/60 dark:border-amber-800 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Can I afford this?</span>
          </button>
          <button
            id="open-savings-btn"
            onClick={() => setShowSavingsGoals(true)}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold text-xs border border-purple-200/60 dark:border-purple-800 transition"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Savings Goals</span>
          </button>
        </div>
      </div>

      {/* Main Balance Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-900/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/90">
              Current Available Balance
            </span>
            <span className="text-[11px] font-medium bg-emerald-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Campus Wallet
            </span>
          </div>

          <div className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1.5 font-display">
            {formatNaira(currentBalance)}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-50 bg-emerald-800/50 w-fit px-3 py-1.5 rounded-xl border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Recommended daily spending: <strong>{formatNaira(recommendedDailySpending)}</strong></span>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-emerald-500/30">
            <button
              id="money-add-expense-btn"
              onClick={() => setShowAddExpense(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-sm hover:bg-emerald-50 active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add Expense</span>
            </button>
            <button
              id="money-add-income-btn"
              onClick={() => setShowAddIncome(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 text-white font-bold text-xs border border-white/20 active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3 Metric Cards: Total Income, Total Expenses, Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Income</p>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {formatNaira(totalIncome)}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Expenses</p>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {formatNaira(totalExpenses)}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Allocated Savings</p>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {formatNaira(totalSavings)}
            </h4>
          </div>
        </div>
      </div>

      {/* Spending Chart & Analytics Section */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Spending Analytics
            </h3>
          </div>

          {/* Timeframe Switcher: Week | Month | Year */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['Week', 'Month', 'Year'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`py-1 px-3 text-xs font-semibold rounded-lg transition ${
                  timeframe === t
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                ₦{(item.amount / 1000).toFixed(1)}k
              </span>
              <div
                className="w-full max-w-[36px] rounded-t-lg bg-emerald-500 group-hover:bg-emerald-600 transition-all duration-300"
                style={{ height: item.height }}
              />
              <span className="text-[10px] font-semibold text-slate-400 mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Insight Callout */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-xl">💡</span>
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="font-semibold text-slate-900 dark:text-white mb-0.5">
              Financial Insight:
            </p>
            <p>
              Your <strong>{biggestCategory.category}</strong> spending represents{' '}
              {totalExpenses > 0 ? Math.round((biggestCategory.amount / totalExpenses) * 100) : 0}% of your total outlays. Average daily spending is currently <strong>{formatNaira(avgDailySpending)}</strong>.
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              &ldquo;Your food spending increased by 20% compared with last month.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Expense Categories Breakdown */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white font-display mb-4">
          Expense Categories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(Object.keys(spendingByCategory) as ExpenseCategory[]).map((cat) => {
            const amount = spendingByCategory[cat];
            const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
            return (
              <div
                key={cat}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[cat]}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {cat}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                    {formatNaira(amount)}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>{pct}% of budget</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            Recent Expenses
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {expenses.length} records logged
          </span>
        </div>

        {expenses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No expenses logged yet. Tap &ldquo;Add Expense&rdquo; above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                    {categoryIcons[exp.category] || '📦'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {exp.category}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {exp.note}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {exp.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-display">
                    -{formatNaira(exp.amount)}
                  </span>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Delete expense"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddExpenseModal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} />
      <AddIncomeModal isOpen={showAddIncome} onClose={() => setShowAddIncome(false)} />
      <CanIAffordThisModal isOpen={showCanIAfford} onClose={() => setShowCanIAfford(false)} />
      <SavingsGoalsModal isOpen={showSavingsGoals} onClose={() => setShowSavingsGoals(false)} />
    </div>
  );
};
