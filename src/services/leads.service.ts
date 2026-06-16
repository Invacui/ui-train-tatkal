import { api } from '@/lib/axios';
import type { LeadRequest, Lead, CreateLeadDto } from '@/types/leads.types';
import type { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api.types';

export const leadsService = {
  list: () => api.get<ApiResponse<LeadRequest[]>>('/leads'),
  get: (id: string) => api.get<ApiResponse<LeadRequest>>(`/leads/${id}`),
  getLeads: (id: string, params?: PaginationParams) =>
    api.get<PaginatedResponse<Lead>>(`/leads/${id}/leads`, { params }),
  getFile: (id: string) => api.get(`/leads/${id}/file`, { responseType: 'blob' }),
  upload: (dto: FormData) =>
    api.post<ApiResponse<LeadRequest>>('/leads/upload', dto, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  link: (dto: CreateLeadDto) => api.post<ApiResponse<LeadRequest>>('/leads/link', dto),
  remove: (id: string) => api.delete(`/leads/${id}`),
};
