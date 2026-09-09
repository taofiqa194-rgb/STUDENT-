import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Upload,
  AlertCircle,
  Tag,
  HelpCircle,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ItemCategory, ItemType } from '../../types';

interface ReportItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'lost' | 'found';
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

export const ReportItemModal: React.FC<ReportItemModalProps> = ({
  isOpen,
  onClose,
  initialType = 'lost',
}) => {
  const { reportLostItemAction, reportFoundItemAction, currentUser } = useApp();

  const [type, setType] = useState<'lost' | 'found'>(initialType);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Phone');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');

  // Multiple image upload files & previews
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - imageFiles.length); // limit to 5 images
    const updatedFiles = [...imageFiles, ...newFiles];
    setImageFiles(updatedFiles);

    // Generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!itemName.trim()) {
      setErrorMessage('Please provide the item name.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a short description.');
      return;
    }
    if (!location.trim()) {
      setErrorMessage(
        type === 'lost'
          ? 'Please enter the last known location.'
          : 'Please enter the location where the item was found.'
      );
      return;
    }
    if (!date) {
      setErrorMessage('Please select the date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === 'lost') {
        await reportLostItemAction({
          itemName: itemName.trim(),
          category,
          description: description.trim(),
          location: location.trim(),
          dateLost: date,
          timeLost: time.trim(),
          imageFiles,
          identifyingDetails: identifyingDetails.trim(),
          institution: currentUser?.institution || currentUser?.university,
        });
        setSuccessMessage('Your lost item has been reported successfully.');
      } else {
        await reportFoundItemAction({
          itemName: itemName.trim(),
          category,
          description: description.trim(),
          location: location.trim(),
          dateFound: date,
          timeFound: time.trim(),
          imageFiles,
          identifyingDetails: identifyingDetails.trim(),
          institution: currentUser?.institution || currentUser?.university,
        });
        setSuccessMessage('Found item reported successfully.');
      }

      // Reset form after short delay and close modal
      setTimeout(() => {
        setItemName('');
        setDescription('');
        setLocation('');
        setTime('');
        setIdentifyingDetails('');
        setImageFiles([]);
        setImagePreviews([]);
        setSuccessMessage('');
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="report-item-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="report-item-modal"
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              {type === 'lost' ? <Search className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-extrabold text-base font-display">
                {type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {type === 'lost'
                  ? 'Let campus peers know what you are looking for'
                  : 'Help return a found item safely to its rightful owner'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle Tabs */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              id="report-tab-lost"
              onClick={() => setType('lost')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                type === 'lost'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>🔴 Report Lost</span>
            </button>
            <button
              type="button"
              id="report-tab-found"
              onClick={() => setType('found')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                type === 'found'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>🟢 Report Found</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              id="report-item-name-input"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={
                type === 'lost'
                  ? 'e.g. Black Samsung Galaxy A54 in blue case'
                  : 'e.g. HP Laptop Charger with black tape'
              }
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              id="report-item-category-select"
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              required
              id="report-item-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'lost'
                  ? 'Describe color, model, brand, key marks, and what was inside if applicable...'
                  : 'Describe the condition and key visible characteristics without revealing hidden secrets...'
              }
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
            />
          </div>

          {/* Location & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'lost' ? 'Last Known Location *' : 'Location Found *'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  id="report-item-location-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Science Lecture Theatre, Library 2nd floor"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'lost' ? 'Date Lost *' : 'Date Found *'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  id="report-item-date-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Approximate Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Approximate Time (Optional)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="report-item-time-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. Around 2:00 PM / Morning lecture"
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          {/* Images Upload (Firebase Storage) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload Images (Up to 5 images)
              </label>
              <span className="text-[11px] text-slate-400">
                {imageFiles.length}/5 uploaded
              </span>
            </div>

            {/* Previews grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group"
                  >
                    <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imageFiles.length < 5 && (
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30">
                <Camera className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Click or drag photos here
                </span>
                <span className="text-[10px] text-slate-400">
                  Compressed & uploaded safely to Firebase Storage
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Optional Identifying Details */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Optional Identifying Details / Verification
              </label>
              <span className="text-[10px] text-slate-400">
                {type === 'found' ? 'To verify claimant' : 'Private marks'}
              </span>
            </div>
            <input
              type="text"
              id="report-item-identifying-input"
              value={identifyingDetails}
              onChange={(e) => setIdentifyingDetails(e.target.value)}
              placeholder={
                type === 'lost'
                  ? 'e.g. Has a small heart sticker on the bottom left corner'
                  : 'e.g. Name on notebook / lock screen picture question'
              }
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              id={type === 'lost' ? 'submit-lost-item-btn' : 'submit-found-item-btn'}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                type === 'lost'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting to Firebase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{type === 'lost' ? 'Submit Lost Item' : 'Submit Found Item'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
