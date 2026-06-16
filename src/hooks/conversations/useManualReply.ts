import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { conversationsService } from '@/services/conversations.service';
import type { ManualReplyDto } from '@/types/conversations.types';

export function useManualReply(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: ManualReplyDto) => conversationsService.reply(id, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      toast.success('Reply sent.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
