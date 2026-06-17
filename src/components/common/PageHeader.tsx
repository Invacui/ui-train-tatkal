/**
 * @file Page Header component
 * @module components/common/PageHeader
 * @description Renders a page title with optional description and action
 *   elements in a horizontal layout.
 */

// Utility for conditional class names
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Page title text */
  title: string;
  /** Optional description/subtitle text */
  description?: string;
  /** Optional action elements (buttons, links) rendered on the right */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/**
 * PageHeader
 * @description Renders a page header with the title on the left and optional
 *   action buttons on the right.
 * @param props PageHeaderProps
 * @returns A page header section
 */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
