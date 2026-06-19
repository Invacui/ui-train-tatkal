/**
 * @file Application entry point
 * @description Mounts the React application into the DOM, wrapping it with StrictMode,
 *   the ErrorBoundary (outer catch-all for critical failures), and Providers.
 * @module main
 */

// React strict mode for development warnings
import { StrictMode } from 'react';
// React 18 createRoot API
import { createRoot } from 'react-dom/client';
// Outer error boundary — catches errors outside React Router's errorElement
import ErrorBoundary from '@/components/common/ErrorBoundary';
// Top-level providers (Redux, Router, Theme, etc.)
import { Providers } from '@/components/common/Providers';
// Root application component
import App from './App';
// Global CSS styles
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </ErrorBoundary>
  </StrictMode>,
);
