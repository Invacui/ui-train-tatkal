/**
 * @file Scroll Mouse Indicator component
 * @module components/marketing/animations/ScrollMouseIndicator
 * @description An animated mouse scroll indicator fixed at the bottom center
 *   of the viewport. Bounces vertically and scrolls to the next section
 *   on click.
 */

// Framer Motion for animations
import { motion } from 'framer-motion';

/**
 * ScrollMouseIndicator
 * @description A fixed-position animated mouse scroll indicator. Bounces
 *   vertically to indicate scrollability. Clicking scrolls down by one
 *   viewport height.
 * @returns A mouse icon with bounce animation
 */
export function ScrollMouseIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2"
    >
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/40 pt-2"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div className="h-1.5 w-1 rounded-full bg-foreground/60" />
      </motion.button>
    </motion.div>
  );
}
