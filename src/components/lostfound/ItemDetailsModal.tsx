import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageCircle,
  AlertTriangle,
  Gift,
  CheckCircle2,
  Building,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusItem } from '../../types';
import { formatNaira } from '../../data/mockData';

interface ItemDetailsModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (item: CampusItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenChat,
}) => {
  const { markItemStatus, currentUser, getMatchesForItem } = useApp();
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  if (!isOpen || !item) return null;

  const matches = getMatchesForItem(item);
  const isOwner = item.reporterId === currentUser.id;

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => {
      onOpenChat(item);
      onClose();
    }, 1200);
  };

  const handleMarkResolved = () => {
    markItemStatus(item.id, 'resolved');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="item-details-modal"
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Item Image Header with Badges */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 dark:bg-slate-800">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">
              📦
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Status badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                item.type === 'lost'
                  ? 'bg-rose-500/90 text-white'
                  : 'bg-emerald-500/90 text-white'
              }`}
            >
              {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white backdrop-blur-md">
              {item.category}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {item.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Reporter info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                {item.reporterName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.reporterName}
                  </h4>
                  {item.reporterVerified && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.type === 'lost' ? 'Reported Lost' : 'Reported Found'} • {item.date}
                </p>
              </div>
            </div>

            {item.reward && item.reward > 0 && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  Reward
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-display block mt-0.5">
                  {formatNaira(item.reward)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description &amp; Identifying Details
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              {item.description}
            </p>
          </div>

          {/* Safe handover location */}
          {item.safeHandoverPoint && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200">
              <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Official Safe Handover Point: </span>
                <span>{item.safeHandoverPoint}</span>
              </div>
            </div>
          )}

          {/* Security Warning as instructed */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Campus Safety Reminder:</strong>
              Never pay before seeing your item. Meet in public campus locations (Faculty Office, Security Gate, Library).
            </div>
          </div>

          {/* Verification question if found item */}
          {item.type === 'found' && item.verificationQuestion && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
                <span>Verification Question by Finder:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                &ldquo;{item.verificationQuestion}&rdquo;
              </p>

              {showVerificationInput ? (
                <form onSubmit={handleClaim} className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={claimAnswer}
                    onChange={(e) => setClaimAnswer(e.target.value)}
                    placeholder="Type your answer to prove ownership..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-hidden"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition"
                  >
                    Send Answer to Finder
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVerificationInput(true)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Answer this question to claim item →
                </button>
              )}
            </div>
          )}

          {claimSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verification submitted! Opening safe private chat...</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {!isOwner ? (
              <button
                id="contact-finder-btn"
                onClick={() => {
                  onOpenChat(item);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {item.type === 'lost' ? 'Contact Owner / I Found This' : 'Contact Finder / This Is Mine'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleMarkResolved}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mark as Returned / Resolved</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
