/**
 * @file AdminLogin page
 * @module routes/auth/AdminLogin
 * @description Admin-specific login page with admin-branded UI.
 *   Uses the same useLogin hook — role-based redirect sends admins to /admin.
 *   No signup link since admins are hardcoded in the database.
 */

// Link for navigation
import { Link } from 'react-router-dom';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Custom hook for login mutation
import { useLogin } from '@/hooks/auth/useLogin';

// Validation rules and form value types
import { validationRules, type LoginFormValues } from '@/lib/validationRules';

// Route constants
import { ROUTES } from '@/constants/routes';

// Icons
import { Shield } from 'lucide-react';

/**
 * AdminLogin (page component)
 * @description Admin-branded login page with "Admin Portal" heading.
 *   Uses the same useLogin hook which already handles role-based redirect.
 *   No registration link — admin accounts are created directly in the database.
 */
export default function AdminLogin() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl font-semibold">Admin Portal</h2>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-200">
          Admin
        </span>
      </div>

      <form onSubmit={handleSubmit((v) => mutate(v))} className="flex flex-col gap-4">
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-xs text-muted-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            {...register('password', validationRules.password)}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link to={ROUTES.home} className="text-xs hover:underline">
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
