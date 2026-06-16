import { Users, Megaphone, FileText, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { PlatformStats } from '@/types/admin.types';

interface PlatformStatsGridProps {
  stats?: PlatformStats | undefined;
  isLoading?: boolean | undefined;
}

export function PlatformStatsGrid({ stats, isLoading }: PlatformStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { label: 'Total users', value: stats.totalUsers, icon: Users },
    { label: 'Active users', value: stats.activeUsers, icon: Users },
    { label: 'Total campaigns', value: stats.totalCampaigns, icon: Megaphone },
    { label: 'Leads processed', value: stats.totalLeadsProcessed, icon: FileText },
    { label: 'Tokens used', value: stats.totalTokensUsed, icon: Coins },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 p-4">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
