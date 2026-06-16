import { Outlet } from 'react-router-dom';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

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
