import { Users, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LeadRequest } from '@/types/leads.types';

interface LeadStatsBarProps {
  leads: LeadRequest[];
}

export function LeadStatsBar({ leads }: LeadStatsBarProps) {
  const total = leads.reduce((sum, l) => sum + l.totalLeads, 0);
  const ready = leads.filter((l) => l.status === 'READY').length;
  const processing = leads.filter((l) => l.status === 'PROCESSING').length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-2xl font-bold">{total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total leads</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{ready}</p>
            <p className="text-xs text-muted-foreground">Ready lists</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Clock className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{processing}</p>
            <p className="text-xs text-muted-foreground">Processing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
