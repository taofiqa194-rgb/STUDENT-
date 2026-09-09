import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { CampusItem, ItemCategory, ItemStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditReportModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES: ItemCategory[] = [
  'Phone',
  'Laptop',
  'Electronics',
  'Student ID Card',
  'ATM Card',
  'Keys',
  'Backpack',
  'Bags',
  'Books',
  'Notebook',
  'Clothing',
  'Accessories',
  'Other',
];

export const EditReportModal: React.FC<EditReportModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { editCampusItem } = useApp();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Phone');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [status, setStatus] = useState<ItemStatus>('lost');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (item) {
      setItemName(item.itemName || item.title || '');
      setCategory(item.category || 'Other');
      setDescription(item.description || '');
      setLocation(item.location || '');
      setIdentifyingDetails(item.identifyingDetails || item.additionalDetails || '');
      setStatus(item.status || (item.type === 'lost' ? 'lost' : 'found'));
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !description.trim() || !location.trim()) {
      setErrorMessage('Please fill in item name, description, and location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await editCampusItem(item.id, item.type, {
        itemName: itemName.trim(),
        title: itemName.trim(),
        category,
        description: description.trim(),
        location: location.trim(),
        identifyingDetails: identifyingDetails.trim(),
        status,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base font-display">Edit Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="lost">🔴 Lost</option>
              <option value="found">🟢 Found</option>
              <option value="possible match">🟡 Possible Match</option>
              <option value="recovered">✅ Recovered / Returned</option>
              <option value="closed">⚪ Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Identifying Details (Optional)
            </label>
            <input
              type="text"
              value={identifyingDetails}
              onChange={(e) => setIdentifyingDetails(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
