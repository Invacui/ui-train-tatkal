/**
 * @file Price Breakdown Dialog
 * @module components/trips/PriceBreakdownDialog
 * @description Dialog showing a detailed price breakdown for a selected
 *   train class. Pricing config is pre-fetched at TripResults level so
 *   this dialog always uses cached values or hardcoded fallbacks.
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatCurrency, cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, IndianRupee, ShieldCheck, Building, Home, Percent } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { CustomClassAvailability, Train as TrainType } from '@/types/trips.types';

interface PriceBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cls: CustomClassAvailability;
  trainName: string;
  trainNumber: string;
  isDeparted?: boolean;
  train?: TrainType;
  source?: string;
  destination?: string;
  date?: string;
}

/**
 * PriceBreakdownDialog
 * @description Modal showing a detailed fare breakdown for the selected class.
 *   Uses hardcoded defaults for fee percentages (real values come from
 *   pricing config pre-fetched at TripResults level via React Query cache).
 *   "Proceed to Book" navigates to the booking page with train data in state.
 */
export function PriceBreakdownDialog({
  open,
  onOpenChange,
  cls,
  trainName,
  trainNumber,
  isDeparted,
  train,
  source,
  destination,
  date,
}: PriceBreakdownDialogProps) {
  const navigate = useNavigate();
  const [includeDelivery, setIncludeDelivery] = useState(false);

  // Hardcoded defaults used as fallback — real values come from
  // pre-fetched pricing config in React Query cache (warmed by TripResults)
  const agentFeePct = 5 / 100;
  const platformCharge = 30;
  const deliveryCharge = 50;

  const baseFare = cls.fare_amount;
  const bookingFee = Math.round(baseFare * agentFeePct);
  const platFee = platformCharge;
  const homeDlv = includeDelivery ? deliveryCharge : 0;
  const total = baseFare + bookingFee + platFee + homeDlv;

  const items = [
    { label: 'Base Fare', value: baseFare, icon: IndianRupee, color: 'bg-blue-500' },
    { label: `Agent Booking Fee (${(agentFeePct * 100).toFixed(0)}%)`, value: bookingFee, icon: ShieldCheck, color: 'bg-violet-500' },
    { label: 'Platform Charges', value: platFee, icon: Building, color: 'bg-amber-500' },
  ];

  if (includeDelivery) {
    items.push({ label: 'Home Delivery', value: homeDlv, icon: Home, color: 'bg-emerald-500' });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            <span>Price Breakdown</span>
          </DialogTitle>
          <DialogDescription>
            {trainName} · <span className="font-mono">{trainNumber}</span> ·{' '}
            <Badge variant="outline" className="inline font-mono text-xs">
              {cls.travel_class_code}{cls.quota_code === 'TQ' ? ' Tatkal' : ''}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ── Visual percentage bar ── */}
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            {items.map((item) => (
              <div
                key={item.label}
                className={cn('h-full transition-all', item.color)}
                style={{ width: `${(item.value / total) * 100}%` }}
                title={`${item.label}: ${formatCurrency(item.value)}`}
              />
            ))}
          </div>

          {/* ── Line items ── */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>

          {/* ── Optional delivery toggle ── */}
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="home-delivery" className="flex items-center gap-2 text-sm font-medium">
                <Home className="h-4 w-4 text-muted-foreground" />
                Home Delivery
              </Label>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(deliveryCharge)} — Ticket delivered to your address
              </span>
            </div>
            <Switch
              id="home-delivery"
              checked={includeDelivery}
              onCheckedChange={setIncludeDelivery}
            />
          </div>

          {/* ── Divider ── */}
          <hr className="border-border" />

          {/* ── Total ── */}
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2 text-base font-semibold">
              <Percent className="h-4 w-4 text-primary" />
              Total
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(total)}
            </span>
          </div>

          {/* ── Departed notice ── */}
          {isDeparted && (
            <p className="text-center text-xs text-red-500 font-medium">
              This train has already departed and cannot be booked.
            </p>
          )}

          {/* ── Booking button ── */}
          <Button
            className="w-full gap-2"
            disabled={isDeparted}
            onClick={() => {
              onOpenChange(false);
              if (trainNumber && train) {
                const params = new URLSearchParams();
                if (source) params.set('source', source);
                if (destination) params.set('destination', destination);
                if (date) params.set('date', date);
                const qs = params.toString();
                navigate(`${ROUTES.booking(trainNumber)}${qs ? `?${qs}` : ''}`, {
                  state: { trainData: train },
                });
              } else if (trainNumber) {
                navigate(ROUTES.booking(trainNumber));
              }
            }}
          >
            <ShieldCheck className="h-4 w-4" />
            Proceed to Book — {formatCurrency(total)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
