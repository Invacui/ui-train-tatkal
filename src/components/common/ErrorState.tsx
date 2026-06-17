/**
 * @file Error State component
 * @module components/common/ErrorState
 * @description Displays a centered error state with an alert icon,
 *   error message, and optional retry button.
 */

// Alert circle icon for error visual
import { AlertCircle } from 'lucide-react';

// Shadcn button for the retry action
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  /** Custom error message (default: "Something went wrong.") */
  message?: string;
  /** Optional callback to retry the failed action */
  onRetry?: () => void;
}

/**
 * ErrorState
 * @description Renders a centered error state with a destructive alert icon,
 *   error message text, and an optional "Try again" button.
 * @param props ErrorStateProps
 * @returns A centered error state section
 */
export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
