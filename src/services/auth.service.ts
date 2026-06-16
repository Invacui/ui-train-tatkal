import { api } from '@/lib/axios';
import type {
  LoginDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailOtpDto,
  AuthResponse,
  GoogleAuthDto,
  UpdateMeDto,
} from '@/types/auth.types';

export const authService = {
  me: () => api.get<AuthResponse>('/auth/me'),
  login: (dto: LoginDto) => api.post<AuthResponse>('/auth/login', dto),
  signup: (dto: SignupDto) => api.post<AuthResponse>('/auth/signup', dto),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (dto: ForgotPasswordDto) => api.post('/auth/forgot-password', dto),
  resetPassword: (dto: ResetPasswordDto) => api.post('/auth/reset-password', dto),
  verifyEmail: (token: string) => api.post(`/auth/verify-email/${token}`),
  verifyEmailOtp: (dto: VerifyEmailOtpDto) => api.post('/auth/verify-email-otp', dto),
  googleAuth: (dto: GoogleAuthDto) => api.post<AuthResponse>('/auth/google', dto),
  updateMe: (dto: UpdateMeDto) => api.patch<{ success: boolean; data: AuthResponse['data']['user'] }>('/auth/me', dto),
  refresh: () => api.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh', {}, { withCredentials: true }),
};
