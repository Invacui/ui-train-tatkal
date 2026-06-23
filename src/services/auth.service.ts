/**
 * @file auth.service.ts
 * @description Authentication and user management API service for login, signup, password management, token refresh, and profile updates.
 * @module services/auth.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Auth DTOs and response types for authentication operations
import type {
  LoginDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
  AgentAuthResponse,
  GoogleAuthDto,
  UpdateMeDto,
  ChangePasswordDto,
  OnboardingDto,
  TokenRefreshResponse,
  AgentSignupDto,
  AgentLoginDto,
} from '@/types/auth.types';

// Profile-related DTOs
import type {
  UserAddress,
  AddFamilyMemberDto,
  UpdateFamilyMemberDto,
  UpdateAadharDto,
} from '@/types/auth.types';

// Generic API response wrapper
import type { ApiResponse } from '@/types/api.types';

// User type for profile responses
import type { User } from '@/types/auth.types';


/**
 * authService 
 * 
 * @description This service provides methods for user authentication and management, including login, signup, logout, email verification, password management, and token refreshing. It interacts with the backend API using Axios to perform these operations.
 * 
 * @methods
 * - me: Fetches the current authenticated user's information.
 * - login: Authenticates a user with email and password.
 * - signup: Registers a new user with email, password, and other details.
 * - logout: Logs out the current user.
 * - googleAuth: Authenticates a user using Google OAuth.
 * - onboarding: Completes the onboarding process for a new user.
 * - sendEmailVerification: Sends an email verification link to the user.
 * - verifyEmail: Verifies the user's email using a token.
 * - changePassword: Changes the user's password.
 * - forgotPassword: Initiates the forgot password process by sending a reset link to the user's email.
 * - resetPassword: Resets the user's password using a token and new password.
 * - refreshToken: Refreshes the access token using a refresh token.
 * - updateMe: Updates the current authenticated user's information.
 */
export const authService = {

  /**
   * me
   * 
   * @description Fetches the current authenticated user's information. This method is typically called after a user logs in or when the app initializes to check if the user is already authenticated. It returns the user's profile data, which can be used to personalize the user experience and manage access to protected routes based on the user's role and permissions.
   * 
   * @returns A promise that resolves to the current authenticated user's information wrapped in an ApiResponse. This method is used to fetch the user's profile data after authentication or when the app initializes to check if the user is already logged in.
   */
  me: () => api.get<ApiResponse<User>>('/auth/me'),

  /**
   * login
   * 
   * @description Authenticates a user with their email and password. This method sends a POST request to the backend API with the user's credentials. If the authentication is successful, it returns an access token, refresh token, and the authenticated user's information. The access token can be used to access protected resources in the application, while the refresh token can be used to obtain a new access token when the current one expires. The user's information can be used to personalize the user experience and manage access to different parts of the application based on their role and permissions.
   * 
   * @param {LoginDto} dto - An object containing the user's email and password for authentication. This method sends a POST request to the backend API to authenticate the user and retrieve an access token, refresh token, and user information. The response includes the authenticated user's profile data and tokens, which can be used to manage the user's session and access protected resources in the application.
   * @returns 
   */
  login: (dto: LoginDto) => api.post<AuthResponse>('/auth/login', dto),

  agentLogin: (dto: AgentLoginDto) => api.post<AgentAuthResponse>('/auth/agent/login', dto),


  signup: (dto: SignupDto) => api.post<AuthResponse>('/auth/register', dto),
  agentSignup: (dto: AgentSignupDto) => api.post<AgentAuthResponse>('/auth/agent/register', dto),
  logout: () => api.post('/auth/logout'),
  googleAuth: (dto: GoogleAuthDto) => api.post<AuthResponse>('/auth/google', dto),
  agentGoogleAuth: (dto: GoogleAuthDto) => api.post<AgentAuthResponse>('/auth/agent/google', dto),
  onboarding: (dto: OnboardingDto) => api.post('/auth/onboarding', dto),
  sendEmailVerification: (dto: { email: string; isEmailNew?: boolean }) =>
    api.post('/auth/send-email-verification', dto),
  verifyEmail: (token: string, userId: string) =>
    api.get(`/auth/verify-email`, { params: { token, userId } }),
  changePassword: (dto: ChangePasswordDto) => api.patch('/auth/me/password', dto),
  forgotPassword: (dto: ForgotPasswordDto) => api.post('/auth/forgot-password', dto),
  resetPassword: (dto: ResetPasswordDto) => api.post('/auth/reset-password', dto),
  refreshToken: (refreshToken: string) =>
    api.post<TokenRefreshResponse>('/auth/refresh-token', { refreshToken }),
  updateMe: (dto: UpdateMeDto) => api.patch<ApiResponse<User>>('/auth/me', dto),

  // --- Profile enhancement methods ---

  /**
   * updateAddress
   * @description Updates the authenticated user's address with geolocation.
   * @param {UserAddress} address - Structured address object.
   * @returns A promise resolving to the updated user profile.
   */
  updateAddress: (address: UserAddress) =>
    api.patch<ApiResponse<User>>('/auth/me/address', address),

  /**
   * addFamilyMember
   * @description Adds a new family member to the user's account (max 4).
   * @param {AddFamilyMemberDto} dto - Family member details.
   * @returns A promise resolving to the created family member.
   */
  addFamilyMember: (dto: AddFamilyMemberDto) =>
    api.post('/auth/me/family-members', dto),

  /**
   * updateFamilyMember
   * @description Updates an existing family member's details.
   * @param {string} id - The family member's ID.
   * @param {UpdateFamilyMemberDto} dto - Updated family member details.
   * @returns A promise resolving to the updated family member.
   */
  updateFamilyMember: (id: string, dto: UpdateFamilyMemberDto) =>
    api.patch(`/auth/me/family-members/${id}`, dto),

  /**
   * deleteFamilyMember
   * @description Removes a family member from the user's account.
   * @param {string} id - The family member's ID to remove.
   * @returns A promise resolving to the deletion confirmation.
   */
  deleteFamilyMember: (id: string) =>
    api.delete(`/auth/me/family-members/${id}`),

  /**
   * updateAadhar
   * @description Updates the user's Aadhar ID and document URL.
   * @param {UpdateAadharDto} dto - Object with aadharId and aadharDocUrl.
   * @returns A promise resolving to the updated user profile.
   */
  updateAadhar: (dto: UpdateAadharDto) =>
    api.patch<ApiResponse<User>>('/auth/me/aadhar', dto),
};
