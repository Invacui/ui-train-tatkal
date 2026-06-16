import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { templatesService } from '@/services/templates.service';
import type { UpdateTemplateDto } from '@/types/templates.types';

export function useUpdateTemplate(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateTemplateDto) => templatesService.update(id, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.templates.detail(id) });
      void qc.invalidateQueries({ queryKey: queryKeys.templates.list() });
      toast.success('Template updated.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
