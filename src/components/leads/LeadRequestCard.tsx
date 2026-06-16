import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RelativeTime } from '@/components/common/RelativeTime';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDeleteLead } from '@/hooks/leads/useDeleteLead';
import { ROUTES } from '@/constants/routes';
import type { LeadRequest } from '@/types/leads.types';
import { useState } from 'react';

interface LeadRequestCardProps {
  request: LeadRequest;
}

export function LeadRequestCard({ request }: LeadRequestCardProps) {
  const navigate = useNavigate();
  const { mutate: deleteLead, isPending } = useDeleteLead();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const progress =
    request.totalLeads > 0 && request.processedLeads != null
      ? Math.round((request.processedLeads / request.totalLeads) * 100)
      : 0;

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => navigate(ROUTES.lead(request.id))}
      >
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <CardTitle className="text-base">{request.name}</CardTitle>
          <div className="flex items-center gap-2">
            <StatusBadge status={request.status} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{request.fileName}</p>
          {request.status === 'PROCESSING' && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {request.processedLeads} / {request.totalLeads} leads
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            <RelativeTime date={request.createdAt} />
          </p>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete lead list?"
        description="This will permanently delete this lead list and all associated data."
        confirmLabel="Delete"
        variant="destructive"
        isPending={isPending}
        onConfirm={() => {
          deleteLead(request.id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
