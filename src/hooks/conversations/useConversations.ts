import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { conversationsService } from '@/services/conversations.service';

export function useConversations(status?: string) {
  return useQuery({
    queryKey: [...queryKeys.conversations.list(), status],
    queryFn: () => conversationsService.list(status),
    select: (res) => res.data.data,
  });
}
