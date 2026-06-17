/**
 * @file Shadcn Label component
 * @module components/ui/label
 * @description Wraps @radix-ui/react-label to render a styled form label
 *   with peer-disabled state support.
 */

// React core
import * as React from 'react';

// Radix UI label primitive
import * as LabelPrimitive from '@radix-ui/react-label';

// Utility for conditional class names
import { cn } from '@/lib/utils';

/**
 * Label
 * @description Styled form label with peer-disabled support via Radix.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
