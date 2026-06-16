import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { leadsService } from '@/services/leads.service';

export function useUploadLead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: FormData) => leadsService.upload(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.leads.list() });
      toast.success('Upload started — processing your leads.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
