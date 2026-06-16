import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { Skeleton } from '@/components/ui/skeleton';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const { mutate } = useMutation({
    mutationFn: () => authService.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified!');
      navigate(ROUTES.login);
    },
    onError: () => {
      toast.error('Verification failed. The link may have expired.');
      navigate(ROUTES.login);
    },
  });

  useEffect(() => {
    if (token) mutate();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Skeleton className="h-6 w-48" />
      <p className="text-sm text-muted-foreground">Verifying your email…</p>
    </div>
  );
}
