import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { leadsService } from '@/services/leads.service';
import type { PaginationParams } from '@/types/api.types';

export function useLeads(id: string, params?: PaginationParams) {
  return useQuery({
    queryKey: [...queryKeys.leads.items(id), params],
    queryFn: () => leadsService.getLeads(id, params),
    select: (res) => res.data,
    enabled: !!id,
  });
}
