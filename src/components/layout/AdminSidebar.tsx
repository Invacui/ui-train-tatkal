import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const navItems = [
  { to: ROUTES.admin.root, icon: LayoutDashboard, label: 'Overview' },
  { to: ROUTES.admin.users, icon: Users, label: 'Users' },
  { to: ROUTES.admin.leadRequests, icon: FileText, label: 'Lead Requests' },
  { to: ROUTES.admin.campaigns, icon: Megaphone, label: 'Campaigns' },
];

export function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-2 px-4">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <button
          onClick={() => navigate(ROUTES.admin.root)}
          className="font-bold text-primary"
        >
          Admin
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
