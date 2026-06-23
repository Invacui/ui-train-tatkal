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

// Redux hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectAgent, setAgent } from '@/store/auth.slice';

// Email verification guard
import { EmailVerificationPrompt } from '@/components/auth/EmailVerificationPrompt';

// React hooks
import { useState, useCallback } from 'react';

// Agents service for fetching profile
import { agentsService } from '@/services/agents.service';

// ArrowLeft icon for back button, file upload icons
import { ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react';

// Tabs component for file/URL toggle
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// File dropzone for uploading ticket photos
import { FileDropzone } from '@/components/common/FileDropzone';

// File upload hook
import { useFileUpload } from '@/hooks/common/useFileUpload';

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
  const user = useAppSelector(selectUser);
  const agent = useAppSelector(selectAgent);
  const dispatch = useAppDispatch();
  const { data: booking, isLoading, error } = useAgentBooking(bookingId || '');
  const { mutate: submitPNR, isPending: isPnrSubmitting } = useSubmitPNR();
  const { mutate: uploadTicket, isPending: isTicketUploading } = useUploadTicket();
  const { upload: uploadFile, isUploading: isFileUploading } = useFileUpload();

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
                      disabled={isFileUploading || isTicketUploading}
                      onClick={async () => {
                        try {
                          const url = await uploadFile(ticketFile, 'tickets');
                          uploadTicket({ bookingId: bookingId!, ticketPhotoUrl: url }, {
                            onSuccess: () => {
                              toast.success('Ticket uploaded');
                              setTicketFile(null);
                            },
                          });
                        } catch {
                          toast.error('Failed to upload file');
                        }
                      }}
                    >
                      {isFileUploading ? 'Uploading…' : 'Upload Ticket Photo'}
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="url" className="pt-4">
                  <form onSubmit={submitTicket((v) => uploadTicket({ bookingId: bookingId!, ticketPhotoUrl: v.ticketPhotoUrl }, {
                    onSuccess: () => toast.success('Ticket uploaded'),
                  }))} className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Ticket Photo URL</label>
                      <Input placeholder="https://..." {...regTicket('ticketPhotoUrl', { required: true })} />
                    </div>
                    <Button type="submit" disabled={isTicketUploading}>
                      {isTicketUploading ? 'Uploading…' : 'Upload'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
