/**
 * @file useFamilyMembers.ts
 * @description Hooks for family member CRUD operations (add, update, delete).
 * @module hooks/profile
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import { queryKeys } from '@/lib/queryKeys';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/auth.slice';

import type { AddFamilyMemberDto, UpdateFamilyMemberDto } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';
import type { User } from '@/types/auth.types';

/**
 * useAddFamilyMember
 * @description Mutation to add a new family member to the user's account.
 *   Syncs the full updated user into Redux so the Settings page reflects
 *   the change immediately and survives page navigation.
 */
export function useAddFamilyMember() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (dto: AddFamilyMemberDto) => {
      const res = await authService.addFamilyMember(dto);
      return res.data as ApiResponse<User>;
    },
    onSuccess: (data) => {
      dispatch(updateUser(data.data));
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

/**
 * useUpdateFamilyMember
 * @description Mutation to update an existing family member's details.
 *   Syncs the full updated user into Redux so the change survives navigation.
 */
export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateFamilyMemberDto }) => {
      const res = await authService.updateFamilyMember(id, dto);
      return res.data as ApiResponse<User>;
    },
    onSuccess: (data) => {
      dispatch(updateUser(data.data));
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

/**
 * useDeleteFamilyMember
 * @description Mutation to remove a family member from the user's account.
 *   Syncs the full updated user into Redux so the change survives navigation.
 */
export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authService.deleteFamilyMember(id);
      return res.data as ApiResponse<User>;
    },
    onSuccess: (data) => {
      dispatch(updateUser(data.data));
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
