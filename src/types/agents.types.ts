/**
 * @file Agent types
 * @description Types for agent profiles, stats, earnings, and DTOs
 * @module types
 */

// Agent account status
export type AgentStatus = 'pending' | 'active' | 'suspended';
// Agent tier/level
export type AgentTier = 'bronze' | 'silver' | 'gold';

// Agent listing info (used in search/listing contexts)
export interface Agent {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: AgentStatus;
  tier: AgentTier;
  rating: number;
  totalBookings: number;
  successfulBookings: number;
  completionRate: number;
  city: string;
  serviceStations: string[];
  isOnline: boolean;
  activeBookingsCount: number;
}

// Detailed agent profile with business info
export interface AgentProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  panNumber: string;
  gstNumber: string;
  isRailwayCertified: boolean;
  dailyCapacity: number;
  bankAccountNumber: string;
  ifscCode: string;
  selfPhotoUrl: string;
  shopPhotoUrl: string;
  status: AgentStatus;
  tier: AgentTier;
  rating: number;
  isOnline: boolean;
}

// Agent performance statistics
export interface AgentStats {
  totalRequests: number;
  acceptedRequests: number;
  completedBookings: number;
  failedBookings: number;
  completionRate: number;
  averageResponseTime: number;
  currentLoad: number;
  rating: number;
}

// Agent earnings summary
export interface AgentEarnings {
  totalEarnings: number;
  thisMonth: number;
  pendingPayout: number;
  lastPayout: number;
  lastPayoutDate: string;
}

// Payload for agent onboarding registration
export interface AgentOnboardDto {
  businessName: string;
  panNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  isRailwayCertified: boolean;
  dailyCapacity: number;
  selfPhotoUrl: string;
  shopPhotoUrl: string;
  bankAccountNumber: string;
  ifscCode: string;
}

// Payload for adding a team member to an agency
export interface TeamMemberDto {
  name: string;
  phone: string;
  email: string;
}
