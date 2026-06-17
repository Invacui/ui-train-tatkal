/**
 * @file Marketing Footer component
 * @module components/layout/MarketingFooter
 * @description Footer for the public marketing site with copyright,
 *   nav links, and login link.
 */

// Router navigation component
import { Link } from 'react-router-dom';

// Application route constants
import { ROUTES } from '@/constants/routes';

/**
 * MarketingFooter
 * @description Renders a simple footer with copyright year and navigation
 *   links (Home, Search Trains, Login).
 * @returns A footer element
 */
export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} TripTatkal. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to={ROUTES.home} className="hover:text-foreground">Home</Link>
          <Link to={ROUTES.searchTrips} className="hover:text-foreground">Search Trains</Link>
          <Link to={ROUTES.login} className="hover:text-foreground">Login</Link>
        </div>
      </div>
    </footer>
  );
}
