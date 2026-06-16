import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { adminService } from '@/services/admin.service';
import type { SuspendUserDto } from '@/types/admin.types';

export function useSuspendUser(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: SuspendUserDto) => adminService.suspendUser(userId, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.user(userId) });
      void qc.invalidateQueries({ queryKey: queryKeys.admin.users() });
      toast.success('User suspended.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
