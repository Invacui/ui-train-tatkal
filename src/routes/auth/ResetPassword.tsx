/**
 * @file Reset password page
 * @module routes/auth/ResetPassword
 * @description Allows users to set a new password using an OTP sent to their
 *   email. The email is passed via query parameter.
 */

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// URL search params to extract the email query parameter
import { useSearchParams } from 'react-router-dom';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Custom hook for reset-password mutation
import { useResetPassword } from '@/hooks/auth/useResetPassword';

// Validation rules and form value types
import { validationRules, type ResetPasswordFormValues } from '@/lib/validationRules';

/**
 * ResetPassword (page component)
 * @description Renders the password reset form requiring OTP, new password,
 *   and confirm password. Reads the user's email from the URL query params.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { mutate, isPending } = useResetPassword();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Reset password</h2>
        <p className="text-sm text-muted-foreground">Enter the OTP sent to your email</p>
      </div>

      <form
        onSubmit={handleSubmit((v) => mutate({ email, otp: v.otp || '', newPassword: v.password }))}
        className="flex flex-col gap-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">OTP</label>
          <Input placeholder="6-digit OTP" {...register('otp', validationRules.default)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">New password</label>
          <Input type="password" {...register('password', validationRules.password)} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm password</label>
          <Input type="password" {...register('confirmPassword', validationRules.confirmPassword(watch))} />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    </div>
  );
}
