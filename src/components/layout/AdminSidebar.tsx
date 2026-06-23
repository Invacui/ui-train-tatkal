/**
 * @file Admin Sidebar component
 * @module components/layout/AdminSidebar
 * @description Collapsible sidebar for the admin panel with links to
 *   Overview, Agents, Bookings, Users, and Email Templates.
 *   Toggle button sits at the bottom edge, inside the sidebar flow.
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Sidebar icons
import {
  LayoutDashboard,
  Users,
  Ticket,
  ShieldCheck,
  Mail,
  Train,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Utility for conditional class names
import { cn } from '@/lib/utils';

// Application route constants
import { ROUTES } from '@/constants/routes';

// UI components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: ROUTES.admin.root, icon: LayoutDashboard, label: 'Overview', end: true },
  { to: ROUTES.admin.agents, icon: Users, label: 'Agents' },
  { to: ROUTES.admin.bookings, icon: Ticket, label: 'Bookings' },
  { to: ROUTES.admin.users, icon: Users, label: 'Users' },
  { to: ROUTES.admin.emailTemplates, icon: Mail, label: 'Email Templates' },
];

interface SidebarNavItemProps {
  item: NavItem;
  isOpen: boolean;
}

function SidebarNavItem({ item, isOpen }: SidebarNavItemProps) {
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
 * AdminSidebar
 * @description Collapsible sidebar for the admin panel. Shows admin
 *   branding and navigation links to admin features.
 *   Collapse/expand toggle sits inside the sidebar at the bottom.
 * @returns A sidebar navigation element
 */
export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out',
          isOpen ? 'w-56' : 'w-16',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          {isOpen && (
            <button
              onClick={() => navigate(ROUTES.admin.root)}
              className="flex items-center gap-2 font-bold text-primary"
            >
              <Train className="h-4 w-4" />
              <span>Admin · TripTatkal</span>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} isOpen={isOpen} />
          ))}
        </nav>

        {/* Toggle collapse — inside the sidebar at the bottom edge */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'flex items-center gap-2 w-full text-muted-foreground hover:text-foreground',
              !isOpen && 'justify-center px-0',
            )}
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="text-xs">Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
