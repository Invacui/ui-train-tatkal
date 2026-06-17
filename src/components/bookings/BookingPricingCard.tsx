/**
 * @file Booking Pricing Card component
 * @module components/bookings/BookingPricingCard
 * @description Displays a detailed price breakdown for a booking including
 *   base fare, IRCTC charges, Tatkal charges, convenience fee, GST,
 *   agent fee, discount (if any), and total amount.
 */

// Shadcn card components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Utility function for currency formatting
import { formatCurrency } from '@/lib/utils';

// Booking pricing type
import type { BookingPricing } from '@/types/bookings.types';

interface BookingPricingCardProps {
  /** The pricing breakdown object */
  pricing: BookingPricing;
}

/**
 * BookingPricingCard
 * @description Renders a card with a full price breakdown, showing each
 *   charge component and a bold total. Discount is shown as a negative
 *   value in green if present.
 * @param props BookingPricingCardProps
 * @returns A pricing breakdown card
 */
export function BookingPricingCard({ pricing }: BookingPricingCardProps) {
  const rows: { label: string; value: number; isTotal?: boolean; isDiscount?: boolean }[] = [
    { label: 'Base Fare', value: pricing.baseFare },
    { label: 'IRCTC Charges', value: pricing.irctcCharges },
    { label: 'Tatkal Charges', value: pricing.tatkalCharges },
    { label: 'Convenience Fee', value: pricing.convenienceFee },
    { label: 'GST', value: pricing.gst },
    { label: 'Agent Fee', value: pricing.agentFee },
    ...(pricing.discount > 0 ? [{ label: 'Discount', value: -pricing.discount, isDiscount: true }] : []),
    { label: 'Total Amount', value: pricing.totalAmount, isTotal: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className={`flex justify-between text-sm ${
                row.isTotal ? 'border-t pt-2 font-semibold' : ''
              } ${row.isDiscount ? 'text-green-600' : ''}`}
            >
              <span>{row.label}</span>
              <span>{row.isDiscount ? `-${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
