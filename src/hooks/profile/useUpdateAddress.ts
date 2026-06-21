/**
 * @file useUpdateAddress.ts
 * @description Hook for updating the authenticated user's address with geolocation.
 * @module hooks/profile
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/auth.slice';
import { queryKeys } from '@/lib/queryKeys';

import type { UserAddress, User } from '@/types/auth.types';

/**
 * useUpdateAddress
 * @description Mutation to update the user's address. On success, updates the
 *   Redux auth store and invalidates the me query cache.
 * @returns React Query mutation accepting a UserAddress.
 */
export function useUpdateAddress() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: UserAddress) => {
      const res = await authService.updateAddress(address);
      return res.data.data;
    },
    onSuccess: (updatedUser: User) => {
      dispatch(updateUser(updatedUser));
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
