/**
 * @file Providers component
 * @module components/common/Providers
 * @description Root provider wrapper that composes Redux, React Query,
 *   Helmet (SEO), and Sonner toast notifications. Also applies
 *   the saved theme on mount.
 */

// React Query provider and devtools
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Sonner toast notification component
import { Toaster } from 'sonner';

// Helmet for managing document head
import { HelmetProvider } from 'react-helmet-async';

// Redux provider
import { Provider } from 'react-redux';

// Application store and query client
import { store } from '@/store';
import { queryClient } from '@/lib/queryClient';

// React hooks
import { useEffect } from 'react';

interface ProvidersProps {
  /** Child components to wrap with providers */
  children: React.ReactNode;
}

/**
 * Providers
 * @description Composes HelmetProvider, Redux Provider, React Query provider,
 *   Sonner Toaster, and React Query Devtools (in dev mode). Also reads
 *   the saved theme from localStorage on mount and applies the dark class.
 * @param props ProvidersProps
 * @returns A tree of provider wrappers around the children
 */
export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    const saved = localStorage.getItem('tt-theme');
    const theme = saved === 'dark' || saved === 'light'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors closeButton />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  );
}
