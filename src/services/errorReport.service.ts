/**
 * @file Error report service
 * @description API service for reporting client-side errors to the backend
 * @module services/errorReport
 */

// Axios instance with auth interceptors
import { api } from '@/lib/axios';

// Error report payload and response types
import type { ErrorReportPayload, ErrorReportResponse } from '@/types/error.types';

/**
 * errorReportService
 * @description Provides methods to report client-side errors to the backend for debugging and tracking.
 */
export const errorReportService = {
  /**
   * Submit an error report
   * @param payload - The error details to report
   * @returns API response with report confirmation
   */
  report: (payload: ErrorReportPayload) =>
    api.post<ErrorReportResponse>('/errors/report', payload),
};
