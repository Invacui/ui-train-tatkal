import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { leadsService } from '@/services/leads.service';

export function useLeadRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: () => leadsService.get(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
