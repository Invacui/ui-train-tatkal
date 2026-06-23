/**
 * @file EmailVerificationPrompt component
 * @module components/auth
 * @description Reusable email verification guard. Shows a centered prompt
 *   when the user's email is not verified, preventing them from proceeding
 *   until they verify. Provides resend and refresh-status buttons.
 */

// React hooks
import { useState, useCallback } from "react";

// Redux hooks
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, updateEmailVerified } from "@/store/auth.slice";

// Direct API call to /auth/me (used as fallback when no checkStatusFn provided)
import { authService } from "@/services/auth.service";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Toast notifications
import { toast } from "sonner";

// Icons
import { Mail, RefreshCw, Loader2 } from "lucide-react";
import { useSendEmailVerification } from "@/hooks/auth/useVerifyEmail";

interface EmailVerificationPromptProps {
  /** Title shown in the prompt heading */
  title?: string;
  /** Description shown below the title */
  description?: string;
  /** Called when the user's email is confirmed as verified */
  onVerified: () => void;
  /**
   * Optional async function to check verification status.
   * When provided, this is called instead of /auth/me.
   * For agents, pass a function that calls /agents/profile.
   * Should return { emailVerified: boolean }.
   */
  checkStatusFn?: () => Promise<{ emailVerified: boolean }>;
}

/**
 * EmailVerificationPrompt
 * @description Displays a full-width card prompting the user to verify their
 *   email before proceeding. Uses the Redux store's emailVerified for initial
 *   display — no automatic API calls. The "Check Status" button explicitly
 *   fetches fresh status via checkStatusFn or a direct /auth/me call.
 *   - Current email display
 *   - "No OTP needed" explanation
 *   - Resend verification email button
 *   - Check Status button (RefreshCw) to re-fetch
 *   - Once verified, calls onVerified callback
 */
export function EmailVerificationPrompt({
  title = "Email Not Verified",
  description = "Please verify your email to continue.",
  onVerified,
  checkStatusFn,
}: EmailVerificationPromptProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { mutate: sendVerification, isPending: isSending } = useSendEmailVerification();
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleResend = () => {
    sendVerification(
      { email: user?.email },
      { onSuccess: () => toast.success("Verification email sent! Check your inbox.") }
    );
  };

  const handleCheckStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      let emailVerified = false;

      if (checkStatusFn) {
        const result = await checkStatusFn();
        emailVerified = result.emailVerified;
      } else {
        const res = await authService.me();
        emailVerified = res.data.data?.emailVerified ?? false;
      }

      if (emailVerified) {
        toast.success("Email verified!");
        setIsVerified(true);
        dispatch(updateEmailVerified());
        onVerified();
      } else {
        toast.info("Not verified yet. Check your inbox and click the verification link.");
      }
    } catch {
      toast.error("Could not check verification status");
    } finally {
      setIsChecking(false);
    }
  }, [checkStatusFn, dispatch, onVerified]);

  // If already verified according to Redux, don't show the prompt
  if (user?.emailVerified) {
    return null;
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950 mb-2">
          <Mail className="h-8 w-8 text-amber-500" />
        </div>
        <CardTitle className="text-xl">{isVerified ? "Email Verified ✓" : title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Verification sent to <span className="font-medium text-foreground">{user?.email}</span>
        </p>

        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <p className="font-medium mb-1">🔑 No OTP needed</p>
          <p>
            Open your email and click the <strong>Verify Email Address</strong> button. Come back
            and click <strong>Check Status</strong> once done.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={handleResend} disabled={isSending} className="w-full">
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          <Button onClick={handleCheckStatus} disabled={isChecking} className="w-full">
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Check Status
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
