import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Camera,
  HelpCircle,
  Shield,
  Upload,
  AlertCircle,
  Tag,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusLocation, ItemCategory } from '../../types';
import { CAMPUS_LOCATIONS } from '../../data/mockData';

interface ReportItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'lost' | 'found';
}

const CATEGORIES: ItemCategory[] = [
  'Student ID Card',
  'Phone',
  'Laptop',
  'Keys',
  'Backpack',
  'ATM Card',
  'Earbuds',
  'Notebook',
  'Other',
];

const HANDOVER_POINTS = [
  'Main Campus Security Post',
  'Faculty Office Desk',
  'Department Secretary',
  'Dean of Student Affairs Office',
  'Library Front Reception',
  'With finder (Private chat meetup)',
];

export const ReportItemModal: React.FC<ReportItemModalProps> = ({
  isOpen,
  onClose,
  initialType = 'lost',
}) => {
  const { reportCampusItem, currentUser } = useApp();

  const [type, setType] = useState<'lost' | 'found'>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Student ID Card');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<CampusLocation>('University Library');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reward, setReward] = useState('');
  const [safeHandoverPoint, setSafeHandoverPoint] = useState(HANDOVER_POINTS[0]);
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [contactPreference, setContactPreference] = useState<'chat' | 'whatsapp'>('chat');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [matchNotice, setMatchNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and description.');
      return;
    }

    const newItem = reportCampusItem({
      type,
      title: title.trim(),
      category,
      description: description.trim(),
      location,
      date,
      reward: reward ? parseFloat(reward) : undefined,
      safeHandoverPoint: type === 'found' ? safeHandoverPoint : undefined,
      verificationQuestion: type === 'found' && verificationQuestion.trim() ? verificationQuestion.trim() : undefined,
      contactPreference,
      imageUrl:
        imagePreview ||
        (type === 'lost'
          ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'),
    });

    onClose();
  };

  const handleSimulatePhoto = () => {
    // Pick sample realistic photo based on category
    if (category === 'Phone') {
      setImagePreview('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80');
    } else if (category === 'Laptop') {
      setImagePreview('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80');
    } else if (category === 'Keys') {
      setImagePreview('https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80');
    } else {
      setImagePreview('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="report-item-modal"
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{type === 'lost' ? '🔎' : '📦'}</span>
            <div>
              <h3 className="font-bold text-base font-display">
                Report {type === 'lost' ? 'Lost Item' : 'Found Item'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Helping campus peers recover belongings safely
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

        {/* Tab switch between Lost and Found */}
        <div className="p-5 pb-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                type === 'lost'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              🔴 I Lost an Item
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                type === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              🟢 I Found an Item
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 pt-2 space-y-3.5 max-h-[72vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Item Title
            </label>
            <input
              id="item-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder={
                type === 'lost'
                  ? 'e.g. Black iPhone 13 in Navy Pouch'
                  : 'e.g. Silver Dell Charger with red tape'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              required
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="item-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'lost' ? 'Location Where Lost' : 'Location Where Found'}
              </label>
              <select
                id="item-location-select"
                value={location}
                onChange={(e) => setLocation(e.target.value as CampusLocation)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Optional Reward / Safe Handover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'lost' ? 'Date Lost' : 'Date Found'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                required
              />
            </div>

            {type === 'lost' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Reward (₦)
                </label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="e.g. 5,000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Safe Handover Point
                </label>
                <select
                  value={safeHandoverPoint}
                  onChange={(e) => setSafeHandoverPoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {HANDOVER_POINTS.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Verification Question for Found Items */}
          {type === 'found' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Verification Question (To confirm genuine owner)
              </label>
              <input
                type="text"
                value={verificationQuestion}
                onChange={(e) => setVerificationQuestion(e.target.value)}
                placeholder="e.g. What is the lock screen wallpaper? Or what name is on the card?"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Claimants will answer this before retrieving the item.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description &amp; Identifying Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, stickers, scratches, or marks. Don't reveal full secret passwords or codes."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
              required
            />
          </div>

          {/* Photo upload / simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Photo (Optional)
            </label>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-32">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulatePhoto}
                className="w-full py-3 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                <Camera className="w-4 h-4 text-slate-400" />
                <span>Upload or attach photo</span>
              </button>
            )}
          </div>

          {/* Privacy & Safe Contact */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safe Contact Policy</span>
            </div>
            <p>
              Your phone number and private student email are kept hidden. Campus peers contact you via secure in-app chat.
            </p>
          </div>

          <button
            id="submit-item-report-btn"
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Report</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
