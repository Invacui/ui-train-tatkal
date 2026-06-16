# Users (Customer facing flows and endpoints)

  ## Signup (Create an account and verify email)
        >> Users will sign up to the platform using /api/v1/auth/signup.
        >> Required fields: email, name, password, corporationName.
        >> After signup, a verification email is sent to the user to verify their email address via /api/v1/auth/verify-email/:token.
        >> If a user did not receive or lost the original email, they can request a new verification email using /api/v1/auth/resend-verification.

  ## Login (Get access + refresh tokens)
        >> Existing users log in using /api/v1/auth/login.
        >> Required fields: email, password.
        >> On successful login, the user receives an accessToken (short‑lived) and a refreshToken (long‑lived).
        >> The frontend should store the accessToken in memory (or httpOnly cookie) and the refreshToken in a more persistent but still secure store, then attach the accessToken to all authenticated API calls.

  ## Token Refresh (Keep the user logged in without re‑entering password)
        >> When the accessToken expires, the client should call /api/v1/auth/refresh with the refreshToken in the body.
        >> On success, the API returns a new accessToken (and optionally a rotated refreshToken depending on implementation).
        >> This endpoint is rate‑limited and validated via refreshSchema to avoid abuse.
        >> If refresh fails (e.g., invalid/expired token), the client should log the user out and redirect them to the login screen.
        >$> Refresh Token: A long‑lived token used only to get new short‑lived access tokens without asking the user to log in again. It should never be exposed to third‑party scripts or sent to any service other than your own API.

  ## Logout (End the current session)
        >> Users can log out using /api/v1/auth/logout.
        >> This invalidates the user’s server‑side session information and should also clear tokens on the client.
        >> Use this when a user explicitly signs out or when refresh fails and you want a clean state.

  ## Profile Management (Account and password flows)
        >> Users can fetch their profile details using /api/v1/auth/me (requires a valid accessToken).
        >> Users can start a password reset using /api/v1/auth/forgot-password (sends a reset email).
        >> Users can complete a password reset using /api/v1/auth/reset-password with the token received in email.
        >> Together with /api/v1/auth/resend-verification, these endpoints cover the full lifecycle of email verification and password recovery.

  ## Lead Ingestion (Store raw lead sources that power campaigns)
        >> Leads ingestion is a crucial step. It stores collections of documents that contain socials or contact info for people in a particular domain (e.g. healthcare, IT, etc.). These stored leads are later used when running campaigns.
        >> Users can parse leads by:
        >>  - Uploading a file via /api/v1/leads/upload (supports xlsx, csv, pdf, etc.).
        >>  - Providing a URL via /api/v1/leads/link that the system downloads and parses.
        >> Uploaded files are stored in object storage (e.g. Supabase S3‑compatible buckets) and then a background job is enqueued to parse and extract leads.
        >$> BullMQ: A Node.js library built on top of Redis that lets us run background jobs and queues. We use it so heavy tasks like parsing large lead files or sending thousands of outreach messages don’t block the main API request and can be retried independently.
        >> After parsing, the leads are processed asynchronously and written into the database, with duplicate detection and normalization handled by the worker.
        >> Improvement: Notify the user via email or in‑app notifications when the lead parsing is complete, including total leads and duplicates.

  ## Lead Management (Browse, inspect, and clean parsed leads)
        >> Users can view their lead requests using GET /api/v1/leads.
        >> They can fetch individual lead request details via GET /api/v1/leads/:id.
        >> Parsed leads within a request can be fetched via GET /api/v1/leads/:id/leads.
        >> Parsed files can be downloaded or re‑inspected via GET /api/v1/leads/:id/file.
        >> Users can soft‑delete lead requests via DELETE /api/v1/leads/:id so they no longer appear in listings, while preserving audit history.
        >> Improvement: Add UI to deduplicate and edit leads inline before launching a campaign (merge duplicates, fix names, tag industries).

  ## Template Creation (Define messaging and logic before launching campaigns)
        >> Users can create templates for campaigns using POST /api/v1/templates.
        >> They can list existing templates via GET /api/v1/templates.
        >> Individual template details are available via GET /api/v1/templates/:id.
        >> Templates can be updated via PATCH /api/v1/templates/:id and deleted via DELETE /api/v1/templates/:id.
        >> Users can preview the rendered content using POST /api/v1/templates/:id/preview.
        >> Users can launch a campaign from a template using POST /api/v1/templates/:id/launch (requires launchCampaignSchema).
        >> Improvement: In the UI, surface how many leads and which channels (EMAIL / WHATSAPP) will be targeted before confirming launch.

  ## Campaigns (Control running outreach and see performance)
        >> Users can list all their campaigns via GET /api/v1/campaigns.
        >> They can fetch a specific campaign via GET /api/v1/campaigns/:id.
        >> Campaigns can be paused via PATCH /api/v1/campaigns/:id/pause and resumed via PATCH /api/v1/campaigns/:id/resume.
        >> Users can view campaign logs via GET /api/v1/campaigns/:id/logs to understand what messages were sent and their status.
        >> Users can fetch hot leads (e.g. high‑intent conversations) for a campaign via GET /api/v1/campaigns/:id/hot-leads.
        >> Suggestion: Notify users about campaign performance via periodic emails (open rates, reply rates, hot‑lead counts).

  ## Conversations (Two‑way replies over email / WhatsApp)
        >> Users can manage conversations with leads via GET /api/v1/conversations.
        >> They can fetch an individual conversation via GET /api/v1/conversations/:id.
        >> Users can reply to conversations using POST /api/v1/conversations/:id/reply (validated with replySchema).
        >> Depending on the channel (EMAIL / WHATSAPP), the system sends the reply out through the appropriate provider and logs all messages for later AI follow‑up.

  ### Final User Roadmap (From signup to first successful campaign)
        >> 1. User lands on the platform, signs up via /api/v1/auth/signup and verifies their email through the verification link (/api/v1/auth/verify-email/:token). If needed, they can trigger /api/v1/auth/resend-verification from the UI.
        >> 2. After verification, they log in via /api/v1/auth/login and receive accessToken + refreshToken. The app keeps them logged in using /api/v1/auth/refresh whenever the accessToken expires.
        >> 3. On first login, the dashboard prompts them to ingest leads. They upload an .xlsx/.csv/.pdf via /api/v1/leads/upload or paste a link via /api/v1/leads/link. The file is stored in storage under a path like leads>>industry_domain>>{userId}>>{leadRequestId}.
        >> 4. A BullMQ job is enqueued to parse the uploaded file. The leadParse worker reads the file from storage, uses AI (Groq) to extract leads, deduplicates them, and writes cleaned leads into the database tied to that leadRequestId.
        >> 5. Once parsing is complete, the user can open the lead request via /api/v1/leads and inspect the list via /api/v1/leads/:id/leads. They can clean up duplicates, edit contact info, and tag leads by industry or segment.
        >> 6. The user creates a messaging template via /api/v1/templates, previews it with /api/v1/templates/:id/preview, and when satisfied, launches a campaign with /api/v1/templates/:id/launch which behind the scenes creates a /api/v1/campaigns entry and enqueues engagement jobs.
        >> 7. Engagement workers start sending messages (EMAIL / WHATSAPP) to the selected leads, logging each send. The user monitors progress via /api/v1/campaigns, /api/v1/campaigns/:id/logs, and focuses on /api/v1/campaigns/:id/hot-leads where AI or rules mark high‑intent conversations.
        >> 8. As replies come back over email or WhatsApp, webhooks create/update conversations. Users reply directly from the app via /api/v1/conversations/:id/reply, and optional AI reply jobs can assist in drafting responses. Over time, the user iterates on templates, lead segments, and campaigns to improve performance.

# Admin (Internal operations, safety, and analytics)

  ## User Management (Admin‑only view and control over users)
        >> Admins can view all users using GET /api/v1/admin/users.
        >> They can fetch a specific user via GET /api/v1/admin/users/:id.
        >> Admins can suspend or delete users via PATCH /api/v1/admin/users/:id/suspend and DELETE /api/v1/admin/users/:id.
        >> Admins can update a user’s token balance using PATCH /api/v1/admin/users/:id/tokens, which is useful for plan upgrades, refunds, or manual credits.

  ## Lead Management (Overview of all lead ingestion across tenants)
        >> Admins can view all lead requests across the platform via GET /api/v1/admin/lead-requests.
        >> This allows support and ops teams to debug ingestion issues (e.g. stuck in PROCESSING or FAILED) per tenant.

  ## Campaign Management (Platform‑wide campaign visibility)
        >> Admins can view all campaigns via GET /api/v1/admin/campaigns.
        >> This is useful for spotting abusive behavior, troubleshooting delivery, and identifying top‑performing campaigns across tenants.

  ## Platform Statistics (Global KPIs and monitoring)
        >> Admins can fetch aggregate statistics (e.g., total users, lead requests, campaigns, sent messages) via GET /api/v1/admin/stats.
        >> These stats power internal dashboards for growth, reliability, and capacity planning.

# Internal Services (Workers, queues, and callbacks)

  ## Background Queues (Lead parsing, engagement, and AI replies)
        >> The system uses three BullMQ queues configured in src/jobs/queues.ts: leadParseQueue, engagementQueue, and aiReplyQueue.
        >> leadParseQueue handles heavy lead file parsing, AI extraction, deduplication, and bulk inserts into the database.
        >> engagementQueue sends outbound campaign messages over email and WhatsApp and writes engagement logs + sent counts.
        >> aiReplyQueue generates AI‑assisted replies for inbound messages and can also automatically mark conversations as HOT when scheduling or booking intent is detected.
        >> Improvement: Document per‑queue retry and backoff policies in a runbook so SREs know how failures behave in production.

  ## Lead Parsing Worker (AI‑driven extraction of structured leads)
        >> The leadParse worker (src/jobs/workers/leadParse.worker.ts) downloads the source file (from S3‑compatible storage or external URL), extracts text (supports xlsx, csv, pdf, json, etc.), then calls Groq AI to extract structured leads.
        >> It normalizes and deduplicates leads (based on email + phone), writes them to the lead table, and updates the leadRequest status to DONE with totalCount and dupCount.
        >> On failure, it sets status to FAILED and logs the error for later inspection.
        >> This worker is initialized once via initWorkers in src/jobs/workers/index.ts and uses Redis/BullMQ connections from src/jobs/queues.ts.

  ## Engagement Worker (Send campaign messages asynchronously)
        >> The engagement worker (src/jobs/workers/engagement.worker.ts) reads jobs with campaignId, leadId, channel, and content.
        >> For EMAIL, it calls sendEmail (Resend integration) and for WHATSAPP, it calls sendWhatsApp (WhatsApp provider integration).
        >> Every send is logged into engagementLog and increments campaign.sentCount to keep reporting accurate.
        >> If a job fails (missing lead, provider error), it logs an error for observability; retries can be configured at the queue level.

  ## AI Reply Worker (Follow‑up replies and meeting scheduling)
        >> The AI reply worker (src/jobs/workers/aiReply.worker.ts) loads the recent conversation history, appends the inbound message, and calls Groq to generate an AI reply.
        >> It sends that reply over email or WhatsApp depending on the conversation channel and stores the message as an outbound AI‑generated message.
        >> If the AI reply includes clear meeting intent (“schedule”, “book”), it uses Cal.com (createBookingLink) to generate a booking link and marks the conversation as HOT with a meetingLink.
        >> This creates a loop where hot leads can be automatically nurtured into booked meetings.

  ## Internal Lead Callbacks (When external parsers push results)
        >> Internal services can update the status of lead requests via:
        >>  - POST /api/v1/internal/leads/parsed (with leadRequestId, leads[], totalCount, dupCount) to mark DONE and write leads.
        >>  - POST /api/v1/internal/leads/failed (with leadRequestId) to mark FAILED.
        >> Both endpoints require an x-service-key header that is base64‑decoded and compared against INTERNAL_SERVICE_KEY, ensuring only trusted internal services can call them.
        >> Suggestion: Add monitoring/logging dashboards around these callbacks to track parsing success/failure rates by tenant and file type.

  ## Webhooks (Inbound replies from email / WhatsApp providers)
        >> Webhooks are used for external integrations (e.g., Resend for email, WhatsApp provider for messaging).
        >> Incoming webhooks are handled under /api/v1/webhooks and are rate‑limited with webhookRateLimiter.
        >> Key endpoints:
        >>  - POST /api/v1/webhooks/email-reply for inbound email replies.
        >>  - POST /api/v1/webhooks/wa-reply for inbound WhatsApp messages.
        >>  - GET /api/v1/webhooks/wa-verify and POST /api/v1/webhooks/wa-verify for WhatsApp webhook verification flows.
        >> These webhooks create or update conversations and can enqueue AI reply jobs to keep conversations active.
        >> Improvement: Add retry/backoff mechanisms and idempotency keys for webhook processing, so duplicate provider calls do not create duplicate messages.

# Cross‑cutting Concerns and Improvements

  ## Email Notifications (Keep users informed about important events)
        >> Notify users when leads are parsed, campaigns are launched, campaigns are paused/resumed, or significant errors occur.
        >> Use the existing Resend integration to send transactional emails (e.g., “Your leads are ready”, “Your campaign has finished sending”).
        >> Improvement: Add user‑level notification preferences (email vs in‑app only) so users can control noise.

  ## Error Handling (Actionable, user‑friendly errors)
        >> Provide detailed but safe error messages for all endpoints to improve user experience and debugging.
        >> Standardize error shapes using the shared response.helper to keep API responses predictable.
        >> Improvement: Tag errors with correlation IDs and log them with enough context (userId, campaignId, leadRequestId) for faster support.

  ## Rate Limiting (Protect the platform from abuse)
        >> Rate limiting is configured per area:
        >>  - authRateLimiter for auth flows (/api/v1/auth/*),
        >>  - strictRateLimiter for sensitive endpoints like /login,
        >>  - apiRateLimiter for authenticated APIs (/leads, /templates, /campaigns, /conversations, /admin),
        >>  - webhookRateLimiter for /webhooks.
        >> Ensure limits match the expected traffic patterns for free vs paid plans and are documented for support.

  ## Monitoring and Analytics (Understand health and performance)
        >> Add monitoring for admin, internal, and worker endpoints to track usage and identify bottlenecks (slow DB queries, queue backlogs, provider failures).
        >> Use /api/v1/health as a simple liveness probe and extend with deeper health checks (DB, Redis, external providers).
        >> Improvement: Build dashboards on top of logs + metrics (campaign send rates, webhook error rates, queue depths) to proactively detect issues.

  ## Onboarding Flow (Guided first‑campaign setup inside the app)
        >> The onboarding journey should guide a new user through: verifying email, ingesting at least one lead list, creating a first template, and launching a starter campaign.
        >> Inside the UI, show a simple checklist: “Verify email”, “Upload leads”, “Create template”, “Launch first campaign”, “Review hot leads”.
        >> Behind the scenes, this flow stitches together the endpoints above: /auth/signup → /auth/verify-email → /auth/login → /leads/upload → /templates → /templates/:id/launch → /campaigns/:id/hot-leads.
        >> Improvement: Track onboarding completion events and time‑to‑first‑campaign so product can iterate on friction points (e.g. lead file formats, template editor UX).

