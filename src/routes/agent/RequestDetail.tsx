/**
 * @file Agent request detail page
 * @module routes/agent/RequestDetail
 * @description Shows full details of a booking request. This is the page
 *   reached from /agent/requests/:bookingId when an agent clicks "View Details"
 *   on a request card. Includes passenger manifest, pricing breakdown,
 *   route info, and an Accept button.
 */

// React Router hooks for route params and navigation
import { useParams, useNavigate } from 'react-router-dom';

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// React Query hook to fetch the booking detail
import { useAgentBooking } from '@/hooks/agents/useAgentBooking';
// Mutation hook for accepting a request
import { useAcceptRequest } from '@/hooks/agents/useAcceptRequest';

// UI components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/ErrorState';

// Page header
import { PageHeader } from '@/components/common/PageHeader';

// Utility for formatting currency
import { formatCurrency } from '@/lib/utils';

// Route constants
import { ROUTES } from '@/constants/routes';

// Icons
import {
  ArrowLeft,
  Train,
  MapPin,
  Clock,
  Users,
  User,
  IndianRupee,
  CheckCircle,
} from 'lucide-react';

/**
 * RequestDetail (page component)
 * @description Fetches a single booking request by :bookingId from the URL
 *   and renders a full-page view of all request details — route, travel info,
 *   passengers, pricing, status, and an Accept button.
 */
export default function RequestDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const { data: request, isLoading, error } = useAgentBooking(bookingId!);
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptRequest();

  const handleAccept = () => {
    if (!bookingId) return;
    acceptRequest(bookingId, {
      onSuccess: () => {
        navigate(ROUTES.agent.bookings, { replace: true });
      },
    });
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <>
        <Helmet><meta name="robots" content="noindex" /></Helmet>
        <div className="flex flex-col gap-6">
          <PageHeader title="Request Details" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ── Error state ──
  if (error || !request) {
    return (
      <>
        <Helmet><meta name="robots" content="noindex" /></Helmet>
        <div className="flex flex-col gap-6">
          <PageHeader title="Request Details" />
          <ErrorState message="Could not load request details" />
          <Button variant="outline" onClick={() => navigate(ROUTES.agent.requests)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        {/* ── Header with back button ── */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.agent.requests)}
              className="mb-2 -ml-2 gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Requests
            </Button>
            <PageHeader
              title={
                <span className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-primary" />
                  {request.trainName || request.trainNumber || 'Booking Request'}
                </span>
              }
              description={`${request.sourceStationCode} → ${request.destinationStationCode}${request.travelTime ? ` · ${request.travelTime}` : ''}`}
            />
          </div>
          {request.status === 'pending_agent' && (
            <Button
              size="lg"
              onClick={handleAccept}
              disabled={isAccepting}
              className="gap-2 shrink-0"
            >
              <CheckCircle className="h-5 w-5" />
              {isAccepting ? 'Accepting…' : 'Accept Request'}
            </Button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Left column: route, passengers, pricing ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Route & Travel Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Route & Travel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
                  <div>
                    <span className="text-muted-foreground">Booking Mode</span>
                    <p className="font-medium capitalize">{request.bookingMode || '—'}</p>
                  </div>
                </div>

                {(request.dateFlexibility || request.trainFlexibility || request.stationFlexibility) && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {request.dateFlexibility && <Badge variant="secondary" className="text-[10px]">Date flexible</Badge>}
                    {request.trainFlexibility && <Badge variant="secondary" className="text-[10px]">Train flexible</Badge>}
                    {request.stationFlexibility && <Badge variant="secondary" className="text-[10px]">Station flexible</Badge>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Passengers */}
            {request.passengers && request.passengers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="h-4 w-4" /> Passengers ({request.passengers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                        {p.idType && <span>ID: {p.idType} · {p.idNumber}</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            {request.pricing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <IndianRupee className="h-4 w-4" /> Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
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
                    {request.pricing.agentFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Agent Fee</span>
                        <span>{formatCurrency(request.pricing.agentFee)}</span>
                      </div>
                    )}
                    <hr className="border-border" />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>{formatCurrency(request.pricing.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Right sidebar: status & actions ── */}
          <div className="space-y-6">

            {/* Status card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4" /> Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={request.status === 'pending_agent' ? 'default' : 'secondary'}
                  className="text-sm px-3 py-1"
                >
                  {request.status.replace(/_/g, ' ')}
                </Badge>
                {request.bookingMode && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {request.bookingMode} booking
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Requested: {new Date(request.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Quick info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Passengers</span>
                  <p className="font-medium">{request.passengers?.length || 0}</p>
                </div>
                {request.needHomeDelivery && (
                  <div>
                    <span className="text-muted-foreground">Home Delivery</span>
                    <p className="font-medium">Requested</p>
                  </div>
                )}
                {request.calculatedDistance != null && (
                  <div>
                    <span className="text-muted-foreground">Distance</span>
                    <p className="font-medium">{request.calculatedDistance.toFixed(1)} km</p>
                  </div>
                )}
                {request.pricing?.totalAmount && (
                  <div>
                    <span className="text-muted-foreground">Total Amount</span>
                    <p className="font-medium">{formatCurrency(request.pricing.totalAmount)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accept action (only for pending_agent status) */}
            {request.status === 'pending_agent' && (
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAccept}
                disabled={isAccepting}
              >
                <CheckCircle className="h-5 w-5" />
                {isAccepting ? 'Accepting…' : 'Accept Request'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
