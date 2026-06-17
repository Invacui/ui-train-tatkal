/**
 * @file Animation Container component
 * @module components/marketing/animations/AnimationContainer
 * @description Wraps children with a Framer Motion scroll-triggered animation.
 *   Supports spring, reveal (blur + translate), and fadeInUp variants with
 *   configurable delay, reverse direction, and semantic HTML element.
 */

// Framer Motion for animations
import { motion, type Variant } from 'framer-motion';

// Shared animation variants and transitions
import { revealVariants, fadeInUpVariants, springTransition, revealTransition } from './reveal-variants';

// Utility for conditional class names
import { cn } from '@/lib/utils';

interface AnimationContainerProps {
  /** Content to animate */
  children: React.ReactNode;
  /** Animation variant (spring, reveal, fadeInUp) */
  variant?: 'spring' | 'reveal' | 'fadeInUp';
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Additional CSS class names */
  className?: string;
  /** When true, animates from the opposite direction */
  reverse?: boolean;
  /** HTML element to render (div, section, article, span) */
  as?: 'div' | 'section' | 'article' | 'span';
}

/**
 * AnimationContainer
 * @description Wraps children in a Framer Motion animated element that
 *   triggers on scroll. Supports spring, reveal, and fadeInUp variants.
 * @param props AnimationContainerProps
 * @returns An animated wrapper element
 */
export function AnimationContainer({
  children,
  variant = 'spring',
  delay = 0,
  className,
  reverse = false,
  as = 'div',
}: AnimationContainerProps) {
  const getVariants = () => {
    switch (variant) {
      case 'reveal': return revealVariants;
      case 'fadeInUp': return fadeInUpVariants;
      default: return {
        hidden: { opacity: 0, y: reverse ? -20 : 20 },
        visible: { opacity: 1, y: 0 },
      };
    }
  };

  const getTransition = () => {
    switch (variant) {
      case 'reveal': return { ...revealTransition, delay };
      default: return { ...springTransition, delay };
    }
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: variant === 'reveal' ? '-48px' : '-32px' }}
      variants={getVariants()}
      transition={getTransition()}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  );
}
