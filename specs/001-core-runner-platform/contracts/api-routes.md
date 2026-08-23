# API & Server Actions Contract: Core Runner Coach Platform MVP

**Feature Branch**: `001-core-runner-platform` | **Date**: 2026-08-23 | **Spec**: [spec.md](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/001-core-runner-platform/spec.md)

## Interface Overview

Runcoach MVP utilizes Next.js Server Actions and Supabase Client SDK over HTTPS and WebSockets (Supabase Realtime). All requests pass through Supabase RLS.

---

## 1. Authentication & Onboarding Contracts

### `POST /api/auth/role-selection`
Sets the user role (`coach` or `runner`) during mandatory onboarding.

**Payload**:
```json
{
  "role": "coach" // or "runner"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "role": "coach",
  "redirect": "/dashboard" // "/pwa/home" for runner
}
```

---

## 2. Coach Management Contracts

### `POST /api/coach/link-runner`
Links a Runner to the logged-in Coach by runner email.

**Payload**:
```json
{
  "runner_email": "runner@example.com"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "runner": {
    "id": "uuid-runner-123",
    "full_name": "Budi Santoso",
    "email": "runner@example.com"
  }
}
```

**Error (404 Not Found)**:
```json
{
  "error": "Akun pelari dengan email tersebut tidak ditemukan."
}
```

---

### `POST /api/schedules/create`
Creates a workout schedule block for a runner.

**Payload**:
```json
{
  "runner_id": "uuid-runner-123",
  "title": "Easy Run 5K",
  "description": "Pace 6:00 min/km, HR Zone 2",
  "scheduled_date": "2026-08-25"
}
```

---

### `PATCH /api/schedules/reschedule`
Updates a schedule's date via `dnd-kit` drag-and-drop.

**Payload**:
```json
{
  "schedule_id": "uuid-schedule-456",
  "new_date": "2026-08-27"
}
```

---

## 3. Runner PWA Contracts

### `GET /api/runner/today-schedule`
Fetches today's workout schedule for the authenticated runner.

**Response (200 OK)**:
```json
{
  "has_coach": true,
  "schedule": {
    "id": "uuid-schedule-456",
    "title": "Easy Run 5K",
    "description": "Pace 6:00 min/km, HR Zone 2",
    "scheduled_date": "2026-08-25",
    "is_completed": false
  }
}
```

**Response (200 OK - Unlinked Runner)**:
```json
{
  "has_coach": false,
  "schedule": null,
  "message": "Menunggu pelatih menautkan akun Anda."
}
```

---

### `POST /api/runner/submit-metric`
Submits workout execution metrics for a schedule item.

**Payload**:
```json
{
  "schedule_id": "uuid-schedule-456",
  "distance_km": 5.20,
  "duration_minutes": 29.15,
  "heart_rate_bpm": 142,
  "notes": "Kondisi fisik segar, cuaca cerah."
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "metric_id": "uuid-metric-789"
}
```

---

## 4. Realtime Channels

### Channel: `coach_metrics_channel`
- **Subscribe Target**: Table `workout_metrics` FILTER `schedule_id IN (coaches_schedules)`
- **Event**: `INSERT`
- **Payload**: Full `workout_metrics` row. Automatically triggers UI toast notification and metric update on Coach Dashboard.
