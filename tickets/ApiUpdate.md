---

# Frontend Changes Required — ConfirmTkt Integration

This section describes the changes frontend consumers must make to work with the updated API responses. The backend changes are live after deploying the ConfirmTkt integration.

## 1. Train Search — `GET /trains/search`

**What changed:** The response type changed from `CustomTrainModel[]` to `CustomTrainSearchResult[]`. The new type **extends** the old one — all existing fields remain identical — but adds several new fields.

**New fields on each train object:**

| Field | Type | Description |
|---|---|---|
| `class_availability` | `CustomClassAvailability[]` | Per-class + per-quota availability, fare, and prediction data (empty `[]` on fallback paths) |
| `travel_duration_minutes` | `number \| null` | Travel duration in minutes alongside the existing `travel_duration_tt` string |
| `has_pantry` | `boolean` | Whether the train has a pantry car |
| `is_tejas` | `boolean` | Whether the train is a Tejas service |
| `train_rating` | `number \| null` | User rating (1–5) |

**Key detail — `class_availability` array shape:**

```typescript
interface CustomClassAvailability {
  travel_class_code: string;             // e.g. "1A", "2A", "3A", "SL"
  quota_code: string;                    // "GN" = General, "TQ" = Tatkal
  availability_status_text: string;      // e.g. "RLWL13/WL11", "NOT AVAILABLE"
  availability_display_label: string;    // e.g. "WL 11", "AVAILABLE-0018"
  is_bookable: boolean;                  // false when closed (fare=0 + NOT AVAILABLE)
  fare_amount: number;                   // Fare in INR
  booking_prediction_percentage: number | null; // 0–100 booking chance
  data_timestamp: string | null;         // ISO timestamp of cache
}
```

**Frontend action items:**
- Display class-wise availability and fare from `class_availability[]` — prefer this over any hardcoded/seed data.
- Use `is_bookable` to grey out unavailable class+quota combinations.
- Show `booking_prediction_percentage` as a booking-chance indicator.
- Handle `class_availability.length === 0` gracefully — it means the result came from the RapidAPI or MongoDB fallback (no availability data for that provider).

**Date format note:** The `date` query parameter now accepts **DD-MM-YYYY** (native to ConfirmTkt) as well as the legacy YYYY-MM-DD. The backend converts ISO dates automatically. If your frontend UI collects dates in YYYY-MM-DD, it will continue to work — no change needed.

## 2. New Endpoint — `GET /trains/availability-calendar`

**Purpose:** Get daily availability states for a route over a date range.

**Query parameters:**

| Param | Required | Format | Default | Description |
|---|---|---|---|---|
| `source` | Yes | Station code (e.g. `NDLS`) | — | Origin station |
| `destination` | Yes | Station code (e.g. `MMCT`) | — | Destination station |
| `startDate` | Yes | `DD-MM-YYYY` | — | Start date (⚠️ **not** ISO format) |
| `days` | No | Integer | `16` | Number of days (max 30) |

**Response shape:**

```typescript
interface CustomAvailabilityCalendar {
  days: CustomAvailabilityCalendarDay[];
  train_identifier_id: string;     // empty string when train-agnostic
  origin_station_code: string;
  destination_station_code: string;
}

interface CustomAvailabilityCalendarDay {
  calendar_date: string;           // "DD-MM-YYYY"
  availability_state: "Available" | "FillingFast" | "FewSeats" | "Unknown";
  display_title: string | null;    // "Available", "Filling Fast", etc.
  accent_color_hex: string | null; // hex colour for UI rendering
}
```

**Frontend action items:**
- Use the `availability_state` enum to render coloured indicators per date.
- Use `accent_color_hex` for colour cues (but fall back to your own mapping if null).
- Map `Unknown` state to a muted/grey appearance — it means no data for that date.
- The `startDate` must be in DD-MM-YYYY format (enforced by validator; ISO dates will be rejected with 400).

## 3. Availability Calendar UI Concept

The calendar endpoint is designed to power a date-picker or availability heatmap:

```
Available    → Green  (#1D7D3D) — Seats are bookable
FillingFast  → Amber  (#D48002) — Limited seats remaining
FewSeats     → Orange (#965B02) — Very few seats left
Unknown      → Grey   (#FFFFFF) — No data / hidden
```

If you don't want to use the provider's colour codes, you can map states to your own design system colours.

## 4. No Changes Needed For

- **PNR status endpoint** — `agent.service.ts` unchanged, response schema same as before.
- **Train detail** (`GET /trains/:trainNumber`) — unchanged.
- **Live tracking**, **station board**, **nearby stations** — all unchanged.