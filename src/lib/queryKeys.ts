export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  leads: {
    list: () => ['leads', 'list'] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
    items: (id: string) => ['leads', 'detail', id, 'items'] as const,
  },
  templates: {
    list: () => ['templates', 'list'] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
  campaigns: {
    list: () => ['campaigns', 'list'] as const,
    detail: (id: string) => ['campaigns', 'detail', id] as const,
    logs: (id: string) => ['campaigns', 'detail', id, 'logs'] as const,
    hot: (id: string) => ['campaigns', 'detail', id, 'hot'] as const,
  },
  conversations: {
    list: () => ['conversations', 'list'] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
  },
  admin: {
    users: () => ['admin', 'users'] as const,
    user: (id: string) => ['admin', 'users', id] as const,
    stats: () => ['admin', 'stats'] as const,
  },
} as const;
