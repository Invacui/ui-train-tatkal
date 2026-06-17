/**
 * @file Shadcn Skeleton component
 * @module components/ui/skeleton
 * @description Renders a pulsing placeholder element for loading states.
 */

// React core
import * as React from 'react';

// Utility for conditional class names
import { cn } from '@/lib/utils';

/**
 * Skeleton
 * @description Pulsing placeholder element for loading states.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

export { Skeleton };
