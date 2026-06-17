/**
 * @file React Query client
 * @description Configures the global QueryClient with default stale/gc times and a global mutation error handler
 * @module lib
 */

// React Query core for server-state management
import { QueryClient } from '@tanstack/react-query';
// Toast notification library for user-facing error messages
import { toast } from 'sonner';

/**
 * queryClient
 * @description Global QueryClient instance with sensible defaults:
 *   - staleTime: 60s — data is fresh for one minute
 *   - gcTime: 300s — unused data is garbage-collected after 5 minutes
 *   - retry: 1 — single retry on failure
 *   - refetchOnWindowFocus: false — opt out of automatic refetch
 *   - mutations.onError: shows a toast with the error message
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 300_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err: unknown) =>
        toast.error(err instanceof Error ? err.message : 'Something went wrong'),
    },
  },
});
