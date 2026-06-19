/**
 * @file Routes configuration
 * @description Centralised route definitions with lazy loading.
 *   Uses React Router's createBrowserRouter with errorElement on the root
 *   route to catch all route-level rendering errors.
 *   Matches the clean pattern from worko-ui-react.
 */

// React lazy and Suspense for code-splitting
import { lazy, Suspense } from 'react';
// React Router setup
import { createBrowserRouter, Navigate } from 'react-router-dom';
// Skeleton loading placeholder
import { Skeleton } from '@/components/ui/skeleton';
// Route path constants
import { ROUTES } from '@/constants/routes';

// Eagerly loaded layouts
import MarketingLayout from '@/routes/marketing/Layout';
import AuthLayout from '@/routes/auth/Layout';

// Eagerly loaded pages
import Landing from '@/routes/marketing/Landing';

// Eagerly loaded error fallback (used in errorElement)
import ErrorPage from '@/routes/ErrorPage';

// ---- Lazy loaded layouts ----
const OnboardingLayout = lazy(() => import('@/routes/auth/OnboardingLayout'));
const DashboardLayout = lazy(() => import('@/routes/dashboard/Layout'));
const AgentLayout = lazy(() => import('@/routes/agent/Layout'));
const AdminLayout = lazy(() => import('@/routes/admin/Layout'));

// ---- Lazy loaded auth pages ----
const Login = lazy(() => import('@/routes/auth/Login'));
const Signup = lazy(() => import('@/routes/auth/Signup'));
const ForgotPassword = lazy(() => import('@/routes/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/routes/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@/routes/auth/VerifyEmail'));
const Onboarding = lazy(() => import('@/routes/auth/Onboarding'));
const AgentLogin = lazy(() => import('@/routes/auth/AgentLogin'));
const AgentSignup = lazy(() => import('@/routes/auth/AgentSignup'));
const AdminLoginLazy = lazy(() => import('@/routes/auth/AdminLogin'));

// ---- Lazy loaded dashboard pages ----
const Overview = lazy(() => import('@/routes/dashboard/Overview'));
const TripResults = lazy(() => import('@/routes/dashboard/TripResults'));
const TripDetail = lazy(() => import('@/routes/dashboard/TripDetail'));
const BookingsList = lazy(() => import('@/routes/dashboard/BookingsList'));
const BookingDetail = lazy(() => import('@/routes/dashboard/BookingDetail'));
const Checkout = lazy(() => import('@/routes/dashboard/Checkout'));
const Settings = lazy(() => import('@/routes/dashboard/Settings'));

// ---- Lazy loaded agent pages ----
const AgentOverview = lazy(() => import('@/routes/agent/Overview'));
const AgentOnboard = lazy(() => import('@/routes/agent/Onboard'));
const AgentRequests = lazy(() => import('@/routes/agent/Requests'));
const AgentBookingsList = lazy(() => import('@/routes/agent/BookingsList'));
const AgentBookingDetail = lazy(() => import('@/routes/agent/BookingDetail'));
const AgentStats = lazy(() => import('@/routes/agent/Stats'));
const AgentEarnings = lazy(() => import('@/routes/agent/Earnings'));
const AgentTeam = lazy(() => import('@/routes/agent/Team'));

// ---- Lazy loaded admin pages ----
const AdminOverview = lazy(() => import('@/routes/admin/AdminOverview'));
const AdminAgents = lazy(() => import('@/routes/admin/AdminAgents'));
const AdminAgentDetail = lazy(() => import('@/routes/admin/AdminAgentDetail'));
const AdminBookings = lazy(() => import('@/routes/admin/AdminBookings'));
const AdminBookingDetail = lazy(() => import('@/routes/admin/AdminBookingDetail'));
const AdminUsers = lazy(() => import('@/routes/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('@/routes/admin/AdminUserDetail'));
const AdminEmailTemplates = lazy(() => import('@/routes/admin/AdminEmailTemplates'));

// ---- Lazy loaded utility pages ----
const NotFound = lazy(() => import('@/routes/NotFound'));

// ---- Lazy loaded marketing pages ----
const PnrCheck = lazy(() => import('@/routes/marketing/PnrCheck'));

// ---- Helpers ----

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

// ---- Route Configuration ----

const router = createBrowserRouter([
  {
    // Root layout with errorElement — catches rendering errors from ALL child routes
    errorElement: <ErrorPage />,
    children: [
      // --- Marketing (public) ---
      {
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Landing /> },
          { path: ROUTES.pnrCheck, element: <S><PnrCheck /></S> },
        ],
      },

      // --- Auth (guest only) ---
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <S><Login /></S> },
          { path: ROUTES.signup, element: <S><Signup /></S> },
          { path: ROUTES.forgotPassword, element: <S><ForgotPassword /></S> },
          { path: ROUTES.resetPassword, element: <S><ResetPassword /></S> },
          { path: ROUTES.verifyEmail, element: <S><VerifyEmail /></S> },
          { path: ROUTES.agentLogin, element: <S><AgentLogin /></S> },
          { path: ROUTES.agentSignup, element: <S><AgentSignup /></S> },
          { path: ROUTES.adminLogin, element: <S><AdminLoginLazy /></S> },
        ],
      },

      // --- Onboarding (authenticated Google users) ---
      {
        element: <S><OnboardingLayout /></S>,
        children: [
          { path: ROUTES.onboarding, element: <S><Onboarding /></S> },
        ],
      },

      // --- Customer Dashboard ---
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

      // --- Agent Portal ---
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

      // --- Admin Panel ---
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

      // --- Redirects & 404 ---
      { path: '/index.html', element: <Navigate to={ROUTES.home} replace /> },
      { path: '*', element: <S><NotFound /></S> },
    ],
  },
]);

export default router;
