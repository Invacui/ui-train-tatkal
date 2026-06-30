---
name: profile-data-persistence-fix
description: Fixed family member and address data loss on navigation away/back to Settings page
metadata:
  type: project
---

Family member CRUD hooks (`useAddFamilyMember`, `useUpdateFamilyMember`, `useDeleteFamilyMember`) only called `queryClient.invalidateQueries()` on success but did NOT dispatch the updated User object to Redux. The Settings page reads from `useAppSelector(selectUser)`, so after a mutation the Redux store (and localStorage via the `updateUser` reducer) remained stale. Navigating away and back showed empty data.

**Fix:** Each hook now extracts the full `User` from the API response (`res.data as ApiResponse<User>`) and dispatches `updateUser(data.data)` to Redux, which also writes to localStorage via the `auth.slice` `updateUser` reducer.

The same pattern was already in place for `useUpdateAddress` but was typed differently — normalized to the same approach for consistency.

Affected files:
- [[family-member-hooks]] `src/hooks/profile/useFamilyMembers.ts`
- [[address-update-hook]] `src/hooks/profile/useUpdateAddress.ts`
