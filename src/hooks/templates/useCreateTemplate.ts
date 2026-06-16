import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { templatesService } from '@/services/templates.service';
import type { CreateTemplateDto } from '@/types/templates.types';

export function useCreateTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTemplateDto) => templatesService.create(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.templates.list() });
      toast.success('Template created.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
