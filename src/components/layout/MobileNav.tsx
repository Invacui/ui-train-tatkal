/**
 * @file Mobile Nav component
 * @module components/layout/MobileNav
 * @description Mobile navigation button that opens a slide-out sheet
 *   with dashboard navigation links.
 */

// React hooks
import { useState } from 'react';

// Router navigation component
import { NavLink } from 'react-router-dom';

// Mobile nav icons
import { Menu, X, LayoutDashboard, Search, Ticket, Train } from 'lucide-react';

// Shadcn button component
import { Button } from '@/components/ui/button';

// Shadcn sheet for the slide-out panel
import { Sheet, SheetContent } from '@/components/ui/sheet';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Utility for conditional class names
import { cn } from '@/lib/utils';

const navItems = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Overview' },
  { to: ROUTES.searchTrips, icon: Search, label: 'Search Trips' },
  { to: ROUTES.bookings, icon: Ticket, label: 'My Bookings' },
];

/**
 * MobileNav
 * @description Renders a hamburger button that opens a slide-out sheet
 *   (left side) with dashboard navigation links (Overview, Search Trips,
 *   My Bookings).
 * @returns A mobile navigation toggle with sheet
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="flex items-center gap-2 font-bold text-primary">
              <Train className="h-4 w-4" />
              TripTatkal
            </span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1 px-2 py-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
