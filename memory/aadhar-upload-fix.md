---
name: aadhar-upload-fix
description: Fixed user dashboard Aadhar upload to use correct API endpoints
metadata:
  type: feedback
---

The Settings page Aadhar upload was using wrong endpoints:
1. `useFileUpload` posted to generic `/upload` (no auth, wrong endpoint) — should be `POST /users/upload/aadhar`
2. `handleSaveAadharId` used `useUpdateProfile()` (calls `PATCH /auth/me`) with a type cast — should use `PATCH /auth/me/aadhar`
3. FileDropzone only accepted PDFs — API accepts JPEG, PNG, WebP + PDF

**Fix:**
- Added `UploadResult` type to `api.types.ts`
- Added `authService.uploadAadhar(file)` → `POST /users/upload/aadhar` with `multipart/form-data` to auth service
- Created `useUpdateAadhar` hook (`src/hooks/profile/useUpdateAadhar.ts`) wrapping `PATCH /auth/me/aadhar` with Redux dispatch
- Updated `Settings.tsx` to use `authService.uploadAadhar` + `useUpdateAadhar` instead of `useFileUpload` + `useUpdateProfile`
- Fixed `FileDropzone` accept to include JPEG, PNG, WebP + PDF
- Removed unused `useFileUpload` import

**Why:** The previous implementation was using wrong endpoints and the `as any` cast hid type mismatches.
