/**
 * @file Signup page
 * @module routes/auth/Signup
 * @description New user registration page with name, email, phone, and
 *   password fields along with Google OAuth.
 */

// Link for navigation to the login route
import { Link } from 'react-router-dom';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Custom hook for signup mutation
import { useSignup } from '@/hooks/auth/useSignup';

// Validation rules and form value types
import { validationRules, type SignupFormValues } from '@/lib/validationRules';

// Route constants for navigation links
import { ROUTES } from '@/constants/routes';

// Google OAuth signup button
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

/**
 * Signup (page component)
 * @description Renders the registration page with name, email, phone, password
 *   and confirm-password fields. Uses useSignup mutation hook. Also offers
 *   Google OAuth signup.
 */
export default function Signup() {
  const { mutate, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Create account</h2>
        <p className="text-sm text-muted-foreground">Start your journey with TripTatkal</p>
      </div>

      <form
        onSubmit={handleSubmit((v) => mutate({ name: v.name, email: v.email, phone: v.phone, password: v.password }))}
        className="flex flex-col gap-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="Jane Smith" {...register('name', validationRules.name)} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register('email', validationRules.email)}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            type="tel"
            placeholder="9876543210"
            {...register('phone', validationRules.phone)}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder="At least 6 characters"
            {...register('password', validationRules.password)}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm password</label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword', validationRules.confirmPassword(watch))}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
      </div>
      <GoogleAuthButton redirectTo={ROUTES.dashboard} />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
