import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/components/common/RelativeTime';
import type { HotLead } from '@/types/campaigns.types';

interface HotLeadsListProps {
  hotLeads: HotLead[];
}

export function HotLeadsList({ hotLeads }: HotLeadsListProps) {
  if (!hotLeads.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">No hot leads yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {hotLeads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{lead.leadName}</CardTitle>
            <Badge variant="outline" className="gap-1 text-orange-600">
              <Flame className="h-3 w-3" />
              Score {lead.score}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">{lead.leadEmail}</p>
            <p className="text-sm">{lead.replyContent}</p>
            <p className="text-xs text-muted-foreground">
              <RelativeTime date={lead.createdAt} />
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
