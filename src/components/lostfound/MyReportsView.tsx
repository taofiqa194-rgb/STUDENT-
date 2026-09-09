import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { CampusItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ItemDetailsModal } from './ItemDetailsModal';
import { EditReportModal } from './EditReportModal';

interface MyReportsViewProps {
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onOpenChat: (userId: string, itemId?: string) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  onOpenReportModal,
  onOpenChat,
}) => {
  const {
    campusItems,
    currentUser,
    markItemRecoveredAction,
    deleteCampusItem,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<CampusItem | null>(null);

  // Filter user's personal reports
  const myReports = useMemo(() => {
    if (!currentUser?.id) return [];
    return campusItems.filter(
      (item) =>
        item.userId === currentUser.id ||
        item.reportedBy?.id === currentUser.id ||
        item.reporterId === currentUser.id
    );
  }, [campusItems, currentUser]);

  const filteredReports = useMemo(() => {
    if (activeTab === 'all') return myReports;
    return myReports.filter((item) => item.type === activeTab);
  }, [myReports, activeTab]);

  const handleMarkRecovered = async (item: CampusItem) => {
    try {
      await markItemRecoveredAction(item.id, item.type);
    } catch (err: any) {
      alert(err.message || 'Could not update status');
    }
  };

  const handleDelete = async (item: CampusItem) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteCampusItem(item.id, item.type);
    } catch (err: any) {
      alert(err.message || 'Could not delete report');
    }
  };

  return (
    <div className="space-y-4">
      {/* Subheader & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            My Lost &amp; Found Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal submissions, update statuses, or remove resolved items
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            All ({myReports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'lost'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Lost ({myReports.filter((r) => r.type === 'lost').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('found')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'found'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Found ({myReports.filter((r) => r.type === 'found').length})
          </button>
        </div>
      </div>

      {/* Reports List / Empty state */}
      {filteredReports.length === 0 ? (
        <div className="py-14 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              You haven&apos;t submitted any Lost &amp; Found reports.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Whenever you report a lost item or report finding someone&apos;s belonging, it will appear here for easy management.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenReportModal('lost')}
              className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Lost Item</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenReportModal('found')}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Found Item</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredReports.map((item) => {
            const displayTitle = item.itemName || item.title;
            const primaryImg =
              (item.imageUrls && item.imageUrls[0]) || item.imageUrl;
            const isResolved = item.status === 'recovered' || item.status === 'closed';

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-18 h-18 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {primaryImg ? (
                      <img
                        src={primaryImg}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{item.type === 'lost' ? '🔴' : '🟢'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          item.status === 'lost'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : item.status === 'found'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : item.status === 'recovered'
                            ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.status || item.type}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.dateLost || item.dateFound || item.date}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {displayTitle}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* Owner action buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1.5">
                    {!isResolved && (
                      <button
                        type="button"
                        onClick={() => handleMarkRecovered(item)}
                        className="py-1 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Recovered</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setItemToEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Edit Report"
                    >
                      <Edit3 className="w-4 h-4 text-emerald-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-500 transition"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenChat={onOpenChat}
      />

      {itemToEdit && (
        <EditReportModal
          item={itemToEdit}
          isOpen={!!itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSaved={() => setItemToEdit(null)}
        />
      )}
    </div>
  );
};
