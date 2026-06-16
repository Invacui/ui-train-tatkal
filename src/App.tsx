import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';

// Marketing (eager — small, public)
import MarketingLayout from '@/routes/marketing/Layout';
import Landing from '@/routes/marketing/Landing';
import Pricing from '@/routes/marketing/Pricing';
import About from '@/routes/marketing/About';

// Auth layout (eager)
import AuthLayout from '@/routes/auth/Layout';

// Lazy route components
const Login = lazy(() => import('@/routes/auth/Login'));
const Signup = lazy(() => import('@/routes/auth/Signup'));
const ForgotPassword = lazy(() => import('@/routes/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/routes/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@/routes/auth/VerifyEmail'));
const VerifyEmailOtp = lazy(() => import('@/routes/auth/VerifyEmailOtp'));
const SelectPlan = lazy(() => import('@/routes/auth/SelectPlan'));

const DashboardLayout = lazy(() => import('@/routes/dashboard/Layout'));
const Overview = lazy(() => import('@/routes/dashboard/Overview'));
const LeadsList = lazy(() => import('@/routes/dashboard/leads/LeadsList'));
const LeadUpload = lazy(() => import('@/routes/dashboard/leads/LeadUpload'));
const LeadDetail = lazy(() => import('@/routes/dashboard/leads/LeadDetail'));
const TemplatesList = lazy(() => import('@/routes/dashboard/templates/TemplatesList'));
const TemplateNew = lazy(() => import('@/routes/dashboard/templates/TemplateNew'));
const TemplateDetail = lazy(() => import('@/routes/dashboard/templates/TemplateDetail'));
const CampaignsList = lazy(() => import('@/routes/dashboard/campaigns/CampaignsList'));
const CampaignDetail = lazy(() => import('@/routes/dashboard/campaigns/CampaignDetail'));
const ConversationsList = lazy(() => import('@/routes/dashboard/conversations/ConversationsList'));
const ConversationDetail = lazy(() => import('@/routes/dashboard/conversations/ConversationDetail'));
const Settings = lazy(() => import('@/routes/dashboard/Settings'));

const AdminLayout = lazy(() => import('@/routes/admin/Layout'));
const AdminOverview = lazy(() => import('@/routes/admin/AdminOverview'));
const AdminUsers = lazy(() => import('@/routes/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('@/routes/admin/AdminUserDetail'));
const AdminLeadRequests = lazy(() => import('@/routes/admin/AdminLeadRequests'));
const AdminCampaigns = lazy(() => import('@/routes/admin/AdminCampaigns'));

const NotFound = lazy(() => import('@/routes/NotFound'));

const PageSkeleton = () => (
  <div className="flex flex-col gap-4 p-6">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
);

const router = createBrowserRouter([
  // Marketing
  {
    element: <MarketingLayout />,
    children: [
      { path: ROUTES.home, element: <Landing /> },
      { path: ROUTES.pricing, element: <Pricing /> },
      { path: ROUTES.about, element: <About /> },
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
      { path: ROUTES.verifyEmailOtp, element: <S><VerifyEmailOtp /></S> },
      { path: ROUTES.selectPlan, element: <S><SelectPlan /></S> },
    ],
  },

  // Dashboard
  {
    element: <S><DashboardLayout /></S>,
    children: [
      { path: ROUTES.dashboard, element: <S><Overview /></S> },
      { path: ROUTES.leads, element: <S><LeadsList /></S> },
      { path: ROUTES.leadUpload, element: <S><LeadUpload /></S> },
      { path: '/leads/:id', element: <S><LeadDetail /></S> },
      { path: ROUTES.templates, element: <S><TemplatesList /></S> },
      { path: ROUTES.templateNew, element: <S><TemplateNew /></S> },
      { path: '/templates/:id', element: <S><TemplateDetail /></S> },
      { path: ROUTES.campaigns, element: <S><CampaignsList /></S> },
      { path: '/campaigns/:id', element: <S><CampaignDetail /></S> },
      { path: ROUTES.conversations, element: <S><ConversationsList /></S> },
      { path: '/conversations/:id', element: <S><ConversationDetail /></S> },
      { path: ROUTES.settings, element: <S><Settings /></S> },
    ],
  },

  // Admin
  {
    element: <S><AdminLayout /></S>,
    children: [
      { path: ROUTES.admin.root, element: <S><AdminOverview /></S> },
      { path: ROUTES.admin.users, element: <S><AdminUsers /></S> },
      { path: '/admin/users/:id', element: <S><AdminUserDetail /></S> },
      { path: ROUTES.admin.leadRequests, element: <S><AdminLeadRequests /></S> },
      { path: ROUTES.admin.campaigns, element: <S><AdminCampaigns /></S> },
    ],
  },

  // Redirect /index to home
  { path: '/index.html', element: <Navigate to={ROUTES.home} replace /> },

  // 404
  { path: '*', element: <S><NotFound /></S> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
