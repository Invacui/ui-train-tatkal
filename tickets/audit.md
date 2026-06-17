# TripTatkal — Implementation Audit

> Generated: 2026-06-16
> Scope: Audit of implemented vs. missing/incomplete features for the TripTatkal train booking platform.

---

## 1. Data Layer

### Types ✅
| File | Status |
|---|---|
| `types/api.types.ts` | Complete |
| `types/auth.types.ts` | Complete |
| `types/user.types.ts` | Complete |
| `types/trips.types.ts` | Complete |
| `types/stations.types.ts` | Complete |
| `types/passengers.types.ts` | Complete |
| `types/seats.types.ts` | Complete |
| `types/bookings.types.ts` | Complete |
| `types/payments.types.ts` | Complete |
| `types/agents.types.ts` | Complete |
| `types/notifications.types.ts` | Complete |
| `types/admin.types.ts` | Complete |
| `types/google.d.ts` | Complete |

### Services ✅
| File | Status |
|---|---|
| `services/auth.service.ts` | Complete |
| `services/trips.service.ts` | Complete |
| `services/bookings.service.ts` | Complete |
| `services/agents.service.ts` | Complete |
| `services/notifications.service.ts` | Complete |
| `services/payments.service.ts` | Complete |
| `services/admin.service.ts` | Complete |

---

## 2. Core Libraries

| File | Status | Notes |
|---|---|---|
| `lib/axios.ts` | Complete | Token refresh interceptor works |
| `lib/queryClient.ts` | Complete | Global mutation error handler |
| `lib/queryKeys.ts` | Complete | All domains covered |
| `lib/validationRules.ts` | Complete | Train-specific rules added |
| `lib/utils.ts` | Complete | Currency, PNR, duration formatters |

### TODO: Remove unused dependencies
- `zod` — Can be removed from `package.json` (schemas deleted, forms use `validationRules.ts`)
- `@hookform/resolvers` — Not used
- `date-fns` — Used in `lib/utils.ts`
- `react-dropzone` — Used in `FileDropzone.tsx`
- `cmdk` — Not used but comes with shadcn

---

## 3. State Management

| File | Status | Notes |
|---|---|---|
| `store/index.ts` | Complete | auth + ui + bookingDraft |
| `store/auth.slice.ts` | Complete | `tt-user` localStorage key |
| `store/ui.slice.ts` | Complete | sidebar + modal state |
| `store/booking-draft.slice.ts` | Complete | 6-step booking wizard |

---

## 4. Guards & Constants

| File | Status | Notes |
|---|---|---|
| `guards/AuthGuard.tsx` | Complete | Redirects to login |
| `guards/GuestGuard.tsx` | Complete | Keeps authenticated away |
| `guards/RoleGuard.tsx` | Complete | 3-role check with role-based redirect |
| `constants/routes.ts` | Complete | All agent/admin/customer routes |
| `constants/enums.constant.ts` | Complete | All train-domain enums |
| `constants/queryKeys.constant.ts` | Complete | Re-exports from lib |

---

## 5. Domain Hooks

| Domain | Files | Status |
|---|---|---|
| auth/ | 11 files | Complete |
| trips/ | 4 files | Complete |
| bookings/ | 6 files | Complete |
| agents/ | 11 files | Complete |
| admin/ | 11 files | Complete (includes `useAdjustTokens.ts` → rename/delete) |
| notifications/ | 3 files | Complete |

### ⚠️ Issues
- `hooks/admin/useAdjustTokens.ts` — LeadFlow leftover, should be deleted
- `hooks/admin/useAdminUser.ts` — Missing (singular user fetch by ID)
- `hooks/admin/useUser.ts` — Intended but not created

---

## 6. Components

### UI Primitives (shadcn) ✅
16 files in `components/ui/` — all complete and untouched.

### Common Components ✅
| Component | Status |
|---|---|
| `Providers.tsx` | Complete (tt-theme key) |
| `ThemeToggle.tsx` | Complete |
| `StatusBadge.tsx` | Complete (30+ statuses) |
| `DataTable.tsx` | Complete |
| `PageHeader.tsx` | Complete |
| `ConfirmDialog.tsx` | Complete |
| `ErrorState.tsx` | Complete |
| `EmptyState.tsx` | Complete |
| `FileDropzone.tsx` | Complete |
| `RelativeTime.tsx` | Complete |

### Layout Components ✅
| Component | Status |
|---|---|
| `MarketingNav.tsx` | Complete (TripTatkal brand) |
| `MarketingFooter.tsx` | Complete |
| `DashboardTopbar.tsx` | Complete (role-based links) |
| `DashboardSidebar.tsx` | Complete (train nav items) |
| `AdminSidebar.tsx` | Complete |
| `MobileNav.tsx` | Complete |

### 🚧 Missing / Incomplete Domain Components

#### Trips domain
| Component | Status | Notes |
|---|---|---|
| `TripSearchForm.tsx` | ⚠️ Partial | Uses basic Input instead of `StationAutoComplete` |
| `TripCard.tsx` | ✅ Complete | |
| `StationAutoComplete.tsx` | ✅ Complete | Created but not wired into TripSearchForm |
| `TrainDetailCard.tsx` | 🚫 Missing | Inline content in TripDetail page instead |

#### Bookings domain
| Component | Status | Notes |
|---|---|---|
| `BookingCard.tsx` | ✅ Complete | |
| `BookingStatusBadge.tsx` | ✅ Complete | |
| `BookingTimeline.tsx` | 🚫 Missing | Vertical timeline for lifecycle |
| `BookingPricingCard.tsx` | ✅ Complete | |
| `BookingDetailHeader.tsx` | 🚫 Missing | Inline in BookingDetail instead |

#### Seats domain
| Component | Status | Notes |
|---|---|---|
| `SeatMap.tsx` | 🚫 Missing | Not implemented |
| `SeatSelector.tsx` | 🚫 Missing | Not implemented |
| `CoachSelector.tsx` | 🚫 Missing | Not implemented |

#### Passengers domain
| Component | Status | Notes |
|---|---|---|
| `PassengerForm.tsx` | ✅ Complete | |
| `PassengerList.tsx` | ✅ Complete | |

#### Payments domain
| Component | Status | Notes |
|---|---|---|
| `PaymentForm.tsx` | 🚫 Missing | Not implemented |
| `PaymentSummary.tsx` | 🚫 Missing | Not implemented |

#### Agents domain
| Component | Status | Notes |
|---|---|---|
| `AgentCard.tsx` | 🚫 Missing | Not implemented |
| `AgentRequestCard.tsx` | 🚫 Missing | Inline in Requests page instead |
| `AgentStatsGrid.tsx` | 🚫 Missing | Inline in Stats page instead |
| `TeamMemberList.tsx` | 🚫 Missing | |

#### Marketing domain
| Component | Status | Notes |
|---|---|---|
| `HeroSection.tsx` | 🚫 Missing | Inline in Landing instead |
| `FeaturesSection.tsx` | 🚫 Missing | Inline in Landing instead |
| `HowItWorksSection.tsx` | 🚫 Missing | Inline in Landing instead |
| `FaqSection.tsx` | 🚫 Missing | Not implemented |
| `LampContainer.tsx` | 🚫 Missing | Not implemented |
| `LoadingCurtain.tsx` | ✅ Complete | |
| `AnimationContainer.tsx` | ✅ Complete | |
| `reveal-variants.ts` | ✅ Complete | |
| `ScrollMouseIndicator.tsx` | ✅ Complete | |

#### Notifications domain
| Component | Status | Notes |
|---|---|---|
| `NotificationDropdown.tsx` | 🚫 Missing | Bell icon shows count but no dropdown |
| `NotificationList.tsx` | 🚫 Missing | Not implemented |

---

## 7. Route Pages

### Marketing ✅
| Route | Status |
|---|---|
| `/` (Landing) | Complete (hero + features + steps) |

### Auth
| Route | Status | Notes |
|---|---|---|
| `/login` | ✅ Complete | Google OAuth button present |
| `/signup` | ✅ Complete | Google OAuth + phone field |
| `/forgot-password` | ✅ Complete | OTP flow |
| `/reset-password` | ✅ Complete | |
| `/verify-email` | ✅ Complete | Query param handling |
| `/onboarding` | ✅ Complete | Post-Google profile form |

### Dashboard (Customer)
| Route | Status | Notes |
|---|---|---|
| `/dashboard` | ✅ Complete | Recent bookings + stats |
| `/search` | ⚠️ Partial | Results list works, StationAutoComplete not wired |
| `/trains/:trainNumber` | ⚠️ Partial | Detail view works, no seat selection |
| `/bookings` | ⚠️ Partial | Lists bookings, filters missing |
| `/bookings/:id` | ⚠️ Partial | Detail + cancel works, ticket download missing |
| `/checkout/:tripId` | 🚫 Missing | Placeholder page, full flow missing |
| `/settings` | ✅ Complete | Profile update + password change |

### Agent
| Route | Status | Notes |
|---|---|---|
| `/agent` | ✅ Complete | Stats cards (data from API) |
| `/agent/onboard` | ⚠️ Partial | Form exists, no KYC document upload |
| `/agent/requests` | ⚠️ Partial | Lists + accept works |
| `/agent/bookings` | ✅ Complete | Lists assigned bookings |
| `/agent/bookings/:bookingId` | ⚠️ Partial | PNR submit + ticket upload work |
| `/agent/stats` | ✅ Complete | Reads from API |
| `/agent/earnings` | ✅ Complete | Reads from API |
| `/agent/team` | 🚫 Missing | Placeholder form only |

### Admin
| Route | Status | Notes |
|---|---|---|
| `/admin` | ✅ Complete | Dashboard stats |
| `/admin/agents` | 🚫 Missing | Agent list not wired to real data |
| `/admin/agents/:id` | 🚫 Missing | Placeholder only |
| `/admin/bookings` | 🚫 Missing | Placeholder only |
| `/admin/bookings/:id` | 🚫 Missing | Refund placeholder |
| `/admin/users` | ⚠️ Partial | Table exists |
| `/admin/users/:id` | 🚫 Missing | Placeholder only |
| `/admin/email-templates` | 🚫 Missing | Placeholder only |

---

## 8. Animations & Polish

| Feature | Status | Notes |
|---|---|---|
| CSS variable theme | ✅ Complete | `rail` brand palette added |
| AnimationContainer | ✅ Complete | spring + reveal variants |
| reveal-variants.ts | ✅ Complete | All variants |
| ScrollMouseIndicator | ✅ Complete | |
| LoadingCurtain | ✅ Complete | |
| Lenis smooth-scroll | 🚫 Missing | Not wired into MarketingLayout |
| Route transitions | 🚫 Missing | No AnimatePresence in App.tsx |

---

## 9. Testing

| Area | Status | Notes |
|---|---|---|
| Unit tests | 🚫 Missing | All test files deleted during cleanup |
| `test/setup.ts` | 🚫 Missing | Deleted |
| `vitest.config.ts` | ✅ File exists | Config preserved |

---

## 10. Configuration

| Item | Status | Notes |
|---|---|---|
| `environments/.env` | ✅ Updated | APP_API_URL, APP_GOOGLE_CLIENT_ID |
| `environments/.env.stage` | ✅ Updated | |
| `environments/.env.prod` | ✅ Updated | |
| `package.json` | ✅ Updated | name: trip-tatkal-web |
| `index.html` | ✅ Updated | Title, OG tags |
| `.env` needs APP_GOOGLE_CLIENT_ID | ⚠️ Missing | Placeholder empty |

---

## Priority Order for Completion

### P0 (Must-have for MVP)
1. Wire `StationAutoComplete` into `TripSearchForm.tsx`
2. Build full checkout flow (passenger form → seat selection → payment)
3. Complete agent request accept → PNR submit → ticket upload flow

### P1 (Strongly recommended)
4. Implement `SeatMap` / `SeatSelector` / `CoachSelector` components
5. Restore unit tests for validation rules, query keys, utils
6. Add notification dropdown UI in DashboardTopbar
7. Wire Lenis smooth-scroll in MarketingLayout

### P2 (Nice-to-have)
8. `BookingTimeline` component for booking detail
9. Admin agents full CRUD page
10. Email template management UI
11. Agent team member CRUD
12. Remove unused deps (zod, @hookform/resolvers, cmdk)
13. Route transition animations
14. Delete `useAdjustTokens.ts` LeadFlow leftover
