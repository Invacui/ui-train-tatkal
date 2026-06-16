import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Megaphone,
  MessageSquare,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, selectSidebarOpen } from '@/store/ui.slice';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const navItems = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Overview' },
  { to: ROUTES.leads, icon: Users, label: 'Leads' },
  { to: ROUTES.templates, icon: FileText, label: 'Templates' },
  { to: ROUTES.campaigns, icon: Megaphone, label: 'Campaigns' },
  { to: ROUTES.conversations, icon: MessageSquare, label: 'Conversations' },
];

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
          <button onClick={() => navigate(ROUTES.dashboard)} className="font-bold text-primary">
            LeadFlow
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
