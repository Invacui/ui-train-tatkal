import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/auth.slice';
import { ROUTES } from '@/constants/routes';
import type { SignupDto } from '@/types/auth.types';

export function useSignup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: SignupDto) => authService.signup(dto),
    onSuccess: (res) => {
      dispatch(setAuth({ user: res.data.data.user, accessToken: res.data.data.tokens.accessToken }));
      toast.success('Account created! Verify OTP to continue.');
      navigate(`${ROUTES.verifyEmailOtp}?email=${encodeURIComponent(res.data.data.user.email)}`);
    },
  });
}
