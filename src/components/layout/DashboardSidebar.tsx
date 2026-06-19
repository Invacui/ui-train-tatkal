/**
 * @file Dashboard Sidebar component
 * @module components/layout/DashboardSidebar
 * @description Collapsible sidebar for the authenticated dashboard area.
 *   Displays navigation links grouped by category (Main, Support, Quick Actions).
 *   Uses CSS transitions for collapse animation. Shows tooltips on nav items
 *   when collapsed.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Ticket,
  Settings,
  ChevronLeft,
  Train,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, selectSidebarOpen } from '@/store/ui.slice';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: typeof Train;
  label: string;
  end?: boolean;
}

const mainNavItems: NavItem[] = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Overview', end: true },
  { to: ROUTES.searchTrips, icon: Search, label: 'Search Trains' },
  { to: ROUTES.bookings, icon: Ticket, label: 'My Bookings' },
  { to: ROUTES.pnrCheck, icon: ClipboardList, label: 'PNR Status' },
];

const bottomNavItems: NavItem[] = [
  { to: ROUTES.settings, icon: Settings, label: 'Settings' },
];

interface SidebarNavItemProps {
  item: NavItem;
  isOpen: boolean;
  onNavigate: (to: string) => void;
}

function SidebarNavItem({ item, isOpen, onNavigate }: SidebarNavItemProps) {
  const content = (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {isOpen && <span>{item.label}</span>}
    </NavLink>
  );

  if (!isOpen) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

/**
 * DashboardSidebar
 * @description A collapsible sidebar for the dashboard area. Shows
 *   navigation links organised into groups (Main, Support). Uses CSS
 *   transitions for smooth collapse animation and Radix Tooltip for icon-only
 *   state. Keyboard shortcut: Ctrl+B toggles collapse.
 */
export function DashboardSidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out',
          isOpen ? 'w-56' : 'w-16',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          {isOpen && (
            <button
              onClick={() => navigate(ROUTES.dashboard)}
              className="flex items-center gap-2 font-bold text-primary"
            >
              <Train className="h-5 w-5" />
              <span className="text-base">TripTatkal</span>
            </button>
          )}
          {!isOpen && (
            <button
              onClick={() => navigate(ROUTES.dashboard)}
              className="mx-auto flex items-center justify-center"
            >
              <Train className="h-5 w-5 text-primary" />
            </button>
          )}
          {isOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              className="ml-auto h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4 transition-transform" />
            </Button>
          )}
          {!isOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              className="absolute -right-3 top-5 z-10 h-6 w-6 rounded-full border bg-background shadow-sm"
            >
              <ChevronLeft className="h-3 w-3 rotate-180" />
            </Button>
          )}
        </div>

        {/* Main nav items */}
        <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
          {/* Group label */}
          {isOpen && (
            <p className="px-3 pb-1 text-xs font-medium text-muted-foreground/60">
              Main
            </p>
          )}

          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.to}
              item={item}
              isOpen={isOpen}
              onNavigate={navigate}
            />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border px-2 pb-4 pt-2">
          {isOpen && (
            <p className="px-3 pb-1 text-xs font-medium text-muted-foreground/60">
              Support
            </p>
          )}
          {bottomNavItems.map((item) => (
            <SidebarNavItem
              key={item.to}
              item={item}
              isOpen={isOpen}
              onNavigate={navigate}
            />
          ))}
        </div>
      </aside>
    </TooltipProvider>
  );
}
