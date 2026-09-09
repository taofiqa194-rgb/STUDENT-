import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  Tag,
  SlidersHorizontal,
  School,
  FileText,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusItem, ItemCategory } from '../../types';
import { ReportItemModal } from './ReportItemModal';
import { ItemDetailsModal } from './ItemDetailsModal';
import { ChatModal } from './ChatModal';
import { MyReportsView } from './MyReportsView';

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

export const LostAndFoundView: React.FC = () => {
  const {
    campusItems,
    currentUser,
    matchedItemsNotice,
    clearMatchedNotice,
    startOrOpenChat,
    currentChatSession,
    closeChat,
  } = useApp();

  // Primary top tab: 'feed' or 'my-reports'
  const [activeMainTab, setActiveMainTab] = useState<'feed' | 'my-reports'>('feed');

  // Feed filters
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Modals state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalType, setReportModalType] = useState<'lost' | 'found'>('lost');
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);

  // Extract distinct institutions present in items
  const institutionsInItems = useMemo(() => {
    const set = new Set<string>();
    campusItems.forEach((i) => {
      const inst = i.institution || i.university;
      if (inst) set.add(inst);
    });
    return Array.from(set);
  }, [campusItems]);

  // Filter items for feed
  const filteredItems = useMemo(() => {
    return campusItems.filter((item) => {
      // Exclude recovered/closed items from default active feed unless explicitly searching or resolved
      if (item.status === 'recovered' || item.status === 'closed') {
        return false;
      }

      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Institution filter
      if (selectedInstitution !== 'all') {
        const itemInst = item.institution || item.university;
        if (itemInst !== selectedInstitution) return false;
      }

      // Date filter
      if (selectedDate) {
        const itemDate = item.dateLost || item.dateFound || item.date;
        if (itemDate && !itemDate.startsWith(selectedDate)) return false;
      }

      // Search query filter (matches item name, description, location, category, institution)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (item.itemName || item.title || '').toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchLoc = (item.location || '').toLowerCase().includes(q);
        const matchCat = (item.category || '').toLowerCase().includes(q);
        const matchInst = (item.institution || item.university || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCat && !matchInst) return false;
      }

      return true;
    });
  }, [
    campusItems,
    filterType,
    selectedCategory,
    selectedInstitution,
    selectedDate,
    searchQuery,
  ]);

  const handleOpenReport = (type: 'lost' | 'found') => {
    setReportModalType(type);
    setShowReportModal(true);
  };

  const handleOpenChatWithUser = (userId: string, itemId?: string) => {
    startOrOpenChat(userId, itemId);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Campus Lost &amp; Found
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              Live Network
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-institution portal for reporting and recovering lost items
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="report-lost-btn"
            onClick={() => handleOpenReport('lost')}
            className="flex-1 sm:flex-none py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-rose-900/15 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Lost Item</span>
          </button>
          <button
            type="button"
            id="report-found-btn"
            onClick={() => handleOpenReport('found')}
            className="flex-1 sm:flex-none py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-emerald-900/15 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Found Item</span>
          </button>
        </div>
      </div>

      {/* Main View Switcher: Public Feed vs My Reports */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          id="lostfound-feed-tab"
          onClick={() => setActiveMainTab('feed')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeMainTab === 'feed'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Campus Feed</span>
        </button>

        <button
          type="button"
          id="lostfound-my-reports-tab"
          onClick={() => setActiveMainTab('my-reports')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeMainTab === 'my-reports'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Reports</span>
        </button>
      </div>

      {/* Automated AI Match Detection Banner if available */}
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
                  Possible Match Detected!
                  <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Smart Match
                  </span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  {matchedItemsNotice.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const match = campusItems.find((i) => i.id === matchedItemsNotice.matchedItemId);
                  if (match) setSelectedItem(match);
                }}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition"
              >
                View Match
              </button>
              <button
                type="button"
                onClick={clearMatchedNotice}
                className="text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tab Content */}
      {activeMainTab === 'my-reports' ? (
        <MyReportsView
          onOpenReportModal={handleOpenReport}
          onOpenChat={handleOpenChatWithUser}
        />
      ) : (
        <>
          {/* Feed Filter Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            {/* Search Bar & Type Tabs */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="lostfound-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item name, phone, keys, laptop, ID card, bag, location..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Status/Type Selector: All, Lost, Found */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                <button
                  type="button"
                  id="filter-all-btn"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterType === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  All ({campusItems.filter((i) => i.status !== 'recovered' && i.status !== 'closed').length})
                </button>
                <button
                  type="button"
                  id="filter-lost-btn"
                  onClick={() => setFilterType('lost')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterType === 'lost'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  🔴 Lost ({campusItems.filter((i) => i.type === 'lost' && i.status !== 'recovered').length})
                </button>
                <button
                  type="button"
                  id="filter-found-btn"
                  onClick={() => setFilterType('found')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterType === 'found'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  🟢 Found ({campusItems.filter((i) => i.type === 'found' && i.status !== 'recovered').length})
                </button>
              </div>
            </div>

            {/* Sub filters: Category, Institution, Date */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px]">Filters:</span>
              </div>

              {/* Category */}
              <select
                id="filter-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Institution */}
              {institutionsInItems.length > 0 && (
                <select
                  id="filter-institution-select"
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none max-w-[180px] truncate"
                >
                  <option value="all">All Institutions</option>
                  {institutionsInItems.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              )}

              {/* Date */}
              <input
                type="date"
                id="filter-date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
              />

              {/* Reset button */}
              {(selectedCategory !== 'all' ||
                selectedInstitution !== 'all' ||
                selectedDate ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedInstitution('all');
                    setSelectedDate('');
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-auto"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Items Feed Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {filterType === 'lost'
                    ? 'Nothing has been reported as lost yet.'
                    : filterType === 'found'
                    ? 'No found items have been reported yet.'
                    : 'No lost or found items yet.'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? `No items match your search for "${searchQuery}". Try different keywords.`
                    : 'Be the first to report an item and help someone in your campus community.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenReport('lost')}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Report Lost Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenReport('found')}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Report Found Item</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const displayTitle = item.itemName || item.title || 'Item';
                const displayImg =
                  (item.imageUrls && item.imageUrls[0]) || item.imageUrl;
                const displayDate =
                  item.dateLost || item.dateFound || item.date || 'Recent';
                const displayInst = item.institution || item.university;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/40 transition flex flex-col justify-between"
                  >
                    {/* Card Photo & Badges */}
                    <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/60">
                          <span className="text-3xl mb-1">
                            {item.type === 'lost' ? '🔴' : '🟢'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            No photo attached
                          </span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
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

                      {/* Category tag */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                        <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-semibold text-[10px]">
                          {item.category}
                        </span>
                        <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px]">
                          {displayDate}
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {displayTitle}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 truncate pr-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate text-[11px]">{item.location}</span>
                        </div>

                        {displayInst && (
                          <div
                            title={displayInst}
                            className="flex items-center gap-1 text-[10px] font-medium text-slate-400 shrink-0 max-w-[110px] truncate"
                          >
                            <School className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{displayInst}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
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
