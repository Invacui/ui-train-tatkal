/**
 * @file 404 Not Found page
 * @module routes/NotFound
 * @description Catch-all page displayed when no route matches the current URL.
 *   Shows a 404 message with a link back to the home page.
 */

// Link for navigation back to home
import { Link } from 'react-router-dom';

// UI button component styled as a link
import { Button } from '@/components/ui/button';

// Route constants for home route
import { ROUTES } from '@/constants/routes';

/**
 * NotFound (page component)
 * @description Renders a 404 page with an error message and a button linking
 *   back to the home page.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-xl font-semibold">Page not found</p>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link to={ROUTES.home}>Go home</Link>
      </Button>
    </div>
  );
}
