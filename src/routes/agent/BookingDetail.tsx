/**
 * @file Agent booking detail page
 * @module routes/agent/BookingDetail
 * @description Shows full details of a booking assigned to the agent. Allows
 *   the agent to submit PNR numbers and upload ticket photos at appropriate
 *   booking status stages.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract bookingId, navigation for back button
import { useParams, useNavigate } from 'react-router-dom';

// ArrowLeft icon for back button
import { ArrowLeft } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// UI input component
import { Input } from '@/components/ui/input';

// Custom hook for fetching a single agent booking
import { useAgentBooking } from '@/hooks/agents/useAgentBooking';

// Custom hook for submitting PNR for a booking
import { useSubmitPNR } from '@/hooks/agents/useSubmitPNR';

// Custom hook for uploading ticket photo
import { useUploadTicket } from '@/hooks/agents/useUploadTicket';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Status badge for booking state display
import { StatusBadge } from '@/components/common/StatusBadge';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utility for currency display
import { formatCurrency } from '@/lib/utils';

// React Hook Form for PNR and ticket upload forms
import { useForm } from 'react-hook-form';

// Toast notification for success feedback
import { toast } from 'sonner';

/**
 * AgentBookingDetail (page component)
 * @description Fetches an agent's booking by bookingId param. Displays route
 *   info and provides conditional forms: submit PNR when status is
 *   at_counter/booking_in_progress; upload ticket photo when status is
 *   pnr_submitted.
 */
export default function AgentBookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, error } = useAgentBooking(bookingId || '');
  const { mutate: submitPNR, isPending: isPnrSubmitting } = useSubmitPNR();
  const { mutate: uploadTicket } = useUploadTicket();

  const { register: regPnr, handleSubmit: submitPnr, reset: resetPnr } = useForm();
  const { register: regTicket, handleSubmit: submitTicket } = useForm();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full rounded-lg" /></div>;
  if (error || !booking) return <ErrorState message="Booking not found" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{booking.trainName}</h1>
            <p className="text-sm text-muted-foreground">Booking #{booking.bookingId}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <Card>
          <CardContent className="grid grid-cols-2 gap-4 p-4 text-sm">
            <div><span className="text-muted-foreground">Route:</span> {booking.sourceStationCode} → {booking.destinationStationCode}</div>
            <div><span className="text-muted-foreground">Date:</span> {booking.journeyDate}</div>
            <div><span className="text-muted-foreground">Passengers:</span> {booking.passengers?.length || 0}</div>
            {booking.pricing && <div><span className="text-muted-foreground">Amount:</span> {formatCurrency(booking.pricing.totalAmount)}</div>}
          </CardContent>
        </Card>

        {['at_counter', 'booking_in_progress'].includes(booking.status) && (
          <Card>
            <CardHeader><CardTitle>Submit PNR</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitPnr((v) => submitPNR({ bookingId: bookingId!, pnr: v.pnr }, {
                onSuccess: () => resetPnr(),
              }))} className="flex items-end gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">PNR Number</label>
                  <Input placeholder="10-digit PNR" {...regPnr('pnr', { required: true })} maxLength={10} />
                </div>
                <Button type="submit" disabled={isPnrSubmitting}>Submit</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {booking.status === 'pnr_submitted' && (
          <Card>
            <CardHeader><CardTitle>Upload Ticket Photo</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitTicket((v) => uploadTicket({ bookingId: bookingId!, ticketPhotoUrl: v.ticketPhotoUrl }, {
                onSuccess: () => toast.success('Ticket uploaded'),
              }))} className="flex items-end gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Ticket Photo URL</label>
                  <Input placeholder="https://..." {...regTicket('ticketPhotoUrl', { required: true })} />
                </div>
                <Button type="submit">Upload</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
