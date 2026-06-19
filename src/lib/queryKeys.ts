/**
 * @file Query key factory
 * @description Centralised factory for React Query cache keys, ensuring type-safe and consistent key structures
 * @module lib
 */

import type { TripSearchParams } from '@/types/trips.types';
import type { PaginationParams } from '@/types/api.types';
import type { CalendarSearchParams } from '@/types/calendar.types';

/**
 * queryKeys
 * @description Factory object that generates typed, consistent query keys for React Query.
 *   Each namespace (auth, trips, bookings, agents, admin, notifications, pnr) provides factory
 *   functions that produce unique keys with proper type inference.
 */
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  trips: {
    search: (params: TripSearchParams) => ['trips', 'search', params] as const,
    detail: (trainNumber: string) => ['trips', 'detail', trainNumber] as const,
    stations: (query?: string) => ['stations', query] as const,
    nearby: () => ['stations', 'nearby'] as const,
    calendar: (params: CalendarSearchParams) => ['trips', 'calendar', params] as const,
  },
  bookings: {
    list: (params?: PaginationParams) => ['bookings', 'list', params] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
    ticket: (id: string) => ['bookings', 'ticket', id] as const,
  },
  agents: {
    profile: () => ['agents', 'profile'] as const,
    requests: () => ['agents', 'requests'] as const,
    bookings: (params?: PaginationParams) => ['agents', 'bookings', params] as const,
    booking: (id: string) => ['agents', 'bookings', id] as const,
    stats: () => ['agents', 'stats'] as const,
    earnings: () => ['agents', 'earnings'] as const,
  },
  admin: {
    dashboard: () => ['admin', 'dashboard'] as const,
    agents: (params?: any) => ['admin', 'agents', params] as const,
    agent: (id: string) => ['admin', 'agents', id] as const,
    bookings: (params?: any) => ['admin', 'bookings', params] as const,
    booking: (id: string) => ['admin', 'bookings', id] as const,
    users: () => ['admin', 'users'] as const,
    user: (id: string) => ['admin', 'users', id] as const,
  },
  notifications: {
    list: () => ['notifications'] as const,
  },
  pnr: {
    status: (pnr: string) => ['pnr', 'status', pnr] as const,
  },
} as const;
