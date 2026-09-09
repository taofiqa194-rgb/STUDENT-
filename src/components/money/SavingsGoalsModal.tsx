import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Target, Plus, Trash2, Edit2, Check, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SavingsGoal } from '../../types';
import { formatNaira } from '../../data/mockData';

interface SavingsGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavingsGoalsModal: React.FC<SavingsGoalsModalProps> = ({ isOpen, onClose }) => {
  const { savingsGoals, addSavingsGoal, addMoneyToGoal, updateSavingsGoal, deleteSavingsGoal } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // New goal form state
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialSaved, setInitialSaved] = useState('');
  const [category, setCategory] = useState('Tech & Gadgets');

  // Add money state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!title.trim() || !target || target <= 0) return;

    addSavingsGoal({
      title: title.trim(),
      targetAmount: target,
      savedAmount: parseFloat(initialSaved) || 0,
      category,
    });

    setTitle('');
    setTargetAmount('');
    setInitialSaved('');
    setIsCreating(false);
  };

  const handleDeposit = (goalId: string) => {
    const amount = parseFloat(depositAmount);
    if (amount && amount > 0) {
      addMoneyToGoal(goalId, amount);
      setDepositAmount('');
      setDepositGoalId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="savings-goals-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <h3 className="font-bold text-base font-display">Student Savings Goals</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Save systematically for gadgets, project materials, and fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Active Goals ({savingsGoals.length})
            </span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Cancel' : 'New Goal'}</span>
            </button>
          </div>

          {/* Create Goal Form */}
          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Create New Savings Target
              </h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Laptop, Rent Top-Up, Textbooks"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="350,000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Saved (₦)
                  </label>
                  <input
                    type="number"
                    value={initialSaved}
                    onChange={(e) => setInitialSaved(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition"
              >
                Save Target
              </button>
            </form>
          )}

          {/* Goal List */}
          {savingsGoals.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No savings goals yet. Create your first target to start saving!
            </div>
          ) : (
            <div className="space-y-3">
              {savingsGoals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
                const isDepositing = depositGoalId === goal.id;

                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          {goal.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                          {goal.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteSavingsGoal(goal.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Saved: </span>
                        <strong className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatNaira(goal.savedAmount)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Target: </span>
                        <strong className="font-bold text-slate-800 dark:text-slate-200">
                          {formatNaira(goal.targetAmount)}
                        </strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {percent}% completed
                      </span>

                      {!isDepositing ? (
                        <button
                          onClick={() => setDepositGoalId(goal.id)}
                          className="py-1 px-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 rounded-lg font-semibold text-xs transition"
                        >
                          + Add Money
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="₦ Amount"
                            className="w-24 px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={() => handleDeposit(goal.id)}
                            className="py-1 px-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setDepositGoalId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
