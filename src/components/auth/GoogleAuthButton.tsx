import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/auth.slice';
import { useNavigate } from 'react-router-dom';

interface GoogleAuthButtonProps {
  redirectTo: string;
}

export function GoogleAuthButton({ redirectTo }: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @Todo Add APP_GOOGLE_CLIENT_ID in frontend env file.
      const clientId = import.meta.env.APP_GOOGLE_CLIENT_ID;
      if (!clientId || !buttonRef.current || !window.google) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          if (!credential) return;
          try {
            const res = await authService.googleAuth({ idToken: credential });
            dispatch(setAuth({ user: res.data.data.user, accessToken: res.data.data.tokens.accessToken }));
            toast.success('Signed in with Google');
            navigate(redirectTo);
          } catch (error: any) {
            const message = error?.response?.data?.error || 'Google auth failed';
            toast.error(message);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '320',
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch, navigate, redirectTo]);

  return <div ref={buttonRef} className="flex justify-center" />;
}
