/**
 * @file Reveal animation variants
 * @module components/marketing/animations/reveal-variants
 * @description Shared Framer Motion animation variants and transitions
 *   used across marketing page components: reveal, spring, fadeInUp,
 *   fadeIn, slideInLeft, slideInRight, staggerContainer, and scaleIn.
 */

// Framer Motion types
import { motion, type Variants, type Transition } from 'framer-motion';

export const revealTransition: Transition = {
  duration: 1,
  ease: [0.25, 0.1, 0.25, 1],
};

export const springTransition: Transition = {
  duration: 0.35,
  type: 'spring',
  stiffness: 260,
  damping: 26,
};

export const revealVariants: Variants = {
  hidden: { filter: 'blur(10px)', transform: 'translateY(20%)', opacity: 0 },
  visible: { filter: 'blur(0px)', transform: 'translateY(0)', opacity: 1 },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};
