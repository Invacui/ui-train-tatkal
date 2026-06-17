/**
 * @file Empty State component
 * @module components/common/EmptyState
 * @description Displays a centered empty-state placeholder with an inbox icon,
 *   title, description, and optional action children.
 */

// Inbox icon for the empty state visual
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  /** Primary title text */
  title: string;
  /** Optional descriptive text */
  description?: string;
  /** Optional action buttons or links rendered below the description */
  children?: React.ReactNode;
}

/**
 * EmptyState
 * @description Renders a centered empty-state placeholder with an inbox icon,
 *   title, description text, and optional child actions (e.g. a "Create" button).
 * @param props EmptyStateProps
 * @returns A centered empty state section
 */
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <InboxIcon className="h-12 w-12 text-muted-foreground" />
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
