## Auth Flow (Frontend) Step by Step

  ## 1) Header + Account Dropdown
        >> Upgraded marketing header with menu + login/signup + account dropdown for logged-in users.
        >> Dropdown now shows account actions and token information.
        >> Dashboard topbar dropdown now includes token count and account settings link.

  ## 2) Pricing Page Style Improvement
        >> Improved pricing page hero copy and card interactions.
        >> Added clearer visual hierarchy and hover style for plan cards.

  ## 3) Theme Toggle (Black/White mode)
        >> Added reusable theme toggle component.
        >> Added persistent theme state in localStorage.
        >> Added toggle in both marketing header and dashboard topbar.

  ## 4) Auto Refresh Token + Cookie Integration
        >> Axios interceptor now refreshes token through /auth/refresh with credentials.
        >> Updated response parsing to match backend { success, data } shape.
        >> Added safe retry queue for parallel 401 requests and proper logout fallback.

  ## 5) Google OAuth Login/Signup
        >> Added Google sign-in button on login and signup screens using GIS script.
        >> On success it calls backend /api/v1/auth/google and stores user + access token.
        >> @Todo Add APP_GOOGLE_CLIENT_ID in frontend env file.

  ## 6) Post Signup OTP Verification
        >> Added new page: /verify-email-otp.
        >> Signup now redirects user to OTP verify screen with email context.
        >> OTP submit calls /api/v1/auth/verify-email-otp and then continues onboarding.

  ## 7) Ask User to Select a Plan
        >> Added select-plan page and route.
        >> After OTP verification (or Google signup path), user is routed to plan selection.
        >> @Todo Connect selected plan to payment/subscription API once key/sdk is available.

  ## 8) Edit Personal Details Page
        >> Upgraded settings page to edit and save profile name.
        >> Save action now calls PATCH /api/v1/auth/me and updates Redux user state.

  ## 9) Proper Footer
        >> Added marketing footer with quick links and copyright.

## Completed Checklist

- [x] Proper header with menu and auth CTAs
- [x] Account dropdown with token information
- [x] Pricing page UI improvements
- [x] Black/white theme toggle with persistence
- [x] Silent token refresh integrated with cookie flow
- [x] Google OAuth login/signup UI integration
- [x] Post-signup OTP verification page + flow
- [x] Plan selection page after signup/verification
- [x] Personal details edit in settings
- [x] Proper footer in marketing layout
- [ ] Billing API/SDK key-based final integration
