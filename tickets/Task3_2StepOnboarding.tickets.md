## Task 3: 2-Step Onboarding Flow

>> Add email verification prompt for email/password signups and address collection for ALL users.
>> See the full implementation plan at [[api-swagger-openapi-json-i-see-that-fizzy-oasis.md]]

  ## New Flows

  **Email/password signup (customer & agent):**
    >> Signup → /signup/verify → click email link → /verify-email → /onboarding/address → dashboard

  **Google OAuth signup (customer & agent):**
    >> Google Auth → /onboarding (name+phone) → /onboarding/address → dashboard

  ## Files to Create (2)

    >> 1. src/routes/auth/SignupVerify.tsx
    >>    Page after email/password signup. "Check your email" message.
    >>    Resend button: POST /auth/send-email-verification via useSendEmailVerification.
    >>    Continue button: checks auth/me for emailVerified, then redirects to /onboarding/address.

    >> 2. src/routes/auth/OnboardingAddress.tsx
    >>    Collects delivery address via existing UserAddressForm component.
    >>    Save: PATCH /auth/me/address via authService.updateAddress.
    >>    Role-based redirect: agent → /agent/onboard, customer → /dashboard.

  ## Files to Modify (7)

    >> 3. src/hooks/auth/useSignup.ts
    >>    Remove auto-navigation (navigate() calls). Keep setAuth dispatch and toast.
    >>    Let pages handle their own onSuccess navigation.

    >> 4. src/routes/auth/Signup.tsx
    >>    Add onSuccess to mutate: navigate(ROUTES.signupVerify).

    >> 5. src/routes/auth/AgentSignup.tsx
    >>    Change onSuccess from /agent/onboard to ROUTES.signupVerify.

    >> 6. src/routes/auth/Onboarding.tsx
    >>    Change post-save navigation from /dashboard to ROUTES.onboardingAddress.

    >> 7. src/routes/auth/VerifyEmail.tsx
    >>    Change redirect from /login to /onboarding/address when user is authenticated.
    >>    Check selectIsAuthenticated from Redux.

    >> 8. src/constants/routes.ts
    >>    Add signupVerify: '/signup/verify' and onboardingAddress: '/onboarding/address'.

    >> 9. src/Routes.tsx
    >>    Add lazy imports + route entries for SignupVerify and OnboardingAddress under OnboardingLayout.

  ## Key Components/Patterns to Reuse
    >> UserAddressForm from components/profile/ (reuse directly)
    >> OnboardingLayout (no GuestGuard, centered card)
    >> useSendEmailVerification hook
    >> useVerifyEmail hook
    >> selectIsAuthenticated from store/auth.slice

  ## Verification
    >> Signup new user → /signup/verify with email sent. Verify email → /onboarding/address → dashboard.
    >> Google OAuth user → /onboarding → /onboarding/address → dashboard.
    >> Agent user through any flow → /agent/onboard after address save.
