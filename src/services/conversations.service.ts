import { api } from '@/lib/axios';
import type { Conversation, ManualReplyDto } from '@/types/conversations.types';
import type { ApiResponse } from '@/types/api.types';

export const conversationsService = {
  list: (status?: string) =>
    api.get<ApiResponse<Conversation[]>>('/conversations', {
      params: status ? { status } : undefined,
    }),
  get: (id: string) => api.get<ApiResponse<Conversation>>(`/conversations/${id}`),
  reply: (id: string, dto: ManualReplyDto) =>
    api.post<ApiResponse<Conversation>>(`/conversations/${id}/reply`, dto),
};
