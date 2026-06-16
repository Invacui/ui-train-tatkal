import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { templatesService } from '@/services/templates.service';

export function useTemplate(id: string) {
  return useQuery({
    queryKey: queryKeys.templates.detail(id),
    queryFn: () => templatesService.get(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
