/**
 * @file OnboardingLayout (layout component)
 * @description Standalone layout for the user onboarding page (post-Google-signup).
 *   Renders the same centered card styling as AuthLayout but WITHOUT the
 *   GuestGuard wrapper — authenticated Google users who need onboarding
 *   must be able to access this page.
 * @module routes/auth/OnboardingLayout
 */

// React Router outlet for nested routes
import { Outlet } from 'react-router-dom';

// Card container for the form
import { Card } from '@/components/ui/card';

// Train icon for branding
import { Train } from 'lucide-react';

/**
 * OnboardingLayout (layout component)
 * @description Renders a centered card layout with TripTatkal branding
 *   for the onboarding page. Unlike AuthLayout, this does NOT wrap
 *   content in GuestGuard, allowing authenticated but un-onboarded
 *   Google users to complete their profile.
 */
export default function OnboardingLayout() {
  return (
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
  );
}
