---
name: agent-google-oauth-fix
description: Google OAuth for agents was creating customer accounts instead
metadata:
  type: feedback
---

Google OAuth on agent login/signup pages was creating accounts with `role: "customer"` because the shared `GoogleAuthButton` component always called `POST /auth/google` — the generic user endpoint — regardless of which page rendered it.

**Fix (frontend):**
- Added optional `role` field to `GoogleAuthDto` (`'customer' | 'agent'`)
- Added `authService.agentGoogleAuth()` → `POST /auth/agent/google` to auth service
- Updated `useGoogleAuth` hook to call the agent endpoint when `role === 'agent'` and dispatch `agent` profile to Redux
- Added `role` prop to `GoogleAuthButton` (defaults to `'customer'`)
- Updated callback to handle `AgentAuthResponse` (`requiresOnboarding` vs `user.onboardingCompleted`, agent-specific redirects)
- Passed `role="agent"` from `AgentLogin.tsx` and `AgentSignup.tsx`

**Why:** The GoogleAuthButton was shared but had no way to tell the backend "this is an agent signup." The `redirectTo` prop only controlled post-auth navigation, not the API endpoint.

**Backend still needed:** A `POST /auth/agent/google` endpoint must be added to the backend that:
1. Verifies the Google ID token
2. Creates/authenticates a user with `role: 'agent'`
3. Creates/returns the associated `AgentProfile`
4. Returns `AgentAuthResponse` with `requiresOnboarding` flag

**Files changed:**
- `src/types/auth.types.ts` — added `role` to `GoogleAuthDto`
- `src/services/auth.service.ts` — added `agentGoogleAuth`
- `src/hooks/auth/useGoogleAuth.ts` — conditional endpoint + agent dispatch
- `src/components/auth/GoogleAuthButton.tsx` — `role` prop + agent callback logic
- `src/routes/auth/AgentLogin.tsx` — pass `role="agent"`
- `src/routes/auth/AgentSignup.tsx` — pass `role="agent"`
