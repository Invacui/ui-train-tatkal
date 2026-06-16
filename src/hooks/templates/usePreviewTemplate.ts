import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { templatesService } from '@/services/templates.service';

export function usePreviewTemplate(id: string) {
  return useMutation({
    mutationFn: () => templatesService.preview(id),
    onError: (err: Error) => toast.error(err.message),
  });
}
