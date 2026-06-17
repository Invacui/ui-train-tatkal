/**
 * @file Auth layout wrapper
 * @module routes/auth/Layout
 * @description Provides the auth section shell with a centered card layout
 *   wrapped in a GuestGuard to redirect authenticated users away.
 */

// React Router outlet for nested auth routes
import { Outlet } from 'react-router-dom';

// Redirects authenticated users away from auth pages
import { GuestGuard } from '@/guards/GuestGuard';

// Card container for auth forms
import { Card } from '@/components/ui/card';

// Train icon used in the header branding
import { Train } from 'lucide-react';

/**
 * AuthLayout (layout component)
 * @description Renders the authentication pages shell with a centered card
 *   layout wrapped in GuestGuard. Displays branding header and an Outlet
 *   for nested auth routes (login, signup, etc.).
 */
export default function AuthLayout() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Train className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">TripTatkal</h1>
            </div>
          </div>
          <Card className="p-6">
            <Outlet />
          </Card>
        </div>
      </div>
    </GuestGuard>
  );
}
