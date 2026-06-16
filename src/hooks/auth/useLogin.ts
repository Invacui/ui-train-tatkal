import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/auth.slice";
import { ROUTES } from "@/constants/routes";
import type { LoginDto } from "@/types/auth.types";

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (res) => {
      dispatch(setAuth({ user: res.data.data.user, accessToken: res.data.data.tokens.accessToken }));
      toast.success("Welcome back!");
      navigate(ROUTES.dashboard);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Invalid email or password";
      toast.error(message);
    },
  });
}
