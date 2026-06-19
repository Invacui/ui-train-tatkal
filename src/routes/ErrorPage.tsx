/**
 * @file ErrorPage
 * @description Error fallback UI used as React Router's errorElement at the root route level.
 *   Catches rendering errors from any route component. Provides a friendly message,
 *   technical details toggle, Try Again button, and a Report Error button.
 *
 * Note: This component renders inside the RouterProvider (as an errorElement), so it
 *   can use React Router hooks (useRouteError, useLocation).
 */

// React Router hooks for accessing the thrown error
import { useRouteError } from 'react-router-dom';

// Redux hooks for user state
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';

// Error report mutation hook
import { useErrorReport } from '@/hooks/errors/useErrorReport';

// UI components
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw, Bug } from 'lucide-react';

// React hooks
import { useState } from 'react';

/**
 * ErrorPage (route errorElement fallback)
 * @description Renders a full-page error state when a route component throws during rendering.
 *   Uses useRouteError() from react-router-dom to retrieve the thrown error.
 *   Provides "Try Again" (hard-nav to /) and "Report Error" (POST to backend).
 */
export default function ErrorPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [reported, setReported] = useState(false);
  const user = useAppSelector(selectUser);
  const { mutateAsync: reportError, isPending: isReporting } = useErrorReport();

  // Retrieve the error thrown by the route component
  const routeError = useRouteError();
  const error = routeError instanceof Error ? routeError : new Error(String(routeError));

  /** Navigate home — hard redirect since the app state may be corrupted */
  const handleTryAgain = () => {
    window.location.href = '/';
  };

  /** Report the error to the backend */
  const handleReport = async () => {
    try {
      await reportError({
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack ?? '',
        route: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        priority: 'high',
        ...(user?.id && { userId: user.id }),
        ...(user?.name && { userName: user.name }),
        ...(user?.email && { userEmail: user.email }),
        ...(user?.role && { userRole: user.role }),
      });
      setReported(true);
    } catch {
      // Error reporting failure is handled by the hook's onError toast
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        {/* Error icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {user ? (
              <>Hi {user.name}, we encountered an unexpected error on this page.</>
            ) : (
              <>We encountered an unexpected error on this page.</>
            )}
            {' '}Please try again in a few minutes.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleTryAgain} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={handleReport}
            disabled={isReporting || reported}
            className="gap-2"
          >
            <Bug className="h-4 w-4" />
            {isReporting ? 'Reporting…' : reported ? 'Reported ✓' : 'Report error'}
          </Button>
        </div>

        {/* Technical details toggle */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {showDetails ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          Technical details
        </button>

        {showDetails && (
          <div className="w-full rounded-lg border bg-muted/30 p-4 text-left font-mono text-xs leading-relaxed">
            <p className="font-semibold text-foreground">
              {error?.name || 'Error'}
            </p>
            <p className="mt-1 text-muted-foreground">
              {error?.message || 'No error message available.'}
            </p>
            {error?.stack && (
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-muted-foreground">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
