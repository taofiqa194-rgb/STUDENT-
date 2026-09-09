import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // If running in standalone mode, do not show
    if (isInstalled) return;

    // Check if dismissed previously
    const dismissed = localStorage.getItem('studentmate_install_prompt_dismissed');
    if (dismissed === 'true') return;

    // Delay 4 seconds or after initial user engagement
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('studentmate_install_prompt_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setIsVisible(false);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled || !isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && !showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            id="pwa-install-banner"
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-emerald-950/15"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  Install StudentMate
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    App
                  </span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Get faster access from your home screen with offline capability.
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    id="pwa-install-confirm-btn"
                    onClick={handleInstallClick}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install
                  </button>
                  <button
                    id="pwa-install-dismiss-btn"
                    onClick={handleDismiss}
                    className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
                  >
                    Not now
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                aria-label="Close install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Install Guide Modal (for iOS or non-prompting browsers) */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-base">Add to Home Screen</h3>
                </div>
                <button
                  onClick={() => {
                    setShowGuide(false);
                    handleDismiss();
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                {isIOS ? (
                  <>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      Follow these 2 easy steps on your iPhone/iPad:
                    </p>
                    <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>
                        Tap the <strong>Share</strong> icon in the bottom Safari bar.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>
                        Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      Add StudentMate directly from your browser menu:
                    </p>
                    <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>
                        Tap the <strong>three dots (⋮)</strong> menu in your browser.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>
                        Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setShowGuide(false);
                  handleDismiss();
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
