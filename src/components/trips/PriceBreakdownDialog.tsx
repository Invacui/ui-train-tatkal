/**
 * @file Price Breakdown Dialog
 * @module components/trips/PriceBreakdownDialog
 * @description Dialog showing a detailed price breakdown for a selected
 *   train class: base fare, agent booking fee, platform charges, optional
 *   home delivery, and total. Includes a visual percentage bar.
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
import { Train, IndianRupee, ShieldCheck, Building, Home, Percent } from 'lucide-react';
import type { CustomClassAvailability } from '@/types/trips.types';

// ─── Fee configuration ──────────────────────────────────────────
const AGENT_BOOKING_FEE_PERCENT = 0.05;   // 5% of base fare
const PLATFORM_CHARGE_FLAT = 30;          // ₹30 flat
const HOME_DELIVERY_CHARGE = 50;          // ₹50 optional

interface PriceBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cls: CustomClassAvailability;
  trainName: string;
  trainNumber: string;
}

/**
 * PriceBreakdownDialog
 * @description Modal showing a detailed fare breakdown for the selected
 *   class: base fare, agent booking fee, platform charges, optional home
 *   delivery, and grand total. Visual bar shows the proportion of each.
 */
export function PriceBreakdownDialog({
  open,
  onOpenChange,
  cls,
  trainName,
  trainNumber,
}: PriceBreakdownDialogProps) {
  const [includeDelivery, setIncludeDelivery] = useState(false);

  const baseFare = cls.fare_amount;
  const bookingFee = Math.round(baseFare * AGENT_BOOKING_FEE_PERCENT);
  const platformCharge = PLATFORM_CHARGE_FLAT;
  const deliveryCharge = includeDelivery ? HOME_DELIVERY_CHARGE : 0;
  const total = baseFare + bookingFee + platformCharge + deliveryCharge;

  const items = [
    { label: 'Base Fare', value: baseFare, icon: IndianRupee, color: 'bg-blue-500' },
    { label: 'Agent Booking Fee (5%)', value: bookingFee, icon: ShieldCheck, color: 'bg-violet-500' },
    { label: 'Platform Charges', value: platformCharge, icon: Building, color: 'bg-amber-500' },
  ];

  if (includeDelivery) {
    items.push({ label: 'Home Delivery', value: deliveryCharge, icon: Home, color: 'bg-emerald-500' });
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
                {formatCurrency(HOME_DELIVERY_CHARGE)} — Ticket delivered to your address
              </span>
              <small className="flex text-xs text-muted-foreground items-center gap-2">
               <div className=""> Printing charges : <span className="font-semibold text-foreground">{formatCurrency(10)}</span></div>
                Handling charges : <span className="font-semibold text-foreground">{formatCurrency(40)}</span>
              </small>
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

          {/* ── Booking button ── */}
          <Button className="w-full gap-2">
            <ShieldCheck className="h-4 w-4" />
            Proceed to Book — {formatCurrency(total)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
