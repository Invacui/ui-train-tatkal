import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { campaignsService } from '@/services/campaigns.service';

export function useResumeCampaign(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => campaignsService.resume(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      toast.success('Campaign resumed.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
