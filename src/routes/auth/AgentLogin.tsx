/**
 * @file AgentLogin page
 * @module routes/auth/AgentLogin
 * @description Agent-specific login page with agent-branded UI.
 *   Uses the same useLogin hook — role-based redirect sends agents to /agent.
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
import { UserCheck } from 'lucide-react';

/**
 * AgentLogin (page component)
 * @description Agent-branded login page with "Agent Portal" heading.
 *   Uses the same useLogin hook which already handles role-based redirect.
 */
export default function AgentLogin() {
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
          <UserCheck className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Agent Portal</h2>
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          Agent
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

      <div className="space-y-3 text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an agent account?{' '}
          <Link to={ROUTES.agentSignup} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Register as Agent
          </Link>
        </p>
        <p>
          <Link to={ROUTES.login} className="text-xs hover:underline">
            Customer Login →
          </Link>
        </p>
      </div>
    </div>
  );
}
