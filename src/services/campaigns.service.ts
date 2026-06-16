import { api } from '@/lib/axios';
import type { Campaign, CampaignLog, HotLead } from '@/types/campaigns.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const campaignsService = {
  list: () => api.get<ApiResponse<Campaign[]>>('/campaigns'),
  get: (id: string) => api.get<ApiResponse<Campaign>>(`/campaigns/${id}`),
  logs: (id: string, page = 1) =>
    api.get<PaginatedResponse<CampaignLog>>(`/campaigns/${id}/logs`, { params: { page } }),
  hotLeads: (id: string) => api.get<ApiResponse<HotLead[]>>(`/campaigns/${id}/hot-leads`),
  pause: (id: string) => api.patch<ApiResponse<Campaign>>(`/campaigns/${id}/pause`),
  resume: (id: string) => api.patch<ApiResponse<Campaign>>(`/campaigns/${id}/resume`),
};
