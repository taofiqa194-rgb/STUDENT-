import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, HelpCircle, CheckCircle2, AlertTriangle, XCircle, Calculator, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../data/mockData';

interface CanIAffordThisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanIAffordThisModal: React.FC<CanIAffordThisModalProps> = ({ isOpen, onClose }) => {
  const { currentBalance } = useApp();

  const [spendAmount, setSpendAmount] = useState('');
  const [balance, setBalance] = useState(currentBalance.toString());
  const [daysUntilIncome, setDaysUntilIncome] = useState('20');
  const [expectedNextIncome, setExpectedNextIncome] = useState('30000');
  const [itemLabel, setItemLabel] = useState('');

  if (!isOpen) return null;

  const plannedSpend = parseFloat(spendAmount) || 0;
  const currBal = parseFloat(balance) || 0;
  const days = Math.max(1, parseInt(daysUntilIncome) || 1);
  const remaining = currBal - plannedSpend;
  const currentDaily = Math.round(currBal / days);
  const newDaily = Math.round(remaining / days);

  // Verdict calculation
  const percentOfBalance = currBal > 0 ? (plannedSpend / currBal) * 100 : 100;
  const isAffordable = remaining >= 5000 && newDaily >= 750;
  const isTight = remaining >= 0 && !isAffordable;
  const isOverbudget = remaining < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="afford-modal"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤔</span>
            <div>
              <h3 className="font-bold text-base font-display">Can I afford this?</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Student budgeting estimator &amp; spending simulator
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

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              What do you want to buy? (Optional)
            </label>
            <input
              type="text"
              value={itemLabel}
              onChange={(e) => setItemLabel(e.target.value)}
              placeholder="e.g. New Shoes, Course Handout, Weekend Hangout"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount to Spend (₦)
              </label>
              <input
                id="afford-amount-input"
                type="number"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                placeholder="5,000"
                className="w-full px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Balance (₦)
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Days until next money/allowance
              </label>
              <input
                type="number"
                value={daysUntilIncome}
                onChange={(e) => setDaysUntilIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Next Income (₦)
              </label>
              <input
                type="number"
                value={expectedNextIncome}
                onChange={(e) => setExpectedNextIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Results Card */}
          {plannedSpend > 0 ? (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isOverbudget
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  : isTight
                  ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isOverbudget ? (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span className="font-bold text-sm text-rose-700 dark:text-rose-300">
                      Not Recommended Right Now
                    </span>
                  </>
                ) : isTight ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-sm text-amber-700 dark:text-amber-300">
                      Proceed with Caution
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                      Looks Safe to Spend!
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <p>
                  After this purchase, you would have{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {formatNaira(Math.max(0, remaining))}
                  </strong>{' '}
                  remaining {remaining < 0 && <span className="text-rose-600 font-bold">(₦{Math.abs(remaining).toLocaleString()} deficit!)</span>}.
                </p>
                <p>
                  Your recommended daily budget would become{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {formatNaira(Math.max(0, newDaily))}
                  </strong>{' '}
                  per day for the next {days} days (down from {formatNaira(currentDaily)}/day).
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  This purchase represents <strong>{percentOfBalance.toFixed(0)}%</strong> of your available student funds.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <Calculator className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter an amount above to preview how it impacts your daily student budget.
              </p>
            </div>
          )}

          {/* Friendly Disclaimer as instructed */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Budgeting Estimate:</strong> This calculation is designed to help you plan your campus spending responsibly and is not professional financial advice.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold text-xs rounded-xl transition"
          >
            Close Calculator
          </button>
        </div>
      </motion.div>
    </div>
  );
};
