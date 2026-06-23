/**
 * @file AgentSignup page
 * @module routes/auth/AgentSignup
 * @description Agent registration page. Uses POST /auth/agent/register to create
 *   a User with role 'agent' and an Agent document with status 'active'.
 *   After signup, the agent is redirected to the 6-step onboarding carousel
 *   if requiresOnboarding is true.
 */

// Router navigation
import { Link } from 'react-router-dom';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Custom hooks
import { useAgentSignup } from '@/hooks/auth/useAgentSignup';

// Validation rules and form value types
import { validationRules, type SignupFormValues } from '@/lib/validationRules';

// Route constants
import { ROUTES } from '@/constants/routes';

// Icons
import { UserCheck } from 'lucide-react';

// Google OAuth signup button
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

/**
 * AgentSignup (page component)
 * @description Agent registration page. After successful signup via POST /auth/register,
 *   the user is redirected to /agent/onboard to complete their agent application.
 */
export default function AgentSignup() {
  const { mutate, isPending } = useAgentSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const handleSignup = (values: SignupFormValues) => {
    mutate({ name: values.name, email: values.email, phone: values.phone, password: values.password });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Become a TripTatkal Agent</h2>
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          Agent
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Join as a railway booking agent. Register now, then complete your application with
        business details and KYC documents.
      </p>

      <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-4">
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
          {isPending ? 'Creating account…' : 'Register as Agent'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
      </div>
      <GoogleAuthButton redirectTo={ROUTES.agent.root} role="agent" />

      <p className="text-center text-sm text-muted-foreground">
        Already an agent?{' '}
        <Link to={ROUTES.agentLogin} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
