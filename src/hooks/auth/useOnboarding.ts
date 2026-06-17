/**
 * @file useOnboarding.ts
 * @description React Query mutation hook for completing the new user onboarding flow, dispatching the onboarding completion state to Redux.
 * @module hooks/auth/useOnboarding
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions for onboarding
import { setOnboardingCompleted } from '@/store/auth.slice';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Onboarding DTO type
import type { OnboardingDto } from '@/types/auth.types';

/**
 * useOnboarding
 * @description Completes the onboarding process for a new user by submitting their onboarding data. On success, dispatches the onboarding-completed action to Redux, which typically updates the UI to show the main application.
 * @returns A React Query mutation object for triggering the onboarding mutation.
 */
export function useOnboarding() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (dto: OnboardingDto) => authService.onboarding(dto),
    onSuccess: () => {
      dispatch(setOnboardingCompleted());
    },
  });
}
