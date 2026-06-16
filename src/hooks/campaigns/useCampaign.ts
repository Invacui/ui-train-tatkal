import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { campaignsService } from '@/services/campaigns.service';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/api.types';
import type { Campaign } from '@/types/campaigns.types';

export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignsService.get(id),
    select: (res) => res.data.data,
    enabled: !!id,
    refetchInterval: (query) => {
      const raw = query.state.data as AxiosResponse<ApiResponse<Campaign>> | undefined;
      return raw?.data?.data?.status === 'RUNNING' ? 10_000 : (false as const);
    },
  });
}
