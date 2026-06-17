/**
 * @file Dashboard Topbar component
 * @module components/layout/DashboardTopbar
 * @description Top header bar for the authenticated dashboard area.
 *   Displays notification bell with unread count, theme toggle,
 *   and user avatar dropdown with settings and logout.
 */

// Icons for the topbar
import { Bell, Menu } from 'lucide-react';

// Shadcn button component
import { Button } from '@/components/ui/button';

// Shadcn dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Avatar components for user initials
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Badge for unread notification count
import { Badge } from '@/components/ui/badge';

// Redux hooks and state
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';
import { toggleSidebar } from '@/store/ui.slice';

// Logout mutation hook
import { useLogout } from '@/hooks/auth/useLogout';

// Notifications hook
import { useNotifications } from '@/hooks/notifications/useNotifications';

// Router navigation component
import { Link } from 'react-router-dom';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Theme toggle button
import { ThemeToggle } from '@/components/common/ThemeToggle';

/**
 * DashboardTopbar
 * @description Renders a top header bar for the dashboard. Includes
 *   a mobile hamburger menu toggle, notification bell with badge,
 *   theme toggle, and a user avatar dropdown with account options.
 * @returns A header bar element
 */
export function DashboardTopbar() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { mutate: logout } = useLogout();
  const { data: notifications } = useNotifications();

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => dispatch(toggleSidebar())}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.settings}>Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.bookings}>My Bookings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
