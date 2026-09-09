import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  School,
  Tag,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { CampusItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { EditReportModal } from './EditReportModal';

interface ItemDetailsModalProps {
  item: CampusItem | null;
  onClose: () => void;
  onOpenChat: (userId: string, itemId?: string) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onOpenChat,
}) => {
  const { currentUser, markItemRecoveredAction, deleteCampusItem } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  if (!item) return null;

  // Compute all available images
  const images: string[] = [];
  if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
    images.push(...item.imageUrls);
  } else if (item.imageUrl) {
    images.push(item.imageUrl);
  }

  const isOwner =
    currentUser?.id &&
    (item.userId === currentUser.id ||
      item.reportedBy?.id === currentUser.id ||
      item.reporterId === currentUser.id);

  const displayTitle = item.itemName || item.title || 'Campus Item';
  const displayLocation = item.location || 'Campus';
  const displayDate = item.dateLost || item.dateFound || item.date || 'Recent';
  const displayTime = item.timeLost || item.timeFound || item.time;
  const displayInstitution =
    item.institution || item.university || currentUser?.institution || 'Campus';

  const handleMarkResolved = async () => {
    setIsResolving(true);
    try {
      await markItemRecoveredAction(item.id, item.type);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Could not update item status.');
    } finally {
      setIsResolving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteCampusItem(item.id, item.type);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Could not delete report.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContactReporter = () => {
    const targetUserId = item.userId || item.reportedBy?.id || item.reporterId || 'reporter';
    onOpenChat(targetUserId, item.id);
    onClose();
  };

  return (
    <>
      <div
        id="item-details-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          id="item-details-modal"
          className="w-full max-w-xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.type === 'lost' ? '🔴' : '🟢'}</span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.type === 'lost' ? 'Lost Item Report' : 'Found Item Report'}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg font-display line-clamp-1">
                  {displayTitle}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Image Gallery */}
            {images.length > 0 ? (
              <div className="space-y-2">
                <div className="relative aspect-video sm:aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                  <img
                    src={images[activeImageIndex] || images[0]}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                        item.status === 'lost'
                          ? 'bg-rose-600 text-white'
                          : item.status === 'found'
                          ? 'bg-emerald-600 text-white'
                          : item.status === 'possible match'
                          ? 'bg-amber-500 text-white'
                          : item.status === 'recovered'
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {item.status || item.type}
                    </span>
                  </div>
                </div>

                {/* Thumbnails if multiple images */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                          activeImageIndex === idx
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
                <Tag className="w-8 h-8 mb-1 text-slate-300" />
                <span className="text-xs font-semibold">No photos attached</span>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Location</p>
                  <p className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {displayLocation}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">
                    {item.type === 'lost' ? 'Date Lost' : 'Date Found'}
                  </p>
                  <p className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {displayDate} {displayTime ? `(${displayTime})` : ''}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Category</p>
                  <p className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {item.category || 'General'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Institution</p>
                  <p className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {displayInstitution}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {item.description || 'No additional description provided.'}
              </p>
            </div>

            {/* Identifying Details if available */}
            {(item.identifyingDetails || item.additionalDetails) && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Identifying Characteristics
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                  {item.identifyingDetails || item.additionalDetails}
                </p>
              </div>
            )}

            {/* Campus Safety Reminder */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-slate-800 dark:text-slate-200">
                  Privacy & Safety First:
                </strong>
                Private contact info is kept confidential. Please meet in open campus locations
                such as the Library reception, Department desk, or Security office.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-2.5 shrink-0">
            {isOwner ? (
              <>
                <button
                  type="button"
                  id="mark-recovered-btn"
                  disabled={isResolving || item.status === 'recovered'}
                  onClick={handleMarkResolved}
                  className="flex-1 py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {item.status === 'recovered'
                      ? 'Marked as Recovered'
                      : item.type === 'lost'
                      ? 'Mark as Recovered'
                      : 'Mark as Claimed'}
                  </span>
                </button>

                <button
                  type="button"
                  id="edit-report-btn"
                  onClick={() => setShowEditModal(true)}
                  className="py-2.5 px-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4 text-emerald-500" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  id="delete-report-btn"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="py-2.5 px-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                id="contact-reporter-btn"
                onClick={handleContactReporter}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-900/15 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Reporter</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditReportModal
          item={item}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
