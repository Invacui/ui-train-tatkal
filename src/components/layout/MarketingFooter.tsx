import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} LeadFlow. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to={ROUTES.pricing} className="hover:text-foreground">Pricing</Link>
          <Link to={ROUTES.about} className="hover:text-foreground">About</Link>
          <Link to={ROUTES.login} className="hover:text-foreground">Login</Link>
        </div>
      </div>
    </footer>
  );
}
