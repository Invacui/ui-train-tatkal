/**
 * @file Cancel Booking Dialog component
 * @module components/common/CancelBookingDialog
 * @description A dialog that asks for a cancellation reason before submitting.
 */

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

interface CancelBookingDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Called with the reason when user confirms cancellation */
  onConfirm: (reason: string) => void;
  /** Whether the cancel request is in progress */
  isPending?: boolean;
}

const QUICK_REASONS = [
  'Planning to change travel date',
  'Found a better train / route',
  'No longer travelling',
  'Booking by mistake',
];

/**
 * CancelBookingDialog
 * @description Modal dialog that collects a cancellation reason before proceeding.
 *   Provides quick-select chips and a free-text area.
 */
export function CancelBookingDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: CancelBookingDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason('');
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setReason('');
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel booking?</DialogTitle>
          <DialogDescription>
            Tell us why you&apos;re cancelling. Cancellation charges may apply as per IRCTC rules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex flex-wrap gap-2">
            {QUICK_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  reason === r
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Or write your own reason…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
          >
            {isPending ? 'Cancelling…' : 'Cancel Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
