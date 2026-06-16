import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { templatesService } from '@/services/templates.service';
import type { LaunchDto } from '@/types/templates.types';

export function useLaunchTemplate(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: LaunchDto) => templatesService.launch(id, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.campaigns.list() });
      toast.success('Campaign launched!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
