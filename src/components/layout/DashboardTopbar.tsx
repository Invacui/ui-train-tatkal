/**
 * @file Dashboard Topbar component
 * @module components/layout/DashboardTopbar
 * @description Top header bar for the authenticated dashboard area.
 *   Displays notification bell with unread count + dropdown panel,
 *   theme toggle, and user avatar dropdown with settings and logout.
 *
 *   The notification panel uses a Popover (radix-portalled) so it
 *   renders above any layout overflow clipping. Each notification is
 *   a Collapsible accordion — click to expand/collapse full message.
 *   Only one notification can be expanded at a time.
 */

import { useState } from 'react';

// Icons
import { Bell, Menu, CheckCheck, MailOpen, ChevronDown } from 'lucide-react';

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

// Shadcn popover for the notification panel
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Shadcn collapsible for expandable notifications
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

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

// Notifications hooks
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useMarkRead } from '@/hooks/notifications/useMarkRead';
import { useMarkAllRead } from '@/hooks/notifications/useMarkAllRead';

// Router navigation
import { Link, useNavigate } from 'react-router-dom';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Theme toggle button
import { ThemeToggle } from '@/components/common/ThemeToggle';

// Time formatting
import { relativeTime } from '@/lib/utils';

// ───────────────────────────────────────────
//  Notification icon + colour helpers
// ───────────────────────────────────────────

const NOTIFICATION_STYLES: Record<string, { icon: string; dot: string }> = {
  booking_confirmed: { icon: '🎫', dot: 'bg-green-500' },
  booking_failed:    { icon: '❌', dot: 'bg-red-500' },
  pnr_updated:       { icon: '🆔', dot: 'bg-blue-500' },
  payment_success:   { icon: '💰', dot: 'bg-green-500' },
  payment_failed:    { icon: '⚠️', dot: 'bg-red-500' },
  agent_assigned:    { icon: '🤝', dot: 'bg-blue-500' },
  refund_processed:  { icon: '💵', dot: 'bg-green-500' },
  promotion:         { icon: '📢', dot: 'bg-purple-500' },
  system:            { icon: '🔔', dot: 'bg-gray-500' },
};

function notifStyle(type: string) {
  return NOTIFICATION_STYLES[type] ?? { icon: '🔔', dot: 'bg-primary' };
}

// ───────────────────────────────────────────
//  NotificationPanel (inner content)
// ───────────────────────────────────────────

function NotificationPanel() {
  const { data: notifications } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const navigate = useNavigate();

  // Accordion: only one expanded at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unread = notifications?.filter((n) => !n.isRead) ?? [];
  const hasUnread = unread.length > 0;

  const handleBookingClick = (bookingId?: string) => {
    if (bookingId) {
      navigate(ROUTES.bookingDetail(bookingId));
    }
  };

  return (
    <div className="w-[380px] max-w-[92vw]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b pb-2 mb-1">
        <h4 className="text-sm font-semibold">Notifications</h4>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => markAllRead()}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {/* ── List ── */}
      <div className="max-h-[400px] overflow-y-auto -mx-1">
        {!notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-muted-foreground">
            <MailOpen className="h-10 w-10 mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => {
              const style = notifStyle(n.type);
              const isExpanded = expandedId === n.id;

              return (
                <Collapsible
                  key={n.id}
                  open={isExpanded}
                  onOpenChange={(open) => {
                    if (open) {
                      setExpandedId(n.id);
                      if (!n.isRead) markRead(n.id);
                    } else {
                      setExpandedId(null);
                    }
                  }}
                >
                  {/* ── Row (always visible) ── */}
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className={`flex w-full gap-3 px-2 py-3 text-left transition-colors hover:bg-muted/50 ${
                        !n.isRead ? 'bg-primary/[0.04]' : ''
                      }`}
                    >
                      {/* Icon */}
                      <span className="mt-0.5 text-lg shrink-0 leading-none">
                        {n.isRead ? '🔔' : style.icon}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm leading-tight truncate ${
                              !n.isRead ? 'font-semibold' : 'text-muted-foreground'
                            }`}
                          >
                            {n.title}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            {!n.isRead && (
                              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                            )}
                            <ChevronDown
                              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Truncated body (2 lines) */}
                        <p className="mt-0.5 text-xs text-muted-foreground text-left line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/60 text-left">
                          {relativeTime(n.createdAt)}
                        </p>
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  {/* ── Expanded content ── */}
                  <CollapsibleContent>
                    <div className="px-2 pb-3 pt-0">
                      <div className="ml-[2.25rem] space-y-2">
                        {/* Full message */}
                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                          {n.message}
                        </p>

                        {/* Link to booking if present */}
                        {n.data?.bookingId && (
                          <button
                            type="button"
                            className="text-xs text-primary font-medium hover:underline"
                            onClick={() => handleBookingClick(n.data!.bookingId)}
                          >
                            View Booking →
                          </button>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────
//  DashboardTopbar (outer shell)
// ───────────────────────────────────────────

/**
 * DashboardTopbar
 * @description Renders a top header bar for the dashboard. Includes
 *   a mobile hamburger menu toggle, notification bell with dropdown
 *   panel, theme toggle, and a user avatar dropdown with account options.
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

        {/* Notification bell + dropdown panel */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full p-0 text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="p-3">
            <NotificationPanel />
          </PopoverContent>
        </Popover>

        {/* User avatar dropdown */}
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
