import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { leadsService } from '@/services/leads.service';

export function useLeadRequests() {
  return useQuery({
    queryKey: queryKeys.leads.list(),
    queryFn: leadsService.list,
    select: (res) => res.data.data,
  });
}
