/**
 * @file PricingStep.tsx
 * @description Step 4: Displays the server-computed price breakdown with visual bar,
 *   line items, and total amount.
 * @module components/checkout
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, RefreshCw, IndianRupee } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

import type { PriceBreakdown } from '@/types/bookings.types';

interface PricingStepProps {
  priceBreakdown: PriceBreakdown | null;
  isCalculating: boolean;
  onRefreshPrice: () => void;
  onBack: () => void;
  onNext: () => void;
}

/** Color assignments for each fee segment in the visual bar */
const SEGMENT_COLORS: Record<string, string> = {
  baseFare: 'bg-blue-500',
  irctcCharges: 'bg-sky-400',
  tatkalCharges: 'bg-orange-400',
  convenienceFee: 'bg-teal-400',
  gst: 'bg-amber-400',
  agentFee: 'bg-violet-400',
  brokerageFee: 'bg-pink-400',
  distanceCharge: 'bg-emerald-400',
  platformCharge: 'bg-gray-400',
  homeDeliveryCharge: 'bg-green-500',
  printingCharge: 'bg-yellow-500',
};

/**
 * PricingStep
 * @description Renders a visual percentage bar and itemised list of all fees
 *   returned by the server-side calculate-price endpoint.
 */
export function PricingStep({
  priceBreakdown,
  isCalculating,
  onRefreshPrice,
  onBack,
  onNext,
}: PricingStepProps) {
  if (isCalculating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calculating Price...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!priceBreakdown) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click below to get the latest price estimate.
          </p>
          <Button onClick={onRefreshPrice}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Calculate Price
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Build segments for the visual bar (items with non-zero values)
  const lineItems: { key: string; label: string; amount: number }[] = [
    { key: 'baseFare', label: `Base Fare (×${priceBreakdown.passengerCount})`, amount: priceBreakdown.baseFare },
    { key: 'irctcCharges', label: 'IRCTC Charges', amount: priceBreakdown.irctcCharges },
    { key: 'tatkalCharges', label: 'Tatkal Charges', amount: priceBreakdown.tatkalCharges },
    { key: 'convenienceFee', label: 'Convenience Fee', amount: priceBreakdown.convenienceFee },
    { key: 'gst', label: 'GST', amount: priceBreakdown.gst },
    { key: 'agentFee', label: 'Agent Service Fee', amount: priceBreakdown.agentFee },
    { key: 'brokerageFee', label: 'Brokerage Fee', amount: priceBreakdown.brokerageFee },
    { key: 'distanceCharge', label: `Distance Charge (${priceBreakdown.estimatedDistance} km × ₹${priceBreakdown.perKmCharge}/km)`, amount: priceBreakdown.distanceCharge },
    { key: 'platformCharge', label: 'Platform Charge', amount: priceBreakdown.platformCharge },
    { key: 'homeDeliveryCharge', label: 'Home Delivery', amount: priceBreakdown.homeDeliveryCharge },
    { key: 'printingCharge', label: 'Printing Charge', amount: priceBreakdown.printingCharge },
  ].filter((item) => item.amount > 0);

  const total = priceBreakdown.totalAmount;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Price Breakdown</CardTitle>
          <Button variant="ghost" size="sm" onClick={onRefreshPrice}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Visual percentage bar */}
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            {lineItems.map((item) => {
              const pct = (item.amount / total) * 100;
              if (pct < 1) return null;
              return (
                <div
                  key={item.key}
                  className={cn(SEGMENT_COLORS[item.key] || 'bg-gray-300', 'h-full')}
                  style={{ width: `${pct}%` }}
                  title={`${item.label}: ${formatCurrency(item.amount)}`}
                />
              );
            })}
          </div>

          {/* Line items */}
          <div className="divide-y">
            {lineItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t-2 border-primary pt-3">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">Total</span>
            </div>
            <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-2">
            {priceBreakdown.estimatedDistance > 0 && (
              <Badge variant="outline" className="text-xs">
                Est. distance: {priceBreakdown.estimatedDistance} km
              </Badge>
            )}
            {priceBreakdown.homeDeliveryCharge > 0 && (
              <Badge variant="outline" className="text-xs">
                Home delivery included
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext}>
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
