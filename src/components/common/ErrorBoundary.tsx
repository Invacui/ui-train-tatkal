/**
 * @file Error Boundary component
 * @description Outer catch-all class-based React Error Boundary.
 *   Wraps the entire app in main.tsx to catch errors that fall outside
 *   React Router's errorElement (e.g. errors in Providers, Redux, React Query).
 *
 *   Route-level rendering errors are caught by the root route's errorElement
 *   which renders the full ErrorPage with "Report Error" functionality.
 *
 *   This boundary only shows a minimal recovery UI since it sits above
 *   the Provider tree (Redux, React Query may be unavailable).
 *
 *   Pattern matches worko-ui-react's error-boundary approach.
 */

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 * @description A React class component that catches JavaScript errors anywhere in its
 *   child component tree. This is the outermost safety net — errors caught here
 *   indicate a catastrophic failure (Redux, React Query, or React Router itself crashed).
 *   Renders a minimal reload page since providers may be unavailable.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Unhandled error:', error);
  }

  handleReload = (): void => {
    window.location.href = '/';
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Minimal fallback — providers may be down, so keep it simple
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              A critical error occurred. Please reload the page and try again.
            </p>
            <p className="text-xs text-muted-foreground">
              {this.state.error?.message && (
                <span className="font-mono">{this.state.error.message}</span>
              )}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
