/**
 * @file Loading Curtain component
 * @module components/marketing/LoadingCurtain
 * @description A full-screen loading overlay shown on initial app load.
 *   Displays the brand logo, a progress bar, and slides up (exits)
 *   once the page is ready. Configurable minimum load time.
 */

// React hooks for timing and visibility state
import { useEffect, useState } from 'react';

// Framer Motion for animations
import { motion, AnimatePresence } from 'framer-motion';

// Train icon for the brand logo
import { Train } from 'lucide-react';

interface LoadingCurtainProps {
  /** Minimum time (ms) to show the curtain before allowing exit (default: 4000) */
  minimumLoadTime?: number;
  /** Optional callback invoked when the curtain finishes its exit animation */
  onLoaded?: () => void;
}

/**
 * LoadingCurtain
 * @description A full-screen loading overlay with brand logo, animated
 *   progress bar, and a slide-up exit animation. Waits for both the
 *   minimum load time and the document ready state before exiting.
 * @param props LoadingCurtainProps
 * @returns A full-screen loading overlay
 */
export function LoadingCurtain({ minimumLoadTime = 4000, onLoaded }: LoadingCurtainProps) {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / minimumLoadTime) * 100, 100);
      setProgress(pct);
    }, 100);

    const checkReady = setInterval(() => {
      if (document.readyState === 'complete') {
        setIsReady(true);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(checkReady);
    };
  }, [minimumLoadTime]);

  useEffect(() => {
    if (!isReady) return;
    const elapsed = Date.now() - Date.now();
    const remaining = Math.max(0, minimumLoadTime - elapsed);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoaded?.();
    }, remaining);
    return () => clearTimeout(timer);
  }, [isReady, minimumLoadTime, onLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <Train className="h-16 w-16 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">TripTatkal</h1>
            <p className="text-sm text-muted-foreground">Book train tickets, anytime.</p>
          </motion.div>

          <div className="mt-12 h-1 w-64 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            Loading your journey...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
