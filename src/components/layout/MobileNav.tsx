import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, FileText, Megaphone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const navItems = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Overview' },
  { to: ROUTES.leads, icon: Users, label: 'Leads' },
  { to: ROUTES.templates, icon: FileText, label: 'Templates' },
  { to: ROUTES.campaigns, icon: Megaphone, label: 'Campaigns' },
  { to: ROUTES.conversations, icon: MessageSquare, label: 'Conversations' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-bold text-primary">LeadFlow</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1 px-2 py-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
