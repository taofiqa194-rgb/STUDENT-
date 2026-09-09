import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, FileText, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncomeSource } from '../../types';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOURCES: { label: IncomeSource; icon: string }[] = [
  { label: 'Allowance', icon: '👨‍👩‍👧' },
  { label: 'Salary', icon: '💼' },
  { label: 'Business', icon: '🏪' },
  { label: 'Freelance', icon: '💻' },
  { label: 'Gift', icon: '🎁' },
  { label: 'Other', icon: '💵' },
];

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose }) => {
  const { addIncome } = useApp();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<IncomeSource>('Allowance');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid income amount in Naira.');
      return;
    }
    if (!note.trim()) {
      setError('Please write a short note for this income.');
      return;
    }

    addIncome({
      amount: numAmount,
      source,
      date,
      note: note.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="add-income-modal"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💵</span>
            <h3 className="font-bold text-base font-display">Add Income</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-emerald-600 dark:text-emerald-400">
                ₦
              </span>
              <input
                id="income-amount-input"
                type="number"
                step="100"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="20,000"
                className="w-full pl-8 pr-4 py-2.5 text-lg font-bold text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Income Source
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSource(s.label)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium transition border ${
                    source === s.label
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-xs'
                      : 'border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg mb-1">{s.icon}</span>
                  <span className="text-[11px] truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date Received
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="income-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="income-note-input"
                type="text"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Monthly allowance from Dad, Tutorial payout"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                required
              />
            </div>
          </div>

          <button
            id="save-income-btn"
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Income</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
