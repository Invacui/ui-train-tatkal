/**
 * @file Error report types
 * @description TypeScript types for client-side error reporting payloads
 * @module types
 */

/** Priority levels for error reports */
export type ErrorPriority = 'low' | 'medium' | 'high' | 'critical';

/** Payload sent to the error reporting endpoint */
export interface ErrorReportPayload {
  /** Error message text */
  message: string;
  /** Error class/type name */
  name?: string;
  /** Stack trace string */
  stack?: string;
  /** Route path where the error occurred */
  route: string;
  /** User agent string of the browser */
  userAgent: string;
  /** ISO timestamp of when the error occurred */
  timestamp: string;
  /** Severity priority */
  priority: ErrorPriority;
  /** Authenticated user's ID (if logged in) */
  userId?: string;
  /** Authenticated user's name (if logged in) */
  userName?: string;
  /** Authenticated user's email (if logged in) */
  userEmail?: string;
  /** Authenticated user's role (if logged in) */
  userRole?: string;
}

/** Standard API response for error reports */
export interface ErrorReportResponse {
  success: boolean;
  message: string;
  data?: {
    reportId: string;
  };
}
