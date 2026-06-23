/**
 * @file Route constants
 * @description Application route path definitions, organised by feature area (auth, agent, admin)
 * @module constants
 */

/**
 * ROUTES
 * @description Centralised route path definitions. Dynamic segments are expressed as factory functions (e.g. ROUTES.trainDetail('12345')).
 */
export const ROUTES = {
  /** Landing page */
  home: '/',
  /** Login page */
  login: '/login',
  /** Registration page */
  signup: '/signup',
  /** Forgot password page */
  forgotPassword: '/forgot-password',
  /** Reset password page */
  resetPassword: '/reset-password',
  /** Email verification page */
  verifyEmail: '/verify-email',
  /** User onboarding page */
  onboarding: '/onboarding',
  /** Signup email verification page */
  signupVerify: '/signup/verify',
  /** Onboarding address collection page */
  onboardingAddress: '/onboarding/address',
  /** Customer dashboard */
  dashboard: '/dashboard',
  /** Trip search/results page */
  searchTrips: '/search',
  /** Trip results for a specific search */
  tripResults: (searchId: string) => `/trips/results/${searchId}` as const,
  /** Train detail page */
  trainDetail: (num: string) => `/trains/${num}` as const,
  /** Bookings list page */
  bookings: '/bookings',
  /** Single booking detail */
  bookingDetail: (id: string) => `/bookings/${id}` as const,
  /** Checkout / booking page for a train */
  booking: (trainNumber: string) => `/booking/${trainNumber}` as const,
  /** User settings page */
  settings: '/settings',
  /** Agent login page */
  agentLogin: '/agent/login',
  /** Agent signup page */
  agentSignup: '/agent/signup',
  /** Admin login page */
  adminLogin: '/admin/login',
  /** PNR status check page */
  pnrCheck: '/pnr-status',
  agent: {
    /** Agent dashboard root */
    root: '/agent',
    /** Agent onboarding page */
    onboard: '/agent/onboard',
    /** Booking requests for agents */
    requests: '/agent/requests',
    /** Single request detail (agent view) */
    requestDetail: (id: string) => `/agent/requests/${id}` as const,
    /** Agent's bookings list */
    bookings: '/agent/bookings',
    /** Single booking detail (agent view) */
    bookingDetail: (id: string) => `/agent/bookings/${id}` as const,
    /** Agent stats page */
    stats: '/agent/stats',
    /** Agent earnings page */
    earnings: '/agent/earnings',
    /** Agent team management */
    team: '/agent/team',
    /** Agent profile page */
    profile: '/agent/profile',
    /** Agent onboarding carousel */
    onboarding: '/agent/onboarding',
  },
  admin: {
    /** Admin dashboard root */
    root: '/admin',
    /** Agents list */
    agents: '/admin/agents',
    /** Single agent detail */
    agentDetail: (id: string) => `/admin/agents/${id}` as const,
    /** Bookings list */
    bookings: '/admin/bookings',
    /** Single booking detail (admin view) */
    bookingDetail: (id: string) => `/admin/bookings/${id}` as const,
    /** Users list */
    users: '/admin/users',
    /** Single user detail */
    userDetail: (id: string) => `/admin/users/${id}` as const,
    /** Email template editor */
    emailTemplates: '/admin/email-templates',
    /** Pricing configuration editor */
    pricingConfig: '/admin/pricing-config',
  },
} as const;
