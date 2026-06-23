/**
 * @file SignupVerify page
 * @module routes/auth/SignupVerify
 * @description Email verification prompt shown after email/password signup.
 *   Tells the user to check their email for a verification link.
 *   Provides a resend button, a RefreshCw re-check button, and a
 *   "Continue" button to proceed once verified.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Router navigation
import { useNavigate } from 'react-router-dom';

// Redux hooks
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthenticated } from '@/store/auth.slice';

// UI components
import { Button } from '@/components/ui/button';

// Custom hooks
import { useSendEmailVerification } from '@/hooks/auth/useSendEmailVerification';
import { useMe } from '@/hooks/auth/useMe';

// Route constants
import { ROUTES } from '@/constants/routes';

// Toast notifications
import { toast } from 'sonner';

// Icons
import { Mail, RefreshCw, ArrowRight, Loader2 } from 'lucide-react';

/**
 * SignupVerify (page component)
 * @description Renders the email verification prompt. Shows the user's
 *   email and offers a resend button plus a "Continue" button that
 *   checks if the email is verified before proceeding.
 *   Uses RefreshCw icon for the re-check status button.
 *   Explains the OTP-less flow: open email, click verify link.
 */
export default function SignupVerify() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { mutate: sendVerification, isPending: isSending } = useSendEmailVerification();
  const { refetch: checkMe, isFetching: isChecking } = useMe();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate(ROUTES.login, { replace: true });
    return null;
  }

  const handleContinue = async () => {
    try {
      const result = await checkMe();
      const updatedUser = result.data?.data;
      if (updatedUser?.emailVerified) {
        toast.success('Email verified!');
        navigate(ROUTES.onboardingAddress);
      } else {
        toast.error('Please verify your email before continuing');
      }
    } catch {
      toast.error('Could not verify your email status');
    }
  };

  const handleResend = () => {
    sendVerification(
      { email: user?.email },
      {
        onSuccess: () => toast.success('Verification email sent! Check your inbox.'),
      },
    );
  };

  const handleRefreshStatus = async () => {
    try {
      const result = await checkMe();
      const updatedUser = result.data?.data;
      if (updatedUser?.emailVerified) {
        toast.success('Email verified!');
        navigate(ROUTES.onboardingAddress);
      } else {
        toast.info('Email not verified yet. Check your inbox and click the verification link.');
      }
    } catch {
      toast.error('Could not check verification status');
    }
  };

  return (
    <>
      <Helmet><title>Verify Email - TripTatkal</title></Helmet>
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Verify Your Email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a verification email to{' '}
            <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>

        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200 max-w-sm">
          <p className="font-medium mb-1">🔑 No OTP needed</p>
          <p>
            Just open your email and click the <strong>Verify Email Address</strong> button we sent you.
            Once verified, come back and click Continue.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isSending}
            className="w-full"
          >
            {isSending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
            ) : (
              'Resend Verification Email'
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRefreshStatus}
              disabled={isChecking}
              className="flex-1"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking…' : 'Check Status'}
            </Button>

            <Button onClick={handleContinue} disabled={isChecking} className="flex-1">
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><span>Continue</span><ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Didn&apos;t get the email? Check your spam folder or click <strong>Resend</strong> above.
        </p>
      </div>
    </>
  );
}
