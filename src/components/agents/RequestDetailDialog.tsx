/**
 * @file Request Detail Dialog
 * @module components/agents/RequestDetailDialog
 * @description Modal dialog showing full details of a pending booking request.
 *   Includes passenger info, pricing breakdown, and an Accept button.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  Train,
  MapPin,
  Clock,
  Users,
  User,
  IndianRupee,
  ChevronRight,
} from 'lucide-react';
import type { Booking } from '@/types/bookings.types';

interface RequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: Booking;
  onAccept: (bookingId: string) => void;
  isAccepting: boolean;
}

/**
 * RequestDetailDialog
 * @description Opens a modal with full booking request details — route,
 *   travel info, passenger manifest, pricing breakdown, and an Accept button.
 */
export function RequestDetailDialog({
  open,
  onOpenChange,
  request,
  onAccept,
  isAccepting,
}: RequestDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            <span>{request.trainName || request.trainNumber || 'Booking Request'}</span>
          </DialogTitle>
          <DialogDescription>
            {request.sourceStationCode} → {request.destinationStationCode}
            {request.travelTime && ` · ${request.travelTime}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">

          {/* ── Route & Travel Info ── */}
          <section>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Route & Travel
            </h4>
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">From</span>
                  <p className="font-medium">{request.sourceStationCode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">To</span>
                  <p className="font-medium">{request.destinationStationCode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Journey Date</span>
                  <p className="font-medium">{request.journeyDate}</p>
                </div>
                {request.travelTime && (
                  <div>
                    <span className="text-muted-foreground">Time Preference</span>
                    <p className="font-medium capitalize">{request.travelTime}</p>
                  </div>
                )}
                {request.travelClass && (
                  <div>
                    <span className="text-muted-foreground">Class</span>
                    <p className="font-medium">{request.travelClass}</p>
                  </div>
                )}
                {request.trainNumber && (
                  <div>
                    <span className="text-muted-foreground">Train No.</span>
                    <p className="font-medium">{request.trainNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Passengers ── */}
          {request.passengers && request.passengers.length > 0 && (
            <section>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Passengers ({request.passengers.length})
              </h4>
              <div className="space-y-2">
                {request.passengers.map((p, i) => (
                  <div key={i} className="rounded-lg border bg-muted/30 p-3 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{p.name}</span>
                      <Badge variant="outline" className="text-[10px] font-normal ml-auto">
                        {p.gender}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Age: {p.age}</span>
                      {p.berthPreference && <span>Berth: {p.berthPreference}</span>}
                      {p.idType && <span>ID: {p.idType}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Pricing ── */}
          {request.pricing && (
            <section>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5" /> Pricing
              </h4>
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="space-y-1.5 text-sm">
                  {request.pricing.baseFare > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Fare</span>
                      <span>{formatCurrency(request.pricing.baseFare)}</span>
                    </div>
                  )}
                  {request.pricing.irctcCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IRCTC Charges</span>
                      <span>{formatCurrency(request.pricing.irctcCharges)}</span>
                    </div>
                  )}
                  {request.pricing.convenienceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Convenience Fee</span>
                      <span>{formatCurrency(request.pricing.convenienceFee)}</span>
                    </div>
                  )}
                  {request.pricing.gst > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST</span>
                      <span>{formatCurrency(request.pricing.gst)}</span>
                    </div>
                  )}
                  <hr className="my-1.5 border-border" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(request.pricing.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Status ── */}
          <section>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Status
            </h4>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <Badge variant={request.status === 'pending_agent' ? 'default' : 'secondary'}>
                {request.status.replace(/_/g, ' ')}
              </Badge>
              {request.bookingMode && (
                <span className="ml-2 text-xs text-muted-foreground">
                  · {request.bookingMode} booking
                </span>
              )}
            </div>
          </section>
        </div>

        {/* ── Accept button ── */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => onAccept(request.bookingId)}
            disabled={isAccepting}
          >
            {isAccepting ? 'Accepting…' : 'Accept Request'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
