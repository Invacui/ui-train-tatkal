import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { clearAuth } from '@/store/auth.slice';
import { ROUTES } from '@/constants/routes';

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      dispatch(clearAuth());
      qc.clear();
      navigate(ROUTES.login);
    },
  });
}
