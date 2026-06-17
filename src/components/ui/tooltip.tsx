/**
 * @file Shadcn Tooltip component primitives
 * @module components/ui/tooltip
 * @description Wraps @radix-ui/react-tooltip to provide accessible
 *   tooltip components (TooltipProvider, Tooltip, TooltipTrigger, TooltipContent).
 */

// React core
import * as React from 'react';

// Radix UI tooltip primitive
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

// Utility for conditional class names
import { cn } from '@/lib/utils';

/** TooltipProvider — wraps the app to provide tooltip context */
const TooltipProvider = TooltipPrimitive.Provider;
/** Tooltip — root Radix tooltip primitive */
const Tooltip = TooltipPrimitive.Root;
/** TooltipTrigger — the element that shows the tooltip on hover */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent
 * @description The tooltip popover content shown on hover.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
