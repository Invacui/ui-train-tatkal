/**
 * @file Booking detail page
 * @module routes/dashboard/BookingDetail
 * @description Shows full details of a specific booking including journey info,
 *   passenger list, pricing breakdown, payment info, metadata, and actions
 *   (cancel, confirm delivery).
 */

// Helmet for setting page title/meta tags
import { Helmet } from "react-helmet-async";

// Route params to extract booking ID, navigation for back button
import { useParams, useNavigate } from "react-router-dom";

// Icons
import { AlertTriangle, ArrowLeft, UserCheck, CreditCard, Info, ShieldCheck } from "lucide-react";

// UI button component
import { Button } from "@/components/ui/button";

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Badge component for booking status
import { Badge } from "@/components/ui/badge";

// Custom hook for single booking fetch
import { useBooking } from "@/hooks/bookings/useBooking";

// Custom hook for cancelling a booking
import { useCancelBooking } from "@/hooks/bookings/useCancelBooking";

// Custom hook for confirming ticket delivery
import { useConfirmDelivery } from "@/hooks/bookings/useConfirmDelivery";

// Pricing breakdown card component
import { BookingPricingCard } from "@/components/bookings/BookingPricingCard";

// Error state component for failed requests
import { ErrorState } from "@/components/common/ErrorState";

// Cancel booking dialog with reason input
import { CancelBookingDialog } from "@/components/common/CancelBookingDialog";

// Formatting utilities
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getStatusLabel,
  relativeTime,
} from "@/lib/utils";

// Skeleton placeholder during loading
import { Skeleton } from "@/components/ui/skeleton";

// React state for managing cancel confirmation dialog
import { useState } from "react";

// --- Helper sub-components ---

/**
 * DetailRow
 * @description A labelled key-value row for detail grids.
 */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  );
}

/**
 * FlexTag
 * @description A small coloured pill for boolean flexibility flags.
 */
function FlexTag({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
      }`}>
      {label}
    </span>
  );
}

/**
 * PassengerIdLabel
 * @description Converts an idType code to a human-readable label.
 */
function idTypeLabel(t: string): string {
  const map: Record<string, string> = {
    aadhaar: "Aadhaar",
    pan: "PAN",
    voter_id: "Voter ID",
    driving_license: "Driving License",
    passport: "Passport",
  };
  return map[t] ?? t;
}

/**
 * BerthLabel
 * @description Converts a berth-preference short code to a human label.
 */
function berthLabel(bp: string): string {
  const map: Record<string, string> = {
    LB: "Lower",
    MB: "Middle",
    UB: "Upper",
    SL: "Side Lower",
    SU: "Side Upper",
    lower: "Lower",
    middle: "Middle",
    upper: "Upper",
    side_lower: "Side Lower",
    side_upper: "Side Upper",
  };
  return map[bp] ?? bp;
}

/**
 * TravelTimeLabel
 * @description Converts a travel-time slug to a display string.
 */
function travelTimeLabel(t: string): string {
  const map: Record<string, string> = {
    morning: "Morning (06:00 – 12:00)",
    afternoon: "Afternoon (12:00 – 18:00)",
    evening: "Evening (18:00 – 00:00)",
    night: "Night (00:00 – 06:00)",
  };
  return map[t] ?? t;
}

// --- Page component ---

/**
 * BookingDetail (page component)
 * @description Fetches a booking by ID from route params. Displays journey
 *   details, passenger information, pricing breakdown, payment info, booking
 *   metadata, and action buttons (cancel booking, confirm delivery) based on
 *   booking status.
 */
export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const { data: booking, isLoading, error } = useBooking(id || "");
  const { mutate: cancelBookingMutate, isPending: isCancelling } = useCancelBooking();
  const { mutate: confirmDelivery, isPending: isConfirming } = useConfirmDelivery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !booking) return <ErrorState message="Booking not found" />;

  // Derived
  const hasFlexibility =
    booking.dateFlexibility ||
    booking.trainFlexibility ||
    booking.stationFlexibility ||
    booking.travelTimeFlexibility;

  const canCancel = [
    "payment_pending",
    "pending_agent",
    "agent_assigned",
    "at_counter",
    "booking_in_progress",
  ].includes(booking.status);
  const canConfirmDelivery =
    (booking.status === "confirmed" || booking.status === "delivered")
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex flex-col gap-6">
        {/* ── Back button ── */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* ── Header: title, booking ID, badges ── */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {booking.trainName || booking.trainNumber || "Train Booking"}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">#{booking.bookingId}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className="text-sm">
                {getStatusLabel(booking.status)}
              </Badge>
              {booking.bookingMode && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {booking.bookingMode} booking
                </Badge>
              )}
              {booking.paymentStatus && (
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${
                    booking.paymentStatus === "paid" ? "text-green-600 border-green-300" : ""
                  }`}>
                  {booking.paymentStatus === "paid"
                    ? "✅ Paid"
                    : `Payment: ${booking.paymentStatus}`}
                </Badge>
              )}
            </div>
          </div>

          {hasFlexibility && (
            <div className="flex flex-wrap gap-1.5">
              <FlexTag label="Date flex" active={!!booking.dateFlexibility} />
              <FlexTag label="Train flex" active={!!booking.trainFlexibility} />
              <FlexTag label="Station flex" active={!!booking.stationFlexibility} />
              <FlexTag label="Time flex" active={!!booking.travelTimeFlexibility} />
            </div>
          )}
        </div>

        {/* ── Journey Details ── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Journey Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailRow label="Route">
              {booking.sourceStationCode} → {booking.destinationStationCode}
            </DetailRow>
            <DetailRow label="Date">{formatDate(booking.journeyDate)}</DetailRow>
            <DetailRow label="Train">
              {booking.trainName
                ? `${booking.trainName} (${booking.trainNumber})`
                : booking.trainNumber || "—"}
            </DetailRow>
            <DetailRow label="Class">{booking.travelClass}</DetailRow>
            {booking.travelTime && (
              <DetailRow label="Preferred Travel Time">
                {travelTimeLabel(booking.travelTime)}
              </DetailRow>
            )}
            {booking.pnrNumber && (
              <DetailRow label="PNR">
                <span className="font-mono">{booking.pnrNumber}</span>
              </DetailRow>
            )}
            {booking.preferredClasses && booking.preferredClasses.length > 0 && (
              <DetailRow label="Preferred Classes">{booking.preferredClasses.join(", ")}</DetailRow>
            )}
            <DetailRow label="Booking Mode">
              <span className="capitalize">{booking.bookingMode || "—"}</span>
            </DetailRow>
            <DetailRow label="Home Delivery">
              {booking.needHomeDelivery ? (
                <span className="text-green-600 font-medium">Requested</span>
              ) : (
                <span className="text-muted-foreground">Not requested</span>
              )}
            </DetailRow>
          </CardContent>
        </Card>

        {/* ── Passengers ── */}
        {booking.passengers && booking.passengers.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
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
                      <DetailRow label="Berth Preference">
                        {berthLabel(p.berthPreference)}
                      </DetailRow>
                    )}
                    {p.seatNumber && <DetailRow label="Seat / Coach">{p.seatNumber}</DetailRow>}
                    {p.idCardType && (
                      <DetailRow label="ID Type">{idTypeLabel(p.idCardType)}</DetailRow>
                    )}
                    {p.idCardNumber && (
                      <DetailRow label="ID Number">
                        <span className="font-mono text-sm">{p.idCardNumber}</span>
                      </DetailRow>
                    )}
                    {p.status && <DetailRow label="Status">{p.status}</DetailRow>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ── Pricing ── */}
        {booking.pricing && <BookingPricingCard pricing={booking.pricing} />}

        {/* ── Payment Info ── */}
        {(booking.paymentId || booking.razorpayOrderId || (booking.refundAmount ?? 0) > 0) && (
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
              {booking.pricing?.totalAmount && (
                <DetailRow label="Total Charged">
                  {formatCurrency(booking.pricing.totalAmount)}
                </DetailRow>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Cancellation & Refund Info ── */}
        {(booking.status === "cancelled" ||
          booking.status === "cancelled_with_refund" ||
          booking.cancellationReason) && (
          <Card className="">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <CardTitle className="text-base text-red-700">Booking Cancelled</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {booking.cancellationReason && (
                <DetailRow label="Cancellation Reason">
                  <span className="text-red-700">{booking.cancellationReason}</span>
                </DetailRow>
              )}
              {booking.cancelledBy && (
                <DetailRow label="Cancelled By">
                  <span className="capitalize">{booking.cancelledBy}</span>
                </DetailRow>
              )}
              {booking.cancelledAt && (
                <DetailRow label="Cancelled At">
                  <span title={formatDateTime(booking.cancelledAt)}>
                    {formatDateTime(booking.cancelledAt)}
                  </span>
                </DetailRow>
              )}
              {(booking.refundAmount ?? 0) > 0 && (
                <>
                  <DetailRow label="Refund Amount">
                    <span className="text-yellow-700 font-semibold text-base">
                      {formatCurrency(booking.refundAmount ?? 0)}
                    </span>
                  </DetailRow>
                  {booking.refundType && (
                    <DetailRow label="Refund Type">
                      <span className="capitalize">{booking.refundType}</span>
                    </DetailRow>
                  )}
                  {booking.refundTriggeredAt && (
                    <DetailRow label="Refund Triggered">
                      <span title={formatDateTime(booking.refundTriggeredAt)}>
                        {formatDateTime(booking.refundTriggeredAt)}
                      </span>
                    </DetailRow>
                  )}
                </>
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
              <span title={formatDateTime(booking.createdAt)}>
                {relativeTime(booking.createdAt)}
              </span>
            </DetailRow>
            <DetailRow label="Last Updated">
              <span title={formatDateTime(booking.updatedAt)}>
                {relativeTime(booking.updatedAt)}
              </span>
            </DetailRow>
            {booking.agentId && (
              <DetailRow label="Agent ID">
                <span className="font-mono text-sm">{booking.agentId}</span>
              </DetailRow>
            )}
            {booking.calculatedDistance != null && (
              <DetailRow label="Distance from Agent">{booking.calculatedDistance} km</DetailRow>
            )}
            {booking.isBroadcasted && (
              <DetailRow label="Broadcast Status">
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

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {canConfirmDelivery && (
            <Button
              variant="outline"
              onClick={() => confirmDelivery(booking.bookingId)}
              disabled={isConfirming}>
              {isConfirming ? "Confirming…" : "Confirm Delivery"}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => setShowCancel(true)}
              disabled={isCancelling}>
              Cancel Booking
            </Button>
          )}
        </div>

        {/* ── Cancel dialog ── */}
        <CancelBookingDialog
          open={showCancel}
          onOpenChange={setShowCancel}
          onConfirm={(reason) => {
            cancelBookingMutate({
              bookingId: booking.bookingId,
              dto: { reason, cancelledBy: "customer" },
            });
            setShowCancel(false);
          }}
          isPending={isCancelling}
        />
      </div>
    </>
  );
}
