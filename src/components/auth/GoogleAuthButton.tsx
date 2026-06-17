/**
 * @file GoogleAuthButton.tsx
 * @description Google OAuth Sign-In button component using Google Identity Services (GIS).
 *   Handles both login (existing user) and signup (new user) flows.
 *   - Existing users with onboarding completed → role-based redirect
 *   - New Google users (onboardingCompleted=false) → redirect to /onboarding
 *
 * @requires APP_GOOGLE_CLIENT_ID environment variable must be set in .env.
 *   If missing, a warning message is shown instead of the button.
 * @module components/auth
 */

// React hooks for side effects, references, and UI state
import { useEffect, useRef, useState } from 'react';

// Toast notifications for success/error feedback
import { toast } from 'sonner';

// Navigation hook for post-auth redirect
import { useNavigate } from 'react-router-dom';

// Google auth mutation hook (handles dispatching auth to Redux internally)
import { useGoogleAuth } from '@/hooks/auth/useGoogleAuth';

// Application route constants
import { ROUTES } from '@/constants/routes';

/** Props for the Google OAuth button component */
interface GoogleAuthButtonProps {
  /** Fallback route for existing authenticated users (e.g. /dashboard) */
  redirectTo: string;

  // --- GIS branded button appearance options (passed to google.accounts.id.renderButton) ---
  /** Google branded button theme: 'outline' | 'filled_blue' | 'filled_black' */
  buttonTheme?: 'outline' | 'filled_blue' | 'filled_black';
  /** Branded button size: 'small' | 'medium' | 'large' */
  buttonSize?: 'small' | 'medium' | 'large';
  /** Branded button shape: 'rectangular' | 'pill' */
  buttonShape?: 'rectangular' | 'pill';
  /** Button width in px (e.g. '400'). Defaults to '320'. */
  buttonWidth?: string;
  /** Override the default button label text. Only works with text: 'signin_with' etc. */
  buttonType?: 'standard' | 'icon';
  /** When true, renders a fully custom button instead of Google's branded renderButton.
   *  On click it calls google.accounts.id.prompt() to show the One Tap credential dialog. */
  useCustomButton?: boolean;
  /** For fully custom mode — custom label text on your own button */
  customLabel?: string;
}

/**
 * GoogleAuthButton
 * @description Renders a Google Sign-In button using the Google Identity Services (GIS)
 *   JavaScript library. Dynamically loads the GSI script on mount, initializes the
 *   OAuth client with APP_GOOGLE_CLIENT_ID, and renders the branded button.
 *
 *   After a successful auth, the callback checks the user's `onboardingCompleted` flag:
 *   - `false` → user just signed up via Google → redirect to /onboarding
 *   - `true` → existing user → role-based redirect (admin → /admin, agent → /agent, else redirectTo)
 *
 *   Handles all edge cases: missing env var, script load failure, loading state.
 * @param {GoogleAuthButtonProps} props
 * @param {string} props.redirectTo - Fallback route for existing users
 * @returns A Google Sign-In button, a loading state, or an info/error message
 */
export function GoogleAuthButton({
  redirectTo,
  buttonTheme = 'outline',
  buttonSize = 'large',
  buttonShape = 'rectangular',
  buttonWidth = '320',
  buttonType = 'standard',
  useCustomButton = false,
  customLabel = 'Sign in with Google',
}: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const navigate = useNavigate();
  const { mutateAsync: googleAuth } = useGoogleAuth();
  const [scriptLoaded, setScriptLoaded] = useState(0);
  const [scriptError, setScriptError] = useState(false);

  const clientId = import.meta.env.APP_GOOGLE_CLIENT_ID;

  // --- Effect 1: Dynamically load the Google Identity Services script (runs once) ---
  useEffect(() => {
    if (!clientId) return;
    // If the SDK is already loaded (e.g. a prior mount), just trigger the init effect
    if (window.google?.accounts) {
      setScriptLoaded(c => c + 1);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      setScriptLoaded(c => c + 1); // Increment scriptLoaded counter to trigger init effect
    };

    script.onerror = () => {
      setScriptError(true);
      console.error('Failed to load Google Identity Services script');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  // --- Effect 2: Init Google Sign-In once the script is loaded AND the button ref is committed to DOM ---
  useEffect(() => {
    if (clientId && window.google?.accounts && scriptLoaded > 0) {
      initGoogleSignIn();
    }
    // Intentionally not including initGoogleSignIn as a dep — it's non-reactive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, clientId]);

  /**
   * initGoogleSignIn
   * @description Initializes the Google Identity Services OAuth client with the
   *   configured client ID and renders the Sign-In button into the component's
   *   container div. Only runs once per component mount via initializedRef.
   */
  const initGoogleSignIn = () => {
    if (initializedRef.current || !buttonRef.current || !window.google?.accounts) return;
    initializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId!,
      callback: async ({ credential }) => {
        if (!credential) return;
        try {
          // Authenticate with the backend — useGoogleAuth dispatches auth to Redux
          const res = await googleAuth({ idToken: credential });
          const { user } = res.data.data;

          // New Google users have onboardingCompleted = false → redirect to onboarding
          if (!user.onboardingCompleted) {
            toast.success('Welcome! Please complete your profile.');
            navigate(ROUTES.onboarding);
            return;
          }

          // Existing users — role-based redirect
          toast.success(`Signed in as ${user.name}`);
          if (user.role === 'admin') navigate(ROUTES.admin.root);
          else if (user.role === 'agent') navigate(ROUTES.agent.root);
          else navigate(redirectTo);
        } catch (error: any) {
          const message = error?.response?.data?.error || 'Google authentication failed';
          toast.error(message);
        }
      },
    });

    if (useCustomButton) {
      // Custom button mode — skip renderButton. The button's onClick triggers Google One Tap.
      // Google stores the client config internally; we just need to prompt.
    } else {
      // Render the branded Google Sign-In button with customization props.
      // Cast to any — the GIS type defs don't expose 'shape' or 'type' even though
      // the runtime API supports them.
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: buttonTheme,
        size: buttonSize,
        width: buttonWidth,
        shape: buttonShape,
        type: buttonType,
      } as any);
    }
  };

  /**
   * handleCustomGoogleSignIn
   * @description For the useCustomButton mode — prompt Google One Tap when clicked.
   */
  const handleCustomGoogleSignIn = () => {
    if (window.google?.accounts) {
      // prompt() is part of the GIS JS runtime but missing from TS types
      (window.google.accounts.id as any).prompt();
    }
  };

  /** Renders a disabled placeholder while the GSI script is loading */
  const loadingButton = (
    <div className="flex w-full justify-center">
      <div className="pointer-events-none h-12 w-[320px] animate-pulse rounded-md border border-input bg-muted opacity-50" />
    </div>
  );

  // Case 1: No client ID configured — show a helpful message
  if (!clientId) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Google Sign-In not configured. Set <code className="rounded bg-muted px-1">APP_GOOGLE_CLIENT_ID</code> to{' '}
        enable.
      </p>
    );
  }

  // Case 2: Script failed to load
  if (scriptError) {
    return (
      <p className="text-center text-xs text-destructive">
        Failed to load Google Sign-In. Please check your internet connection.
      </p>
    );
  }

  // Case 3: Still loading the GSI script — show disabled placeholder
  if (scriptLoaded === 0 && !window.google?.accounts) {
    return loadingButton;
  }

  // Cases 4 & 5: GSI script is loaded — show the sign-in button
  if (useCustomButton) {
    // Case 4: Fully custom button (no Google branding restrictions)
    return (
      <div className="flex w-full justify-center">
        <button
          type="button"
          onClick={handleCustomGoogleSignIn}
          className="flex h-12 w-[320px] items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {/* Simple inline Google "G" icon */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {customLabel}
        </button>
      </div>
    );
  }

  // Case 5: Branded Google button container — GIS renders into this div
  return <div ref={buttonRef} className="flex justify-center" />;
}
