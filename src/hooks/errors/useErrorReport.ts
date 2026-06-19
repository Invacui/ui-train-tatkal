/**
 * @file useErrorReport.ts
 * @description React Query mutation hook for reporting client-side errors to the backend
 * @module hooks/errors/useErrorReport
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Error report API service
import { errorReportService } from '@/services/errorReport.service';

// Error report payload type
import type { ErrorReportPayload } from '@/types/error.types';

/**
 * useErrorReport
 * @description Provides a mutation to report a client-side error to the backend.
 *   Shows a success toast on completion or an error toast if the report fails.
 * @returns A React Query mutation object for triggering the error report.
 */
export function useErrorReport() {
  return useMutation({
    mutationFn: (payload: ErrorReportPayload) => errorReportService.report(payload),
    onSuccess: () => {
      toast.success('Error reported successfully. Our team will look into it.');
    },
    onError: () => {
      toast.error('Failed to submit error report. Please try again later.');
    },
  });
}
