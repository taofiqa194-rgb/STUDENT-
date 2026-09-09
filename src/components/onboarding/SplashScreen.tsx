import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { setSplashDone } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, [setSplashDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      id="splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 text-white p-6 select-none"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-black/30 p-2 flex items-center justify-center ring-4 ring-white/20">
            <img
              src="/icon.svg"
              alt="StudentMate"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -inset-2 rounded-3xl bg-emerald-400 blur-md -z-10"
          />
        </div>

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-1 font-display"
        >
          StudentMate
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-emerald-100 text-sm mt-2 font-medium tracking-wide"
        >
          Making student life easier.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-[11px] text-emerald-200/80 uppercase tracking-widest font-semibold">
          Nigerian Campus Companion
        </span>
      </motion.div>
    </motion.div>
  );
};
