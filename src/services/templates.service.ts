import { api } from '@/lib/axios';
import type { Template, CreateTemplateDto, UpdateTemplateDto, LaunchDto, TemplatePreview } from '@/types/templates.types';
import type { ApiResponse } from '@/types/api.types';

export const templatesService = {
  list: () => api.get<ApiResponse<Template[]>>('/templates'),
  get: (id: string) => api.get<ApiResponse<Template>>(`/templates/${id}`),
  create: (dto: CreateTemplateDto) => api.post<ApiResponse<Template>>('/templates', dto),
  update: (id: string, dto: UpdateTemplateDto) =>
    api.patch<ApiResponse<Template>>(`/templates/${id}`, dto),
  remove: (id: string) => api.delete(`/templates/${id}`),
  preview: (id: string) => api.post<ApiResponse<TemplatePreview>>(`/templates/${id}/preview`),
  launch: (id: string, dto: LaunchDto) =>
    api.post<ApiResponse<{ campaignId: string }>>(`/templates/${id}/launch`, dto),
};
