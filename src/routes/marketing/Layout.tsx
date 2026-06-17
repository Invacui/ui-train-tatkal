/**
 * @file Marketing layout wrapper
 * @module routes/marketing/Layout
 * @description Provides the marketing section shell with navigation and footer.
 */

// React Router outlet for nested marketing routes
import { Outlet } from 'react-router-dom';

// Marketing-specific navigation bar
import { MarketingNav } from '@/components/layout/MarketingNav';

// Marketing-specific footer
import { MarketingFooter } from '@/components/layout/MarketingFooter';

/**
 * MarketingLayout (layout component)
 * @description Renders the marketing/public pages shell including the marketing
 *   nav bar and footer around an Outlet for nested routes.
 */
export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
