/**
 * @file App component
 * @description Root application component. Initialises the React Router with
 *   lazy-loaded route definitions. Routes are configured in Routes.tsx.
 *   The root route has an errorElement that catches all route-level rendering errors.
 * @module App
 */

// React Router provider
import { RouterProvider } from 'react-router-dom';

// Centralised route configuration
import router from './Routes';

/**
 * App
 * @description Renders the RouterProvider with the configured browser router.
 *   The outer ErrorBoundary (in main.tsx) catches errors outside the router tree,
 *   while the root route's errorElement catches route-level rendering errors.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
