/**
 * @file Application entry point
 * @description Mounts the React application into the DOM, wrapping it with StrictMode and the Providers component
 * @module main
 */

// React strict mode for development warnings
import { StrictMode } from 'react';
// React 18 createRoot API
import { createRoot } from 'react-dom/client';
// Top-level providers (Redux, Router, Theme, etc.)
import { Providers } from '@/components/common/Providers';
// Root application component
import App from './App';
// Global CSS styles
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
