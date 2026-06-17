/**
 * @file API response types
 * @description Generic types for API responses, pagination, and error handling
 * @module types
 */

// Generic wrapper for all API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Paginated API response with metadata
export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Query parameters for paginated requests
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Error response shape from the API
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: string[];
}
