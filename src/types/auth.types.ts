/**
 * @file Auth types
 * @description Types for authentication, user profiles, tokens, and auth-related DTOs
 * @module types
 */

// User roles within the system
export type UserRole = 'customer' | 'agent' | 'admin';
// Authentication provider types
export type AuthProvider = 'local' | 'google';

// Authenticated user profile
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  authProvider: AuthProvider;
  onboardingCompleted: boolean;
  /** Structured address with optional lat/lon */
  address?: UserAddress;
  /** Aadhar identification number */
  aadharId?: string;
  /** URL to uploaded Aadhar document (PDF) */
  aadharDocUrl?: string;
  /** Family members linked to this account (max 4) */
  familyMembers?: FamilyMember[];
  createdAt: string;
  updatedAt: string;
}

// Login request payload
export interface LoginDto {
  email: string;
  password: string;
}

// Registration request payload
export interface SignupDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// Google OAuth authentication payload
export interface GoogleAuthDto {
  idToken: string;
}

// User onboarding completion payload
export interface OnboardingDto {
  name?: string;
  phone?: string;
}

// Email verification request payload
export interface SendEmailVerificationDto {
  email: string;
}

// Email verification token payload
export interface VerifyEmailDto {
  token: string;
  userId: string;
}

// Change password request payload
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// Forgot password request payload
export interface ForgotPasswordDto {
  email: string;
}

// Reset password with OTP payload
export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

// Update own profile payload
export interface UpdateMeDto {
  name?: string;
  email?: string;
  phone?: string;
}

// --- New types for user address, family members, and aadhar ---

/** Structured address with optional geolocation */
export interface UserAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lon?: number;
}

/** A family member of the primary user (max 4 per account) */
export interface FamilyMember {
  id: string;
  firstName: string;
  lastName?: string;
  age: number;
  gender: Gender;
  relation: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
}

/** DTO for updating user address */
export interface UpdateAddressDto {
  address: UserAddress;
}

/** DTO for adding a new family member */
export interface AddFamilyMemberDto {
  firstName: string;
  lastName?: string;
  age: number;
  gender: Gender;
  relation: FamilyMember['relation'];
}

/** DTO for updating an existing family member */
export interface UpdateFamilyMemberDto extends AddFamilyMemberDto {}

/** DTO for updating aadhar ID and document URL */
export interface UpdateAadharDto {
  aadharId: string;
  aadharDocUrl: string;
}

// JWT access and refresh token pair
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Successful authentication response with user and tokens
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    /** Flag indicating the user needs to complete onboarding (only set for new Google users) */
    requiresOnboarding?: boolean;
  };
}

// Token refresh response with new access token
export interface TokenRefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}
