import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => authService.resetPassword({ token, password }),
    onSuccess: () => {
      toast.success('Password reset. Please log in.');
      navigate(ROUTES.login);
    },
    onError: () => toast.error('Reset failed. The link may have expired.'),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Reset password</h2>
        <p className="text-sm text-muted-foreground">Enter your new password below.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">New password</label>
        <Input
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm password</label>
        <Input
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      <Button
        onClick={() => mutate()}
        disabled={!password || password !== confirm || isPending}
        className="w-full"
      >
        {isPending ? 'Resetting…' : 'Reset password'}
      </Button>
    </div>
  );
}
