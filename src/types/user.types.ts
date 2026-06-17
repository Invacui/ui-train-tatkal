/**
 * @file User types
 * @description User profile and role types
 * @module types
 */

// Authenticated user profile
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'agent' | 'admin';
  isActive: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  authProvider: 'local' | 'google';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// User role enumeration
export type UserRole = 'customer' | 'agent' | 'admin';
