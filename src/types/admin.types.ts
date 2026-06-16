export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  tokenBalance: number;
  isActive: boolean;
  totalCampaigns: number;
  totalLeads: number;
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalCampaigns: number;
  runningCampaigns: number;
  totalLeadsProcessed: number;
  totalTokensUsed: number;
  revenueThisMonth: number;
}

export interface AdjustTokensDto {
  amount: number;
  reason: string;
}

export interface SuspendUserDto {
  reason: string;
}
