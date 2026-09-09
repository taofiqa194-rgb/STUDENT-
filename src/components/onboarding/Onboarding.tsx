import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Search, GraduationCap, ChevronRight, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ONBOARDING_PAGES = [
  {
    icon: Wallet,
    color: 'from-emerald-500 to-teal-600',
    badge: '💰 Money Manager',
    title: 'Manage Your Money',
    description: 'Track your spending and understand where your money goes with Nigerian student-tailored budgets and recommendations.',
    highlights: ['₦ Daily budget guidance', 'Instant expense tracking', 'Smart "Can I afford this?" tool'],
  },
  {
    icon: Search,
    color: 'from-blue-500 to-indigo-600',
    badge: '🔎 Campus Lost & Found',
    title: 'Find Lost Items',
    description: 'Report lost items and discover items found around your campus with automated match detection and safe private chats.',
    highlights: ['AI similarity matching', 'Private student messaging', 'Never reveals phone or email'],
  },
  {
    icon: GraduationCap,
    color: 'from-purple-500 to-emerald-600',
    badge: '🎓 Built for Students',
    title: 'Built for Students',
    description: 'Everything you need to make campus life easier. Verified accounts, offline PWA access, and future study modules.',
    highlights: ['Works offline anywhere', 'Official student verification', 'Admin safety moderations'],
  },
];

export const Onboarding: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { finishOnboarding } = useApp();

  const handleNext = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const current = ONBOARDING_PAGES[currentPage];
  const IconComponent = current.icon;

  return (
    <div
      id="onboarding-container"
      className="fixed inset-0 z-40 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 p-6 md:p-10 select-none overflow-hidden"
    >
      {/* Top bar with Skip */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full pt-2">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="StudentMate" className="w-8 h-8 rounded-xl shadow-sm" />
          <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight font-display">
            StudentMate
          </span>
        </div>

        {currentPage < ONBOARDING_PAGES.length - 1 ? (
          <button
            id="onboarding-skip-btn"
            onClick={finishOnboarding}
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 py-1.5 px-3 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            Skip
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Main card content with swipe animations */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Visual Icon Illustration */}
            <div className="relative mb-8">
              <div
                className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr ${current.color} shadow-xl shadow-emerald-500/20 flex items-center justify-center text-white ring-8 ring-emerald-500/10 dark:ring-emerald-400/10`}
              >
                <IconComponent className="w-14 h-14 md:w-16 md:h-16 stroke-[1.75]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
            </div>

            {/* Badge */}
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mb-3">
              {current.badge}
            </span>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 font-display">
              {current.title}
            </h2>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-sm mb-6">
              &ldquo;{current.description}&rdquo;
            </p>

            {/* Feature Bullets */}
            <div className="w-full space-y-2 max-w-xs text-left">
              {current.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="max-w-md mx-auto w-full pb-4 space-y-5">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {ONBOARDING_PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === i
                  ? 'w-8 bg-emerald-600 dark:bg-emerald-400'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {currentPage > 0 ? (
            <button
              id="onboarding-back-btn"
              onClick={handlePrev}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : null}

          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            {currentPage === ONBOARDING_PAGES.length - 1 ? (
              <>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
