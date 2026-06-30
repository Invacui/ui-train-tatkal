---
name: aadhar-file-view-api
description: Added Aadhar document viewing via /files API endpoint
metadata:
  type: project
---

The swagger has `GET /files/{entityType}/{entityId}/{docType}` for retrieving file URLs (e.g. `user/{id}/aadhar`). The Settings page previously linked directly to `user.aadharDocUrl` which can become stale. Added:

1. `authService.getFileUrl()` in `src/services/auth.service.ts` — calls the files API endpoint
2. `handleViewAadharDocument` handler in `src/routes/dashboard/Settings.tsx` — fetches a fresh URL via the API and opens it in a new tab, falling back to the stored `aadharDocUrl` if the API call fails

**Why:** The direct CDN/S3 URL in `aadharDocUrl` may expire or be inaccessible. The API endpoint returns an up-to-date URL with proper auth check.
