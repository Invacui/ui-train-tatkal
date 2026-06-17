/**
 * @file Onboarding (page component)
 * @description Post-Google-signup onboarding page. Collects name and phone number
 *   from users who registered via Google OAuth. Calls POST /auth/onboarding to
 *   complete the profile and marks onboarding as complete in Redux.
 * @module routes/auth/Onboarding
 */

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// Router navigation hook
import { useNavigate } from 'react-router-dom';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Onboarding mutation hook
import { useOnboarding } from '@/hooks/auth/useOnboarding';

// Redux hooks and actions
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, updateUser, setOnboardingCompleted } from '@/store/auth.slice';

// Validation rules
import { validationRules } from '@/lib/validationRules';

// Route constants
import { ROUTES } from '@/constants/routes';

// Toast notifications
import { toast } from 'sonner';

export default function Onboarding() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutate, isPending } = useOnboarding();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (values: { name: string; phone: string }) => {
    mutate(
      { name: values.name, phone: values.phone },
      {
        onSuccess: () => {
          // Update Redux with the new name/phone and mark onboarding complete
          if (user) {
            dispatch(updateUser({ ...user, name: values.name, phone: values.phone }));
          }
          dispatch(setOnboardingCompleted());
          toast.success('Profile completed!');
          navigate(ROUTES.dashboard);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to complete profile');
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Complete Your Profile</h2>
        <p className="text-sm text-muted-foreground">
          Just a few more details to get started with TripTatkal.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            placeholder="Ravi Sharma"
            {...register('name', validationRules.name)}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            {...register('phone', validationRules.phone)}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          <p className="text-xs text-muted-foreground">
            Required for booking tickets. We&apos;ll never share your number.
          </p>
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Saving…' : 'Complete Setup'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Your name is pre-filled from your Google account. You can change it anytime.
      </p>
    </div>
  );
}
