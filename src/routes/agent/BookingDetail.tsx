/**
 * @file Agent booking detail page
 * @module routes/agent/BookingDetail
 * @description Shows full details of a booking assigned to the agent. Provides
 *   a strict two-step form: first upload the ticket photo (at_counter), then
 *   submit the PNR number (booking_in_progress). After PNR submission the
 *   booking transitions to pnr_submitted and a congratulations dialog appears
 *   with the verified PNR details. Once both steps are complete, the submitted
 *   ticket photo and PNR are displayed for reference.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract bookingId, navigation for back button
import { useParams, useNavigate } from 'react-router-dom';

// Redux hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectAgent, setAgent } from '@/store/auth.slice';

// Email verification guard
import { EmailVerificationPrompt } from '@/components/auth/EmailVerificationPrompt';

// React hooks
import { useState, useCallback } from 'react';

// Agents service for fetching profile
import { agentsService } from '@/services/agents.service';

// Icons
import { ArrowLeft, Upload, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

// Tabs component for file/URL toggle
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// File dropzone for uploading ticket photos
import { FileDropzone } from '@/components/common/FileDropzone';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dialog for congratulations popup
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// UI input component
import { Input } from '@/components/ui/input';

// Custom hook for fetching a single agent booking
import { useAgentBooking } from '@/hooks/agents/useAgentBooking';

// Custom hook for submitting PNR for a booking
import { useSubmitPNR } from '@/hooks/agents/useSubmitPNR';

// Custom hook for uploading ticket photo (URL-based)
import { useUploadTicket } from '@/hooks/agents/useUploadTicket';

// Custom hook for uploading ticket photo (multipart, transitions status)
import { useUploadTicketFile } from '@/hooks/agents/useUploadTicketFile';

// Custom hook for PNR status verification
import { usePnrStatus } from '@/hooks/pnr/usePnrStatus';

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

// PNR input component with auto-formatting
import { PnrInputForm } from '@/components/pnr/PnrInputForm';

// Full PNR status card for the congratulations dialog
import { PnrStatusCard } from '@/components/pnr/PnrStatusCard';

/**
 * AgentBookingDetail (page component)
 * @description Fetches an agent's booking by bookingId param. Displays route
 *   info and a strict two-step submission flow:
 *   1) Ticket photo upload (status at_counter)
 *   2) PNR number submission (status booking_in_progress)
 *   After PNR is submitted and verified, a congratulations dialog is shown.
 *   Once both steps are complete (status pnr_submitted+), the submitted data
 *   is displayed for reference.
 */
export default function AgentBookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const agent = useAppSelector(selectAgent);
  const dispatch = useAppDispatch();
  const { data: booking, isLoading, error } = useAgentBooking(bookingId || '');
  const { mutate: submitPNR, isPending: isPnrSubmitting } = useSubmitPNR();
  const { mutate: uploadTicket, isPending: isTicketUploading } = useUploadTicket();
  const { mutate: uploadTicketFile, isPending: isTicketFileUploading } = useUploadTicketFile();

  // Use agent-profile emailVerified if available, fall back to user's
  const emailVerified = agent?.emailVerified ?? user?.emailVerified;

  const checkAgentEmailVerification = useCallback(async () => {
    const res = await agentsService.getProfile();
    const profile = res.data.data;
    dispatch(setAgent(profile));
    return { emailVerified: profile.emailVerified };
  }, [dispatch]);

  const { register: regPnr, handleSubmit: submitPnr, reset: resetPnr } = useForm();
  const { register: regTicket, handleSubmit: submitTicket } = useForm();

  // State for file-based ticket upload
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

  // PNR verification / congratulations flow
  const [verifiedPnr, setVerifiedPnr] = useState<string | null>(null);
  const [showCongratulationDialog, setShowCongratulationDialog] = useState(false);

  // Fetch PNR status when a verified PNR is available and the dialog is open
  const pnrStatusQuery = usePnrStatus(verifiedPnr || '', !!verifiedPnr && showCongratulationDialog);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full rounded-lg" /></div>;
  if (error || !booking) return <ErrorState message="Booking not found" />;

  // Email verification guard — use agent profile as source of truth
  if (!emailVerified) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Helmet><meta name="robots" content="noindex" /></Helmet>
        <div className="flex items-start justify-center py-12">
          <EmailVerificationPrompt
            title="Verify Email to Take Action"
            description="You need to verify your email before you can submit PNR or upload tickets."
            onVerified={() => {}}
            checkStatusFn={checkAgentEmailVerification}
          />
        </div>
      </div>
    );
  }

  const handleTicketFileUpload = () => {
    if (!ticketFile) return;
    uploadTicketFile(
      { bookingId: bookingId!, file: ticketFile },
      { onSuccess: () => setTicketFile(null) },
    );
  };

  const handlePnrSubmit = (pnr: string) => {
    submitPNR(
      { bookingId: bookingId!, pnr },
      {
        onSuccess: () => {
          resetPnr();
          setVerifiedPnr(pnr);
          setShowCongratulationDialog(true);
        },
      },
    );
  };

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{booking.trainName || booking.trainNumber || 'Booking Detail'}</h1>
            <p className="text-sm text-muted-foreground">Booking #{booking.bookingId}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Journey Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><span className="text-muted-foreground">Route:</span> {booking.sourceStationCode} → {booking.destinationStationCode}</div>
            <div><span className="text-muted-foreground">Date:</span> {booking.journeyDate}</div>
            {booking.trainNumber && <div><span className="text-muted-foreground">Train:</span> {booking.trainNumber}</div>}
            {booking.travelClass && <div><span className="text-muted-foreground">Class:</span> {booking.travelClass}</div>}
            {booking.travelTime && <div><span className="text-muted-foreground">Preferred Time:</span> {booking.travelTime}</div>}
            <div><span className="text-muted-foreground">Mode:</span> {booking.bookingMode || 'N/A'}</div>
            <div><span className="text-muted-foreground">Home Delivery:</span> {booking.needHomeDelivery ? 'Yes' : 'No'}</div>
            {booking.passengers?.length > 0 && <div><span className="text-muted-foreground">Passengers:</span> {booking.passengers.length}</div>}
            {booking.pricing && <div><span className="text-muted-foreground">Total Amount:</span> <span className="font-semibold">{formatCurrency(booking.pricing.totalAmount)}</span></div>}
          </CardContent>
        </Card>

        {/* ── Passengers Section ── */}
        {booking.passengers && booking.passengers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Passengers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.passengers.map((p, i) => (
                <div key={i} className="flex flex-wrap items-start gap-x-6 gap-y-1 rounded-lg border p-3 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {p.name}</div>
                  <div><span className="text-muted-foreground">Age:</span> {p.age}</div>
                  <div><span className="text-muted-foreground">Gender:</span> {p.gender}</div>
                  {p.berthPreference && <div><span className="text-muted-foreground">Berth:</span> {p.berthPreference}</div>}
                  {p.idCardType && <div><span className="text-muted-foreground">ID:</span> {p.idCardType} {p.idCardNumber}</div>}
                  {p.status && <div><span className="text-muted-foreground">Status:</span> {p.status}</div>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ── Pricing Breakdown ── */}
        {booking.pricing && (
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {booking.pricing.baseFare > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare{booking.passengers?.length > 0 ? ` (×${booking.passengers.length})` : ''}</span>
                  <span>{formatCurrency(booking.pricing.baseFare)}</span>
                </div>
              )}
              {booking.pricing.agentFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent Service Fee</span>
                  <span>{formatCurrency(booking.pricing.agentFee)}</span>
                </div>
              )}
              {booking.pricing.platformFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>{formatCurrency(booking.pricing.platformFee)}</span>
                </div>
              )}
              {booking.pricing.convenienceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span>{formatCurrency(booking.pricing.convenienceFee)}</span>
                </div>
              )}
              {booking.pricing.gst > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST</span>
                  <span>{formatCurrency(booking.pricing.gst)}</span>
                </div>
              )}
              {booking.pricing.deliveryCharge && booking.pricing.deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home Delivery</span>
                  <span>{formatCurrency(booking.pricing.deliveryCharge)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(booking.pricing.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Agent Assignment Info ── */}
        {booking.acceptedBy && (
          <Card>
            <CardHeader>
              <CardTitle>Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Accepted By:</span> {booking.acceptedBy.name} ({booking.acceptedBy.email})</div>
              {booking.assignedAt && <div><span className="text-muted-foreground">Assigned At:</span> {new Date(booking.assignedAt).toLocaleString()}</div>}
              {booking.slaDeadline && <div><span className="text-muted-foreground">SLA Deadline:</span> {new Date(booking.slaDeadline).toLocaleString()}</div>}
              {booking.agentId && <div><span className="text-muted-foreground">Agent ID:</span> {booking.agentId}</div>}
            </CardContent>
          </Card>
        )}

        {/* ── Step 1: Ticket Photo Upload (status = agent_assigned or at_counter) ── */}
        {['agent_assigned', 'at_counter'].includes(booking.status) && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Upload Ticket Photo</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload a photo of the ticket obtained from the station counter.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'file' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Paste URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="pt-4">
                  <FileDropzone
                    onFile={(file) => setTicketFile(file)}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    file={ticketFile}
                  />
                  {ticketFile && (
                    <Button
                      className="mt-3 w-full"
                      disabled={isTicketFileUploading}
                      onClick={handleTicketFileUpload}
                    >
                      {isTicketFileUploading ? 'Uploading…' : 'Upload Ticket Photo'}
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="url" className="pt-4">
                  <form onSubmit={submitTicket((v) => uploadTicket({ bookingId: bookingId!, ticketPhotoUrl: v.ticketPhotoUrl }, {
                    onSuccess: () => toast.success('Ticket URL submitted'),
                  }))} className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Ticket Photo URL</label>
                      <Input placeholder="https://..." {...regTicket('ticketPhotoUrl', { required: true })} />
                    </div>
                    <Button type="submit" disabled={isTicketUploading}>
                      {isTicketUploading ? 'Submitting…' : 'Submit URL'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: PNR Submission (status = booking_in_progress) ── */}
        {booking.status === 'booking_in_progress' && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Submit PNR Number</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the 10-digit PNR number received after booking the ticket at the railway counter.
              </p>
            </CardHeader>
            <CardContent>
              <PnrInputForm onSubmit={handlePnrSubmit} isLoading={isPnrSubmitting} />
            </CardContent>
          </Card>
        )}

        {/* ── Submitted Data (status = pnr_submitted or beyond) ── */}
        {(booking.status === 'pnr_submitted' || booking.pnrNumber) && (
          <Card>
            <CardHeader>
              <CardTitle>Submitted Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Ticket and PNR have been submitted successfully.
              </div>
              {booking.ticketPhotoUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Ticket Photo</p>
                  <a
                    href={booking.ticketPhotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={booking.ticketPhotoUrl}
                      alt="Ticket photo"
                      className="max-h-48 rounded-lg border object-contain"
                    />
                  </a>
                </div>
              )}
              {booking.pnrNumber && (
                <div>
                  <p className="text-sm font-medium mb-1">PNR Number</p>
                  <p className="font-mono text-lg tracking-widest">{booking.pnrNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Congratulations Dialog with PNR Verification ── */}
      <Dialog
        open={showCongratulationDialog}
        onOpenChange={(open) => {
          if (!open) setShowCongratulationDialog(false);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Booking Complete!
            </DialogTitle>
            <DialogDescription>
              PNR has been submitted and verified. Here are the journey details.
            </DialogDescription>
          </DialogHeader>

          {pnrStatusQuery.isLoading ? (
            <div className="space-y-4 py-8">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <p className="text-center text-sm text-muted-foreground">Verifying PNR status…</p>
            </div>
          ) : pnrStatusQuery.data ? (
            <PnrStatusCard data={pnrStatusQuery.data} />
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              PNR submitted successfully. Status details could not be fetched at this time.
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowCongratulationDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
