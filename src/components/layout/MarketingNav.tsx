/**
 * @file Marketing Nav component
 * @module components/layout/MarketingNav
 * @description Top navigation bar for the public marketing site.
 *   Shows brand logo, nav links, theme toggle, and auth buttons.
 *   When logged in, shows user dropdown with dashboard/settings/logout.
 */

// React hooks
import { useState } from 'react';

// Router navigation components
import { Link, NavLink, useNavigate } from 'react-router-dom';

// Nav icons
import { Menu, X, Train } from 'lucide-react';

// Shadcn button component
import { Button } from '@/components/ui/button';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Utility for conditional class names
import { cn } from '@/lib/utils';

// Theme toggle button
import { ThemeToggle } from '@/components/common/ThemeToggle';

// Redux hooks for user state
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';

// Logout mutation hook
import { useLogout } from '@/hooks/auth/useLogout';

// Shadcn dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const links = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.searchTrips, label: 'Search Trains' },
  { to: ROUTES.pnrCheck, label: 'PNR Status' },
];

/**
 * MarketingNav
 * @description Renders a sticky header navigation bar for the public site.
 *   Includes brand logo, nav links, theme toggle, and auth buttons.
 *   When a user is logged in, shows an account dropdown with dashboard
 *   and logout options. Mobile responsive with hamburger menu.
 * @returns A sticky header navigation bar
 */
export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-bold text-primary">
          <Train className="h-5 w-5" />
          <span>TripTatkal</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to={ROUTES.agentLogin}>Agent Portal</Link>
              </Button>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to={ROUTES.login}>Log in</Link>
              </Button>
              <Button asChild>
                <Link to={ROUTES.signup}>Sign up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.settings)}>
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (user.role === 'admin') navigate(ROUTES.admin.root);
                  else if (user.role === 'agent') navigate(ROUTES.agent.root);
                  else navigate(ROUTES.dashboard);
                }}>
                  Go to dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {label}
            </NavLink>
          ))}
          <Link
            to={ROUTES.agentLogin}
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Agent Portal
          </Link>
          <Link
            to={ROUTES.login}
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to={ROUTES.signup}
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}
