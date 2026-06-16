import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { campaignsService } from '@/services/campaigns.service';

export function useCampaignLogs(id: string, page = 1) {
  return useQuery({
    queryKey: [...queryKeys.campaigns.logs(id), page],
    queryFn: () => campaignsService.logs(id, page),
    select: (res) => res.data,
    enabled: !!id,
  });
}
