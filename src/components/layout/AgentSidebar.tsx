/**
 * @file Agent Sidebar component
 * @module components/layout/AgentSidebar
 * @description Collapsible sidebar for the agent dashboard area.
 *   Displays agent-specific navigation links grouped by category
 *   (Main, Account) and includes an online/offline status toggle.
 *   Uses local useState for collapse (not shared ui.slice).
 *   The collapse/expand button sits inside the sidebar at the bottom
 *   rather than floating outside.
 */

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Ticket,
  TrendingUp,
  Wallet,
  Users,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Train,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/auth.slice";
import { useAgentProfile } from "@/hooks/agents/useAgentProfile";
import { useUpdateAgentProfile } from "@/hooks/agents/useUpdateAgentProfile";

interface NavItem {
  to: string;
  icon: typeof Train;
  label: string;
  end?: boolean;
}

const mainNavItems: NavItem[] = [
  { to: ROUTES.agent.root, icon: LayoutDashboard, label: "Overview", end: true },
  { to: ROUTES.agent.requests, icon: ClipboardList, label: "Requests" },
  { to: ROUTES.agent.bookings, icon: Ticket, label: "My Bookings" },
  { to: ROUTES.agent.stats, icon: TrendingUp, label: "Performance Stats" },
  { to: ROUTES.agent.earnings, icon: Wallet, label: "Earnings" },
  { to: ROUTES.agent.team, icon: Users, label: "Team" },
];

const accountNavItems: NavItem[] = [
  { to: ROUTES.agent.profile, icon: UserCircle, label: "Profile" },
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
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }>
      <item.icon className="h-4 w-4 shrink-0" />
      {isOpen && <span>{item.label}</span>}
    </NavLink>
  );

  if (!isOpen) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

/**
 * AgentSidebar
 * @description A collapsible sidebar for the agent dashboard. Shows
 *   agent-specific navigation links (Overview, Requests, Bookings, Stats,
 *   Earnings, Team, Profile) and an online/offline
 *   toggle. Uses local useState for collapse state so it doesn't interfere
 *   with the customer DashboardSidebar. Toggle button sits at the bottom
 *   edge of the sidebar, inside the layout flow.
 */
export function AgentSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const user = useAppSelector(selectUser);
  // Always fetch agent profile — staleTime: 2min prevents unnecessary refetches.
  // We used to gate this on user.onboardingCompleted, but for agents that flag is
  // never true on the User document. The staleTime handles caching.
  const { data: profile } = useAgentProfile(!!user);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateAgentProfile();

  const isOnline = profile?.isOnline ?? true;

  const toggleOnline = () => {
    updateProfile({ isOnline: !isOnline } as Record<string, unknown>);
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
          isOpen ? "w-56" : "w-16"
        )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          {isOpen && (
            <div className="flex items-center gap-2 font-bold text-primary">
              <Train className="h-5 w-5" />
              <span className="text-base">Agent</span>
            </div>
          )}
          {!isOpen && (
            <div className="mx-auto flex items-center justify-center">
              <Train className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>

        {/* Online/Offline toggle */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 mx-2 mb-2 cursor-pointer transition-colors",
            isOpen ? "justify-between" : "justify-center",
            isOnline
              ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
              : "text-muted-foreground hover:bg-accent"
          )}
          onClick={toggleOnline}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleOnline();
          }}>
          {isOnline ? (
            <Wifi className="h-4 w-4 shrink-0" />
          ) : (
            <WifiOff className="h-4 w-4 shrink-0" />
          )}
          {isOpen && (
            <span className="text-xs font-medium">
              {isUpdating ? "Updating…" : isOnline ? "Online" : "Offline"}
            </span>
          )}
          {isOpen && (
            <span
              className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500" : "bg-gray-400")}
            />
          )}
          {!isOpen && (
            <span
              className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500" : "bg-gray-400")}
            />
          )}
        </div>

        {/* Main nav items */}
        <nav className="flex flex-1 flex-col gap-1 px-2 py-2 overflow-y-auto">
          {isOpen && <p className="px-3 pb-1 text-xs font-medium text-muted-foreground/60">Main</p>}

          {mainNavItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} isOpen={isOpen} />
          ))}
        </nav>

        {/* Account section */}
        <div className="border-t border-sidebar-border px-2 pb-1 pt-2">
          {isOpen && (
            <p className="px-3 pb-1 text-xs font-medium text-muted-foreground/60">Account</p>
          )}
          {accountNavItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} isOpen={isOpen} />
          ))}
        </div>

        {/* Toggle collapse — inside the sidebar at the bottom edge */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 w-full text-muted-foreground hover:text-foreground",
              !isOpen && "justify-center px-0"
            )}>
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
