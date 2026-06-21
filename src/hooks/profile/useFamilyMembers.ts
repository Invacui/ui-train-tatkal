/**
 * @file useFamilyMembers.ts
 * @description Hooks for family member CRUD operations (add, update, delete).
 * @module hooks/profile
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import { queryKeys } from '@/lib/queryKeys';

import type { AddFamilyMemberDto, UpdateFamilyMemberDto } from '@/types/auth.types';

/**
 * useAddFamilyMember
 * @description Mutation to add a new family member to the user's account.
 *   Invalidates the auth.me cache on success.
 */
export function useAddFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddFamilyMemberDto) => {
      const res = await authService.addFamilyMember(dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

/**
 * useUpdateFamilyMember
 * @description Mutation to update an existing family member's details.
 *   Invalidates the auth.me cache on success.
 */
export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateFamilyMemberDto }) => {
      const res = await authService.updateFamilyMember(id, dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

/**
 * useDeleteFamilyMember
 * @description Mutation to remove a family member from the user's account.
 *   Invalidates the auth.me cache on success.
 */
export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authService.deleteFamilyMember(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
