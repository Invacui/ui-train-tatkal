import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { authService } from '@/services/auth.service';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authService.me,
    select: (res) => res.data,
  });
}
