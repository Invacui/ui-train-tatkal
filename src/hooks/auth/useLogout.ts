/**
 * @file useLogout.ts
 * @description React Query mutation hook for logging out the user, clearing Redux auth state and React Query cache, and navigating to the login page.
 * @module hooks/auth/useLogout
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// React Router navigation hook
import { useNavigate } from 'react-router-dom';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions
import { clearAuth } from '@/store/auth.slice';

// Route constants
import { ROUTES } from '@/constants/routes';

/**
 * useLogout
 * @description Logs out the current user by calling the logout API. On settle (success or failure), clears the Redux auth state and the entire React Query cache, then navigates to the login page. This ensures no stale user data persists after logout.
 * @returns A React Query mutation object for triggering the logout mutation.
 */
export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      dispatch(clearAuth());
      qc.clear();
      navigate(ROUTES.login);
    },
  });
}
