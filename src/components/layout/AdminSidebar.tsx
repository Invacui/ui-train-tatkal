/**
 * @file Admin Sidebar component
 * @module components/layout/AdminSidebar
 * @description Sidebar navigation for the admin panel with links to
 *   Overview, Agents, Bookings, Users, and Email Templates.
 */

// Router navigation
import { NavLink, useNavigate } from 'react-router-dom';

// Sidebar icons
import {
  LayoutDashboard,
  Users,
  Ticket,
  ShieldCheck,
  Mail,
  Train,
} from 'lucide-react';

// Utility for conditional class names
import { cn } from '@/lib/utils';

// Application route constants
import { ROUTES } from '@/constants/routes';

const navItems = [
  { to: ROUTES.admin.root, icon: LayoutDashboard, label: 'Overview' },
  { to: ROUTES.admin.agents, icon: Users, label: 'Agents' },
  { to: ROUTES.admin.bookings, icon: Ticket, label: 'Bookings' },
  { to: ROUTES.admin.users, icon: Users, label: 'Users' },
  { to: ROUTES.admin.emailTemplates, icon: Mail, label: 'Email Templates' },
];

/**
 * AdminSidebar
 * @description Fixed-width sidebar for the admin panel. Shows admin
 *   branding and navigation links to admin features.
 * @returns A sidebar navigation element
 */
export function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-2 px-4">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <button
          onClick={() => navigate(ROUTES.admin.root)}
          className="flex items-center gap-2 font-bold text-primary"
        >
          <Train className="h-4 w-4" />
          <span>Admin · TripTatkal</span>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.admin.root}
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
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
