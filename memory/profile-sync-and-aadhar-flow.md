---
name: profile-sync-hook-and-aadhar-flow
description: Added useProfile query hook for fresh data + fixed Aadhar upload flow to be sequential
metadata:
  type: project
---

The Settings page had two systemic issues:

**Stale Redux data.** The page reads from `useAppSelector(selectUser)` but only some mutation hooks dispatched back to Redux. If a mutation succeeded but the API response didn't include the expected field (e.g. `aadharDocUrl`), the Redux store stayed permanently stale.

**Fix:**
1. Created `src/hooks/auth/useProfile.ts` — a `useQuery` for `GET /auth/me` that dispatches `updateUser` to Redux on every successful fetch. Called in Settings, it ensures fresh data on mount.
2. Added `queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })` to `useUpdateProfile` and `useUpdateAadhar` on success, so all profile mutations trigger a cascade: invalidate → refetch → Redux dispatch → UI update.
3. All existing family member and address hooks already had this invalidation.

**Aadhar upload flow was fragile.** The aadhar number and document URL were saved in two independent PATCH calls. The number could be saved with `aadharDocUrl: ""`, and the file upload then called another PATCH — creating a race and making the docUrl easy to lose.

**Fix:**
- Sequential two-step flow: **Step 1** upload file → URL held in local state. **Step 2** enter Aadhar number → Save button calls PATCH with **both** fields together.
- Save is disabled until a document URL is available (fresh upload or existing saved docUrl).
- After save, profile query invalidated → refetched → Redux synced.
- View handler prefers local `uploadedDocUrl` for unsaved uploads, falls back to API-fetched URL for saved ones.

Affected files:
- [[use-profile-hook]] `src/hooks/auth/useProfile.ts` (new)
- [[settings-page]] `src/routes/dashboard/Settings.tsx`
- [[update-profile-hook]] `src/hooks/auth/useUpdateProfile.ts`
- [[update-aadhar-hook]] `src/hooks/profile/useUpdateAadhar.ts`
