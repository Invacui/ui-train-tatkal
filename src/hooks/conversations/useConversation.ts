import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { conversationsService } from '@/services/conversations.service';

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(id),
    queryFn: () => conversationsService.get(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
