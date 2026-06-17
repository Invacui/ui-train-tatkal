/**
 * @file Forgot password page
 * @module routes/auth/ForgotPassword
 * @description Allows users to request a password reset OTP via their email.
 *   Shows a success state after the email is sent.
 */

// React state for managing the "email sent" confirmation screen
import { useState } from 'react';

// Link for navigation back to login
import { Link } from 'react-router-dom';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Custom hook for forgot-password mutation
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

// Validation rules and form value types
import { validationRules, type ForgotPasswordFormValues } from '@/lib/validationRules';

// Route constants for navigation links
import { ROUTES } from '@/constants/routes';

/**
 * ForgotPassword (page component)
 * @description Renders the forgot-password form. On successful OTP submission,
 *   switches to a confirmation view instructing the user to check their email.
 */
export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { mutate, isPending } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>();

  const onSubmit = (values: ForgotPasswordFormValues) => {
    mutate(values, { onSuccess: () => setSent(true) });
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, we&apos;ve sent an OTP to reset your password.
        </p>
        <Button variant="outline" asChild>
          <Link to={ROUTES.login}>Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Forgot password</h2>
        <p className="text-sm text-muted-foreground">We&apos;ll send you an OTP to reset it</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="you@example.com" {...register('email', validationRules.email)} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Sending…' : 'Send OTP'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link to={ROUTES.login} className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
