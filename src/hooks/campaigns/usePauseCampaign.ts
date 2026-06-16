import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { campaignsService } from '@/services/campaigns.service';

export function usePauseCampaign(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => campaignsService.pause(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      toast.success('Campaign paused.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
