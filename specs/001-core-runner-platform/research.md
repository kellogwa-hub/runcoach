# Research & Architectural Decisions: Core Runner Coach Platform MVP

**Feature Branch**: `001-core-runner-platform` | **Date**: 2026-08-23 | **Spec**: [spec.md](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/001-core-runner-platform/spec.md)

## Summary of Decisions

This document details the architectural decisions and technical research supporting the Runcoach MVP. All decisions align strictly with the Project Constitution (`.specify/memory/constitution.md`) and user requirements.

---

## 1. Frontend Framework & PWA Strategy

### Decision
Use **Next.js 14+ (App Router)** paired with `@ducanh2912/next-pwa` (or Serwist) for Progressive Web App capability, Service Worker registration, web app manifest configuration, and offline caching.

### Rationale
- **Next.js App Router**: Provides Server Components for fast initial server-side rendering (achieving the sub-3-second load time requirement) and built-in `loading.tsx` convention for skeleton UI loading states.
- **PWA Capabilities**: PWA manifest enables "Add to Home Screen" on mobile devices (iOS Safari and Android Chrome), enabling native-like app experience for Runners without app store distribution friction.
- **Service Worker Offline Caching**: Caches static assets, routes, and local draft forms so Runners can input metrics even when network connectivity drops momentarily.

### Alternatives Considered
- **Vite + React SPA**: Fast client-side rendering, but lacks unified SSR/SSG for static legal pages, SEO optimization, and server action security layer for Supabase operations.
- **Pure HTML/JS**: Lacks component modularity and modern state management needed for complex calendar drag-and-drop interactions (`dnd-kit`).

---

## 2. Backend & Data Isolation Strategy (Supabase BaaS + RLS)

### Decision
Use **Supabase** as the single Backend-as-a-Service (BaaS) providing PostgreSQL Database, Supabase Auth, Row Level Security (RLS) policies, and Realtime Subscription channels.

### Rationale
- **Supabase Auth**: Provides industry-standard password hashing (bcrypt) and session handling out of the box, fulfilling UU PDP security principles.
- **Row Level Security (RLS)**: Enforces database-level isolation. Database policies ensure that a Runner can only SELECT and INSERT their own `workout_metrics` and SELECT `workout_schedules` where `runner_id = auth.uid()`. Coaches can only view and manage runners where `coach_id = auth.uid()`.
- **Realtime Channel**: Pushes live updates to the Coach's dashboard immediately when a Runner submits a `workout_metric`.

### Data Isolation & RLS Policy Matrix

| Table | Role | Permitted Actions | Policy Rule |
| :--- | :--- | :--- | :--- |
| `profiles` | Coach | SELECT, UPDATE | Can view self and linked runners (`coach_id = auth.uid()`). Can update `coach_id` for runner email matching. |
| `profiles` | Runner | SELECT, UPDATE | Can view self and own coach. Can update own profile. |
| `workout_schedules` | Coach | SELECT, INSERT, UPDATE, DELETE | Full control over schedules where `coach_id = auth.uid()`. |
| `workout_schedules` | Runner | SELECT | Can read schedules where `runner_id = auth.uid()`. |
| `workout_metrics` | Coach | SELECT | Read-only access to metrics where `workout_schedules.coach_id = auth.uid()`. |
| `workout_metrics` | Runner | SELECT, INSERT | Full access to insert/read own metrics (`runner_id = auth.uid()`). |

---

## 3. Calendar Drag-and-Drop Library

### Decision
Use **`@dnd-kit/core`** and **`@dnd-kit/sortable`** for calendar drag-and-drop interactions on the Coach Web Dashboard.

### Rationale
- **Mandatory Constraint**: User specification explicitly forbids building drag-and-drop logic from scratch.
- **Modern React Compatibility**: `dnd-kit` is lightweight, modular, accessible (keyboard/touch support), and fully compatible with React 18+ and Next.js client components.
- **Touch & Pointer Support**: Supports both mouse drag on desktop browsers and touch drag on tablets/hybrids.

### Alternatives Considered
- **HTML5 Native Drag and Drop API**: Fragile, inconsistent touch support, and complex state synchronization.
- **React Beautiful DnD**: Deprecated by Atlassian; lacks active support for modern React 18 concurrencies.

---

## 4. UI UX & Loading Strategy (Skeleton UI)

### Decision
Implement **Skeleton UI Layout Components** using Tailwind CSS / Vanilla CSS keyframe pulse animations.

### Rationale
- **Constitution Compliance**: The project constitution strictly bans full-screen blocking spinners.
- **Perceived Performance**: Skeleton layout placeholders maintain visual stability (reducing Cumulative Layout Shift - CLS) and improve perceived speed during asynchronous Supabase data fetches, keeping overall load feel well below the 3-second limit.

---

## 5. Mobile Numpad Form Input Strategy

### Decision
Use HTML5 `<input inputmode="numeric" type="number" step="any">` on all metric input fields (distance, duration, heart rate).

### Rationale
- Triggers the native virtual numeric keyboard (numpad) on mobile devices (iOS / Android) without triggering full software keyboard layouts with letter keys.
- Ensures fast mobile metric entry for Runners (meeting SC-004: submission in under 15 seconds).
