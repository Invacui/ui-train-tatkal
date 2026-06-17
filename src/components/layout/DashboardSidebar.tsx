/**
 * @file Dashboard Sidebar component
 * @module components/layout/DashboardSidebar
 * @description Collapsible sidebar for the authenticated dashboard area.
 *   Displays navigation links (Overview, Search Trips, My Bookings, Settings)
 *   and supports collapsing to an icon-only state via a toggle button.
 */

// Router navigation
import { NavLink, useNavigate } from 'react-router-dom';

// Sidebar icons
import {
  LayoutDashboard,
  Search,
  Ticket,
  Settings,
  ChevronLeft,
  Train,
} from 'lucide-react';

// Shadcn button component
import { Button } from '@/components/ui/button';

// Redux hooks and sidebar state
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, selectSidebarOpen } from '@/store/ui.slice';

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
 * DashboardSidebar
 * @description A collapsible sidebar for the dashboard area. Shows
 *   navigation links (Overview, Search Trips, My Bookings) and Settings
 *   at the bottom. Collapses to icon-only with a chevron toggle.
 * @returns A sidebar navigation element
 */
export function DashboardSidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-background transition-all duration-200',
        isOpen ? 'w-56' : 'w-16',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen && (
          <button onClick={() => navigate(ROUTES.dashboard)} className="flex items-center gap-2 font-bold text-primary">
            <Train className="h-4 w-4" />
            <span>TripTatkal</span>
          </button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="ml-auto"
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', !isOpen && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.dashboard}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {isOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pb-4">
        <NavLink
          to={ROUTES.settings}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )
          }
        >
          <Settings className="h-4 w-4 shrink-0" />
          {isOpen && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
