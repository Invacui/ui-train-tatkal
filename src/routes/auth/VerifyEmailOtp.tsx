import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';

type FormValues = { otp: string };

export default function VerifyEmailOtp() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async ({ otp }: FormValues) => {
    try {
      setLoading(true);
      await authService.verifyEmailOtp({ email, otp });
      toast.success('Email verified');
      navigate(ROUTES.selectPlan);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Verify email with OTP</h2>
        <p className="text-sm text-muted-foreground">{email || 'Enter the OTP sent to your email'}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">6 digit OTP</label>
          <Input placeholder="123456" {...register('otp', { required: 'OTP is required', minLength: 6, maxLength: 6 })} />
          {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
      </form>
    </div>
  );
}
