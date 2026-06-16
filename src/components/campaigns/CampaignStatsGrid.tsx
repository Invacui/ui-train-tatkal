import { Send, Eye, TrendingUp, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Campaign } from '@/types/campaigns.types';

interface CampaignStatsGridProps {
  campaign: Campaign;
}

export function CampaignStatsGrid({ campaign }: CampaignStatsGridProps) {
  const stats = [
    { label: 'Sent', value: campaign.sentCount, icon: Send },
    { label: 'Opened', value: campaign.openCount, icon: Eye },
    { label: 'Replied', value: campaign.replyCount, icon: TrendingUp },
    { label: 'Hot leads', value: campaign.hotLeadCount, icon: Flame },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
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
