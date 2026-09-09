import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Tag,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusItem, CampusLocation, ItemCategory } from '../../types';
import { CAMPUS_LOCATIONS, formatNaira } from '../../data/mockData';
import { ReportItemModal } from './ReportItemModal';
import { ItemDetailsModal } from './ItemDetailsModal';
import { ChatModal } from './ChatModal';

export const LostAndFoundView: React.FC = () => {
  const {
    campusItems,
    matchedItemsNotice,
    clearMatchedNotice,
    startOrOpenChat,
    currentChatSession,
    closeChat,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalType, setReportModalType] = useState<'lost' | 'found'>('lost');
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return campusItems.filter((item) => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
      }

      return true;
    });
  }, [campusItems, filterType, selectedCategory, selectedLocation, searchQuery]);

  const handleOpenReport = (type: 'lost' | 'found') => {
    setReportModalType(type);
    setShowReportModal(true);
  };

  const handleOpenChatWithUser = (userId: string, itemId?: string) => {
    startOrOpenChat(userId, itemId);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Campus Lost &amp; Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Report lost possessions or help return discovered items safely
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="report-lost-btn"
            onClick={() => handleOpenReport('lost')}
            className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Lost Item</span>
          </button>
          <button
            id="report-found-btn"
            onClick={() => handleOpenReport('found')}
            className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Found Item</span>
          </button>
        </div>
      </div>

      {/* Automated Match Detection Banner as specified */}
      <AnimatePresence>
        {matchedItemsNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-blue-500/15 border border-emerald-300 dark:border-emerald-800/80 backdrop-blur-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Possible Match Found!
                  <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    AI Match
                  </span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  {matchedItemsNotice.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  const match = campusItems.find((i) => i.id === matchedItemsNotice.matchedItemId);
                  if (match) setSelectedItem(match);
                }}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
              >
                View Match
              </button>
              <button
                onClick={clearMatchedNotice}
                className="text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        {/* Search and primary toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="lostfound-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, item name, or brand..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Toggle: All | Lost Items | Found Items */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition ${
                filterType === 'lost'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              🔴 Lost ({campusItems.filter((i) => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition ${
                filterType === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              🟢 Found ({campusItems.filter((i) => i.type === 'found').length})
            </button>
          </div>
        </div>

        {/* Secondary dropdown filters: Location & Category */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Student ID Card">Student ID Card</option>
            <option value="Phone">Phone</option>
            <option value="Laptop">Laptop</option>
            <option value="Keys">Keys</option>
            <option value="Backpack">Backpack</option>
            <option value="ATM Card">ATM Card</option>
            <option value="Earbuds">Earbuds</option>
            <option value="Notebook">Notebook</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Campus Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedLocation !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLocation('all');
                setSearchQuery('');
              }}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No matching items found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or report a new lost or found item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/40 transition flex flex-col"
            >
              {/* Card Photo & Badges */}
              <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {item.type === 'lost' ? '🔎' : '📦'}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {item.status === 'lost' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                      🔴 Lost
                    </span>
                  )}
                  {item.status === 'found' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      🟢 Found
                    </span>
                  )}
                  {item.status === 'verifying' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                      🟡 Verifying
                    </span>
                  )}
                  {item.status === 'resolved' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-white shadow-xs">
                      ⚪ Returned
                    </span>
                  )}
                </div>

                {/* Reward pill */}
                {item.reward && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 shadow-xs">
                    Reward: {formatNaira(item.reward)}
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                  <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-medium">
                    {item.category}
                  </span>
                  <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px]">
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate pr-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate text-[11px]">{item.location}</span>
                  </div>

                  {item.reportedBy.isVerified && (
                    <div
                      title="Verified Student"
                      className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      <ReportItemModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        initialType={reportModalType}
      />

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenChat={handleOpenChatWithUser}
      />

      {/* Private Chat Modal */}
      <ChatModal chatSession={currentChatSession} onClose={closeChat} />
    </div>
  );
};
