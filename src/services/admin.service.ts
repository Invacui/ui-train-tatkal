import { api } from '@/lib/axios';
import type { AdminUser, PlatformStats, AdjustTokensDto, SuspendUserDto } from '@/types/admin.types';
import type { ApiResponse } from '@/types/api.types';

export const adminService = {
  listUsers: () => api.get<ApiResponse<AdminUser[]>>('/admin/users'),
  getUser: (id: string) => api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  adjustTokens: (id: string, dto: AdjustTokensDto) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/tokens`, dto),
  suspendUser: (id: string, dto: SuspendUserDto) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/suspend`, dto),
  activateUser: (id: string) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/activate`),
  getStats: () => api.get<ApiResponse<PlatformStats>>('/admin/stats'),
  listLeadRequests: () => api.get('/admin/lead-requests'),
  listCampaigns: () => api.get('/admin/campaigns'),
};
