/**
 * @file Agent types
 * @description Types for agent profiles, stats, earnings, and DTOs
 * @module types
 */

// Agent account status
export type AgentStatus = 'pending' | 'active' | 'suspended';
// Agent tier/level
export type AgentTier = 'bronze' | 'silver' | 'gold';
// Auth provider
export type AgentAuthProvider = 'local' | 'google';

/** Structured address with optional geolocation (same as UserAddress) */
export interface AgentAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lon?: number;
}

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

// Detailed agent profile as returned by /auth/agent/register, /auth/agent/login, and PATCH /agents/profile
export interface AgentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  authProvider: AgentAuthProvider;
  onboardingCompleted: boolean;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  panNumber: string;
  gstNumber: string;
  address?: AgentAddress;
  city: string;
  isRailwayCertified: boolean;
  dailyCapacity: number;
  serviceStations: string[];
  selfPhotoUrl: string;
  shopPhotoUrl: string;
  bankAccountNumber: string;
  ifscCode: string;
  status: AgentStatus;
  tier: AgentTier;
  rating: number;
  isOnline: boolean;
}

// Agent performance statistics — matches backend GET /agents/stats
export interface AgentStats {
  successRate: number;
  totalBookings: number;
  successfulBookings: number;
  failedBookings: number;
  earnings: number;
  tier: AgentTier;
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

// Single earnings entry as returned by GET /agents/earnings
export interface AgentEarningsEntry {
  bookingId: string;
  amount: number;
  date: string;
  type: 'commission';
}

// Payload for agent onboarding registration (old full-onboard approach, kept for compatibility)
export interface AgentOnboardDto {
  businessName: string;
  panNumber: string;
  gstNumber: string;
  address: AgentAddress;
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
