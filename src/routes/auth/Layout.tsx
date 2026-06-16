import { Outlet } from 'react-router-dom';
import { GuestGuard } from '@/guards/GuestGuard';
import { Card } from '@/components/ui/card';

export default function AuthLayout() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary">LeadFlow</h1>
          </div>
          <Card className="p-6">
            <Outlet />
          </Card>
        </div>
      </div>
    </GuestGuard>
  );
}
