import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { campaignsService } from '@/services/campaigns.service';

export function useHotLeads(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.hot(id),
    queryFn: () => campaignsService.hotLeads(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
