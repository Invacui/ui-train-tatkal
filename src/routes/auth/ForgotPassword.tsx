import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authService.forgotPassword({ email }),
    onSuccess: () => setSent(true),
    onError: () => toast.error('Something went wrong. Please try again.'),
  });

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link to={ROUTES.login} className="text-sm text-primary hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Forgot password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button onClick={() => mutate()} disabled={!email || isPending} className="w-full">
        {isPending ? 'Sending…' : 'Send reset link'}
      </Button>

      <Link to={ROUTES.login} className="text-center text-sm text-muted-foreground hover:underline">
        Back to login
      </Link>
    </div>
  );
}
