import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { templatesService } from '@/services/templates.service';

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.list(),
    queryFn: templatesService.list,
    select: (res) => res.data.data,
  });
}
