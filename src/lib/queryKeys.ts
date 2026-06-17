/**
 * @file Query key factory
 * @description Centralised factory for React Query cache keys, ensuring type-safe and consistent key structures
 * @module lib
 */

// Trip search parameter type used in query keys
import type { TripSearchParams } from '@/types/trips.types';
// Pagination parameter type used in query keys
import type { PaginationParams } from '@/types/api.types';

/**
 * queryKeys
 * @description Factory object that generates typed, consistent query keys for React Query.
 *   Each namespace (auth, trips, bookings, agents, admin, notifications) provides factory
 *   functions that produce unique keys with proper type inference.
 * @example queryKeys.trips.search({ source: 'NDLS', destination: 'BCT', date: '2025-06-01' })
 */
export const queryKeys = {
  auth: {
    /** Current user profile query key */
    me: () => ['auth', 'me'] as const,
  },
  trips: {
    /** Search results for a given trip query */
    search: (params: TripSearchParams) => ['trips', 'search', params] as const,
    /** Single train details */
    detail: (trainNumber: string) => ['trips', 'detail', trainNumber] as const,
    /** Station autocomplete/search results */
    stations: (query?: string) => ['stations', query] as const,
    /** Nearby stations */
    nearby: () => ['stations', 'nearby'] as const,
  },
  bookings: {
    /** Paginated bookings list */
    list: (params?: PaginationParams) => ['bookings', 'list', params] as const,
    /** Single booking details */
    detail: (id: string) => ['bookings', 'detail', id] as const,
    /** Ticket data for a booking */
    ticket: (id: string) => ['bookings', 'ticket', id] as const,
  },
  agents: {
    /** Agent's own profile */
    profile: () => ['agents', 'profile'] as const,
    /** Pending booking requests for the agent */
    requests: () => ['agents', 'requests'] as const,
    /** Agent's bookings list */
    bookings: (params?: PaginationParams) => ['agents', 'bookings', params] as const,
    /** Single booking detail from agent view */
    booking: (id: string) => ['agents', 'bookings', id] as const,
    /** Agent performance stats */
    stats: () => ['agents', 'stats'] as const,
    /** Agent earnings data */
    earnings: () => ['agents', 'earnings'] as const,
  },
  admin: {
    /** Admin dashboard stats */
    dashboard: () => ['admin', 'dashboard'] as const,
    /** Paginated agents list for admin */
    agents: (params?: any) => ['admin', 'agents', params] as const,
    /** Single agent detail for admin */
    agent: (id: string) => ['admin', 'agents', id] as const,
    /** Paginated bookings list for admin */
    bookings: (params?: any) => ['admin', 'bookings', params] as const,
    /** Single booking detail for admin */
    booking: (id: string) => ['admin', 'bookings', id] as const,
    /** Users list for admin */
    users: () => ['admin', 'users'] as const,
    /** Single user detail for admin */
    user: (id: string) => ['admin', 'users', id] as const,
  },
  notifications: {
    /** User notification list */
    list: () => ['notifications'] as const,
  },
} as const;
