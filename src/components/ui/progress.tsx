/**
 * @file Shadcn Progress component
 * @module components/ui/progress
 * @description Wraps @radix-ui/react-progress to render a progress bar
 *   with animated fill indicator.
 */

// React core
import * as React from 'react';

// Radix UI progress primitive
import * as ProgressPrimitive from '@radix-ui/react-progress';

// Utility for conditional class names
import { cn } from '@/lib/utils';

/**
 * Progress
 * @description A progress bar with animated fill indicator based on a value (0-100).
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
