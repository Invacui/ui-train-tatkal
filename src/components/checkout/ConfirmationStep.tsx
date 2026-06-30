/**
 * @file ConfirmationStep.tsx
 * @description Step 7 (final): Shows booking success details — full pricing breakdown,
 *   journey details, passenger list, delivery info, payment info, and action links.
 * @module components/checkout
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Train,
  Users,
  IndianRupee,
  Eye,
  Plus,
  Info,
  Home,
  CreditCard,
  Timer,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime, getStatusLabel } from '@/lib/utils';
import { usePrintReceipt } from '@/hooks/print/usePrintReceipt';

import type { Booking } from '@/types/bookings.types';

interface ConfirmationStepProps {
  booking: Booking;
  onViewBooking: () => void;
  onNewBooking: () => void;
}

/**
 * DetailRow — labelled key-value row for info grids.
 */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm">{children}</p>
    </div>
  );
}

/**
 * FlexTag — small coloured pill for boolean flexibility flags.
 */
function FlexTag({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
      }`}
    >
      {label}
    </span>
  );
}

/**
 * ConfirmationStep
 * @description Final step showing a success message and a comprehensive booking summary
 *   after payment is verified and the booking is created. Includes full pricing breakdown,
 *   journey details, passenger manifest, delivery status, flexibility toggles, and
 *   payment information.
 */
export function ConfirmationStep({ booking, onViewBooking, onNewBooking }: ConfirmationStepProps) {
  const { printReceipt } = usePrintReceipt();
  const hasFlexibility =
    booking.dateFlexibility ||
    booking.trainFlexibility ||
    booking.stationFlexibility ||
    booking.travelTimeFlexibility;

  const p = booking.pricing;

  // Pricing line items: only show rows that are > 0
  const pricingRows: { label: string; value: number; isTotal?: boolean; isDiscount?: boolean }[] = [
    { label: 'Base Fare', value: p?.baseFare ?? 0 },
    ...(p && p.platformFee > 0 ? [{ label: 'Platform Fee', value: p.platformFee }] : []),
    ...(p && p.agentFee > 0 ? [{ label: 'Agent Fee', value: p.agentFee }] : []),
    ...(p && p.convenienceFee > 0 ? [{ label: 'Convenience Fee', value: p.convenienceFee }] : []),
    ...(p && p.gst > 0 ? [{ label: 'GST', value: p.gst }] : []),
    ...(p && (p.deliveryCharge ?? 0) > 0
      ? [{ label: 'Delivery Fee', value: p.deliveryCharge ?? 0 }]
      : []),
    ...(p && (p.discount ?? 0) > 0
      ? [{ label: 'Discount', value: -(p.discount ?? 0), isDiscount: true as const }]
      : []),
    { label: 'Total Amount', value: p?.totalAmount ?? 0, isTotal: true },
  ];

  return (
    <div className="space-y-6">
      {/* ── Success Header ── */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-green-700">Booking Confirmed!</h2>
          <p className="text-sm text-green-600 mt-1">
            Your booking has been placed successfully.
          </p>
        </CardContent>
      </Card>

      {/* ── Journey Details ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Journey Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Train">
            {booking.trainName
              ? `${booking.trainName} (${booking.trainNumber})`
              : booking.trainNumber || '—'}
          </DetailRow>
          <DetailRow label="Route">
            {booking.sourceStationCode} → {booking.destinationStationCode}
          </DetailRow>
          <DetailRow label="Class">{booking.travelClass || '—'}</DetailRow>
          <DetailRow label="Journey Date">
            {booking.journeyDate ? formatDate(booking.journeyDate) : '—'}
          </DetailRow>
          <DetailRow label="Timing">
            {booking.departureTime || '—'} — {booking.arrivalTime || '—'}
          </DetailRow>
          <DetailRow label="Booking ID">
            <span className="font-mono text-xs">{booking.bookingId}</span>
          </DetailRow>
          <DetailRow label="PNR">
            <span className="font-mono">{booking.pnrNumber || 'Awaiting PNR'}</span>
          </DetailRow>
          <DetailRow label="Booking Mode">
            <span className="capitalize">{booking.bookingMode || '—'}</span>
          </DetailRow>
          <DetailRow label="Status">
            <Badge variant="outline" className="text-xs">
              {getStatusLabel(booking.status)}
            </Badge>
          </DetailRow>
        </CardContent>
      </Card>

      {/* ── Flexibility & Delivery ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hasFlexibility && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm">Flexibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              <FlexTag label="Date flex" active={!!booking.dateFlexibility} />
              <FlexTag label="Train flex" active={!!booking.trainFlexibility} />
              <FlexTag label="Station flex" active={!!booking.stationFlexibility} />
              <FlexTag label="Time flex" active={!!booking.travelTimeFlexibility} />
              {booking.travelTime && (
                <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  Preferred: {booking.travelTime}
                </span>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Home Delivery</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {booking.needHomeDelivery ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">Requested</p>
                {booking.deliveryAddress && (
                  <p className="text-xs text-muted-foreground">
                    {[
                      booking.deliveryAddress.line1,
                      booking.deliveryAddress.line2,
                      booking.deliveryAddress.city,
                      booking.deliveryAddress.state,
                      booking.deliveryAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not requested</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Passengers ── */}
      {booking.passengers && booking.passengers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">
                Passengers ({booking.passengers.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.passengers.map((p, i) => (
              <div key={i}>
                {i > 0 && <hr className="mb-4 border-t" />}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailRow label="Name">{p.name}</DetailRow>
                  <DetailRow label="Age / Gender">
                    {p.age} yrs, {p.gender}
                  </DetailRow>
                  {p.berthPreference && (
                    <DetailRow label="Berth Preference">{p.berthPreference}</DetailRow>
                  )}
                  {p.idCardType && <DetailRow label="ID Type">{p.idCardType}</DetailRow>}
                  {p.idCardNumber && (
                    <DetailRow label="ID Number">
                      <span className="font-mono text-sm">{p.idCardNumber}</span>
                    </DetailRow>
                  )}
                  {p.seatNumber && <DetailRow label="Seat / Coach">{p.seatNumber}</DetailRow>}
                  {p.status && <DetailRow label="Status">{p.status}</DetailRow>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Pricing Breakdown ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Price Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {pricingRows.map((row) => (
              <div
                key={row.label}
                className={`flex justify-between text-sm ${
                  row.isTotal ? 'border-t pt-2 mt-2 font-semibold text-base' : ''
                } ${row.isDiscount ? 'text-green-600' : ''}`}
              >
                <span>{row.label}</span>
                <span>
                  {row.isDiscount
                    ? `-${formatCurrency(Math.abs(row.value))}`
                    : formatCurrency(row.value)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Payment Info ── */}
      {(booking.paymentId || booking.razorpayOrderId || booking.paymentStatus) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Payment Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {booking.paymentStatus && (
              <DetailRow label="Payment Status">
                <span className="capitalize">{booking.paymentStatus}</span>
              </DetailRow>
            )}
            {booking.paymentId && (
              <DetailRow label="Payment ID">
                <span className="font-mono text-sm">{booking.paymentId}</span>
              </DetailRow>
            )}
            {booking.razorpayOrderId && (
              <DetailRow label="Razorpay Order ID">
                <span className="font-mono text-sm break-all">{booking.razorpayOrderId}</span>
              </DetailRow>
            )}
            {p?.totalAmount && (
              <DetailRow label="Total Charged">{formatCurrency(p.totalAmount)}</DetailRow>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Booking Metadata ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Booking Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Form Stage">
            <div className="flex items-center gap-1.5">
              <span>Step {booking.formStage} of 7</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round((booking.formStage / 7) * 100)}%` }}
                />
              </div>
            </div>
          </DetailRow>
          <DetailRow label="Created">
            <span title={booking.createdAt ? formatDateTime(booking.createdAt) : ''}>
              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '—'}
            </span>
          </DetailRow>
          {booking.isBroadcasted && (
            <DetailRow label="Agent Broadcast">
              <span className="text-yellow-600">Broadcasted to agents</span>
            </DetailRow>
          )}
          {booking.agentRequestSent && (
            <DetailRow label="Agent Request">
              <span className="text-blue-600">Request sent</span>
            </DetailRow>
          )}
        </CardContent>
      </Card>

      {/* ── Actions ── */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Button variant="outline" onClick={onViewBooking}>
          <Eye className="h-4 w-4 mr-2" />
          View Full Booking
        </Button>
        <Button variant="secondary" onClick={() => printReceipt(booking)}>
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
        <Button onClick={onNewBooking}>
          <Plus className="h-4 w-4 mr-2" />
          Book Another
        </Button>
      </div>
    </div>
  );
}
