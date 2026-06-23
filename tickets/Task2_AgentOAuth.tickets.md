## Task 2: Agent Google OAuth

>> Add Google OAuth sign-in/sign-up button to the agent login and signup pages.
>> See the full implementation plan at [[api-swagger-openapi-json-i-see-that-fizzy-oasis.md]]

  ## Files to Modify (2)

    >> 1. src/routes/auth/AgentLogin.tsx
    >>    Add GoogleAuthButton after the login form with "or" divider.
    >>    Import: import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
    >>    Props: redirectTo={ROUTES.agent.root}

    >> 2. src/routes/auth/AgentSignup.tsx
    >>    Add GoogleAuthButton after the signup form with "or" divider.
    >>    Same pattern as customer Signup.tsx.

  ## Flow
    >> User clicks Google button → GIS callback → POST /auth/google
    >> Backend returns { user, accessToken, refreshToken }
    >> If user.onboardingCompleted === false → redirect to /onboarding (name+phone)
    >> If existing user → role-based redirect. Customer role gets redirected to /agent then RoleGuard catches them.

  ## Verification
    >> Visit /agent/login — Google OAuth button renders with client ID configured.
    >> Visit /agent/signup — Google OAuth button renders.
    >> Clicking through Google auth flow redirects agents to /agent dashboard.
