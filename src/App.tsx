/**
 * @file App component
 * @description Root application component that configures React Router with lazy-loaded routes for marketing, auth, dashboard, agent, and admin sections
 * @module App
 */

// React lazy and Suspense for code-splitting
import { lazy, Suspense } from 'react';
// React Router setup
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
// Skeleton loading placeholder
import { Skeleton } from '@/components/ui/skeleton';
// Route path constants
import { ROUTES } from '@/constants/routes';

// Marketing pages (eagerly loaded)
import MarketingLayout from '@/routes/marketing/Layout';
import Landing from '@/routes/marketing/Landing';

// Auth pages (eagerly loaded)
import AuthLayout from '@/routes/auth/Layout';

// Lazy-loaded onboarding card layout (no GuestGuard — authenticated users need access)
const OnboardingLayout = lazy(() => import('@/routes/auth/OnboardingLayout'));

// Lazy-loaded auth pages
const Login = lazy(() => import('@/routes/auth/Login'));
const Signup = lazy(() => import('@/routes/auth/Signup'));
const ForgotPassword = lazy(() => import('@/routes/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/routes/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@/routes/auth/VerifyEmail'));
const Onboarding = lazy(() => import('@/routes/auth/Onboarding'));

// Lazy-loaded dashboard pages
const DashboardLayout = lazy(() => import('@/routes/dashboard/Layout'));
const Overview = lazy(() => import('@/routes/dashboard/Overview'));
const TripResults = lazy(() => import('@/routes/dashboard/TripResults'));
const TripDetail = lazy(() => import('@/routes/dashboard/TripDetail'));
const BookingsList = lazy(() => import('@/routes/dashboard/BookingsList'));
const BookingDetail = lazy(() => import('@/routes/dashboard/BookingDetail'));
const Checkout = lazy(() => import('@/routes/dashboard/Checkout'));
const Settings = lazy(() => import('@/routes/dashboard/Settings'));

// Lazy-loaded agent pages
const AgentLayout = lazy(() => import('@/routes/agent/Layout'));
const AgentOverview = lazy(() => import('@/routes/agent/Overview'));
const AgentOnboard = lazy(() => import('@/routes/agent/Onboard'));
const AgentRequests = lazy(() => import('@/routes/agent/Requests'));
const AgentBookingsList = lazy(() => import('@/routes/agent/BookingsList'));
const AgentBookingDetail = lazy(() => import('@/routes/agent/BookingDetail'));
const AgentStats = lazy(() => import('@/routes/agent/Stats'));
const AgentEarnings = lazy(() => import('@/routes/agent/Earnings'));
const AgentTeam = lazy(() => import('@/routes/agent/Team'));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import('@/routes/admin/Layout'));
const AdminOverview = lazy(() => import('@/routes/admin/AdminOverview'));
const AdminAgents = lazy(() => import('@/routes/admin/AdminAgents'));
const AdminAgentDetail = lazy(() => import('@/routes/admin/AdminAgentDetail'));
const AdminBookings = lazy(() => import('@/routes/admin/AdminBookings'));
const AdminBookingDetail = lazy(() => import('@/routes/admin/AdminBookingDetail'));
const AdminUsers = lazy(() => import('@/routes/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('@/routes/admin/AdminUserDetail'));
const AdminEmailTemplates = lazy(() => import('@/routes/admin/AdminEmailTemplates'));

// 404 not-found page
const NotFound = lazy(() => import('@/routes/NotFound'));

/** Skeleton loading state shown while lazy routes are loading */
const PageSkeleton = () => (
  <div className="flex flex-col gap-4 p-6">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);

/** Suspense wrapper for lazy-loaded route components */
const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
);

/** Browser router configuration with all application routes */
const router = createBrowserRouter([
  // Marketing (public)
  {
    element: <MarketingLayout />,
    children: [
      { path: ROUTES.home, element: <Landing /> },
    ],
  },

  // Auth
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.login, element: <S><Login /></S> },
      { path: ROUTES.signup, element: <S><Signup /></S> },
      { path: ROUTES.forgotPassword, element: <S><ForgotPassword /></S> },
      { path: ROUTES.resetPassword, element: <S><ResetPassword /></S> },
      { path: ROUTES.verifyEmail, element: <S><VerifyEmail /></S> },
    ],
  },

  // Onboarding (no GuestGuard — authenticated Google users need access)
  {
    element: <S><OnboardingLayout /></S>,
    children: [
      { path: ROUTES.onboarding, element: <S><Onboarding /></S> },
    ],
  },

  // Dashboard (customer)
  {
    element: <S><DashboardLayout /></S>,
    children: [
      { path: ROUTES.dashboard, element: <S><Overview /></S> },
      { path: ROUTES.searchTrips, element: <S><TripResults /></S> },
      { path: '/trains/:trainNumber', element: <S><TripDetail /></S> },
      { path: ROUTES.bookings, element: <S><BookingsList /></S> },
      { path: '/bookings/:id', element: <S><BookingDetail /></S> },
      { path: '/checkout/:tripId', element: <S><Checkout /></S> },
      { path: ROUTES.settings, element: <S><Settings /></S> },
    ],
  },

  // Agent
  {
    element: <S><AgentLayout /></S>,
    children: [
      { path: ROUTES.agent.root, element: <S><AgentOverview /></S> },
      { path: ROUTES.agent.onboard, element: <S><AgentOnboard /></S> },
      { path: ROUTES.agent.requests, element: <S><AgentRequests /></S> },
      { path: ROUTES.agent.bookings, element: <S><AgentBookingsList /></S> },
      { path: '/agent/bookings/:bookingId', element: <S><AgentBookingDetail /></S> },
      { path: ROUTES.agent.stats, element: <S><AgentStats /></S> },
      { path: ROUTES.agent.earnings, element: <S><AgentEarnings /></S> },
      { path: ROUTES.agent.team, element: <S><AgentTeam /></S> },
    ],
  },

  // Admin
  {
    element: <S><AdminLayout /></S>,
    children: [
      { path: ROUTES.admin.root, element: <S><AdminOverview /></S> },
      { path: ROUTES.admin.agents, element: <S><AdminAgents /></S> },
      { path: '/admin/agents/:id', element: <S><AdminAgentDetail /></S> },
      { path: ROUTES.admin.bookings, element: <S><AdminBookings /></S> },
      { path: '/admin/bookings/:id', element: <S><AdminBookingDetail /></S> },
      { path: ROUTES.admin.users, element: <S><AdminUsers /></S> },
      { path: '/admin/users/:id', element: <S><AdminUserDetail /></S> },
      { path: ROUTES.admin.emailTemplates, element: <S><AdminEmailTemplates /></S> },
    ],
  },

  // Redirect /index to home
  { path: '/index.html', element: <Navigate to={ROUTES.home} replace /> },

  // 404
  { path: '*', element: <S><NotFound /></S> },
]);

/**
 * App
 * @description Root application component. Initialises the React Router with lazy-loaded route definitions
 *   for marketing, authentication, customer dashboard, agent portal, and admin panel.
 * @returns RouterProvider rendering the configured browser router
 */
export default function App() {
  return <RouterProvider router={router} />;
}
