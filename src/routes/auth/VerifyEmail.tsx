/**
 * @file Email verification page
 * @module routes/auth/VerifyEmail
 * @description Handles email verification by reading the token and userId
 *   from query parameters and triggering verification on mount.
 */

// Effect hook for triggering verification on component mount
import { useEffect } from 'react';

// URL search params to extract the token and userId query parameters
import { useSearchParams, useNavigate } from 'react-router-dom';

// Custom hook for email verification mutation
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail';

// Route constants for navigation after success
import { ROUTES } from '@/constants/routes';

// Skeleton placeholder while verifying
import { Skeleton } from '@/components/ui/skeleton';

/**
 * VerifyEmail (page component)
 * @description Reads token and userId from query params and verifies the email
 *   on mount. Shows a skeleton loader while the verification request is in
 *   flight and navigates to the login page on success.
 */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const userId = searchParams.get('userId') || '';
  const { mutate } = useVerifyEmail();

  useEffect(() => {
    if (token && userId) {
      mutate({ token, userId }, {
        onSuccess: () => {
          setTimeout(() => navigate(ROUTES.login), 2000);
        },
      });
    }
  }, [token, userId, mutate, navigate]);

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <h2 className="text-xl font-semibold">Verifying your email</h2>
      <p className="text-sm text-muted-foreground">Please wait while we verify your email address…</p>
    </div>
  );
}
