import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { adminService } from '@/services/admin.service';
import type { AdjustTokensDto } from '@/types/admin.types';

export function useAdjustTokens(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: AdjustTokensDto) => adminService.adjustTokens(userId, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.user(userId) });
      void qc.invalidateQueries({ queryKey: queryKeys.admin.users() });
      toast.success('Tokens adjusted.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
