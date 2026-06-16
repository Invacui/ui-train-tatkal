import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LeadListSelector } from './LeadListSelector';

interface LaunchConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLaunch: (leadRequestId: string) => void;
  isPending?: boolean;
}

export function LaunchConfirmDialog({
  open,
  onOpenChange,
  onLaunch,
  isPending,
}: LaunchConfirmDialogProps) {
  const [leadRequestId, setLeadRequestId] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Launch campaign</DialogTitle>
          <DialogDescription>
            Select the lead list to send this template to. This will start a new campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Lead list</label>
          <LeadListSelector value={leadRequestId} onChange={setLeadRequestId} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => onLaunch(leadRequestId)}
            disabled={!leadRequestId || isPending}
          >
            {isPending ? 'Launching…' : 'Launch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
