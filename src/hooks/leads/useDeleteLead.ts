import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { leadsService } from '@/services/leads.service';

export function useDeleteLead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.leads.list() });
      toast.success('Lead list deleted.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
