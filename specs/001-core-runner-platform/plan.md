# Implementation Plan: Core Runner Coach Platform MVP

**Branch**: `001-core-runner-platform` | **Date**: 2026-08-23 | **Spec**: [spec.md](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/001-core-runner-platform/spec.md)

**Input**: Feature specification from [`specs/001-core-runner-platform/spec.md`](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/001-core-runner-platform/spec.md) and technical stack directives (Next.js, Supabase, Vercel, PWA, GitHub).

## Summary

The Runcoach MVP is a Progressive Web App (PWA) built with **Next.js 14+ (App Router)** and **Supabase (PostgreSQL, Auth, RLS, Realtime)**. It connects running coaches and runners, enabling coaches to manage runners and schedule workouts via a calendar interface built with **`dnd-kit`**, while runners report daily workout metrics via a mobile PWA using numpad input elements (`inputmode="numeric"`). The application strictly adheres to the UU PDP regulations, Supabase RLS data isolation, sub-3-second load time, non-blocking skeleton UI loading, and static legal pages with medical disclaimers.

---

## Technical Context

**Language/Version**: TypeScript / Node.js v18+ (Next.js 14+ App Router)

**Primary Dependencies**: Next.js (`next`), React (`react`), Supabase JS SDK (`@supabase/supabase-js`, `@supabase/ssr`), `@dnd-kit/core`, `@dnd-kit/sortable`, `@ducanh2912/next-pwa` (Service Worker PWA manager), Lucide Icons (`lucide-react`)

**Storage**: Supabase PostgreSQL BaaS with Row Level Security (RLS) policies

**Testing**: Playwright (E2E), Vitest (Unit/Contract)

**Target Platform**: Web Browsers (Desktop Web Dashboard) & Mobile PWA (iOS Safari / Android Chrome Add to Home Screen)

**Deployment & Hosting**: Vercel (PWA Next.js deployment) & GitHub (Version Control)

**Project Type**: Full-stack Web Application / PWA

**Performance Goals**: Navigation load time <= 3s; Skeleton UI loading placeholders for zero CLS

**Constraints**: UU PDP compliance, password hashing & metric encryption, RLS data isolation per user, strictly NO Payments/Chat/GPS Live Tracking

**Scale/Scope**: MVP (Coach & Runner roles, calendar scheduling, metric reporting)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Status | Compliance Details |
| :--- | :---: | :--- |
| **I. UU PDP & Security** | **PASS** | Supabase Auth handles bcrypt password hashing. Data metrics protected by HTTPS & Supabase BaaS. |
| **II. Supabase RBAC & RLS** | **PASS** | `user_role` enum (`coach`/`runner`) in `profiles`. RLS policies enforce runner metric data isolation strictly. |
| **III. Load Time <= 3s** | **PASS** | Next.js Server Components, static page generation, asset compression, and Vercel CDN edge delivery. |
| **IV. Skeleton Loading UI** | **PASS** | Next.js `loading.tsx` and custom Skeleton components replace full-screen blocking spinners completely. |
| **V. Legal & Medical Disclaimer** | **PASS** | Static routes `/terms` and `/privacy` created with explicit health/medical disclaimer sections. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-core-runner-platform/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 architectural & tech research
├── data-model.md        # Phase 1 data schema & entity relationships
├── quickstart.md        # Phase 1 setup & end-to-end verification guide
└── contracts/           # Phase 1 system interface contracts
    ├── supabase-schema.sql # Database DDL & RLS policies
    └── api-routes.md       # Server actions & REST/Realtime endpoints
```

### Source Code (Next.js App Router Monorepo Structure)

```text
runcoach/
├── public/
│   ├── manifest.json            # PWA Web App Manifest
│   ├── icons/                   # PWA icons (192x192, 512x512)
│   └── sw.js                    # Generated Service Worker
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with PWA meta tags & Providers
│   │   ├── page.tsx             # Landing / Auth Redirect Page
│   │   ├── loading.tsx          # Root Skeleton UI loading fallback
│   │   ├── auth/
│   │   │   ├── login/page.tsx   # Login page
│   │   │   └── signup/page.tsx  # Sign up page
│   │   ├── onboarding/
│   │   │   └── role/page.tsx    # Role Selection (Coach/Runner) page
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Coach Web Dashboard (Calendar & Runner List)
│   │   │   └── loading.tsx      # Dashboard Skeleton UI
│   │   ├── pwa/
│   │   │   ├── home/page.tsx    # Runner PWA Home (Daily Workout Card / Empty State)
│   │   │   └── metrics/page.tsx # Runner Metric Input Form
│   │   ├── terms/page.tsx       # Static Terms of Service with Medical Disclaimer
│   │   └── privacy/page.tsx     # Static Privacy Policy
│   ├── components/
│   │   ├── ui/                  # Reusable UI components (Modal, Button, Input, Skeleton)
│   │   ├── coach/
│   │   │   ├── Calendar.tsx     # Calendar component powered by dnd-kit
│   │   │   ├── RunnerModal.tsx  # Link Runner by email modal
│   │   │   └── ScheduleBlock.tsx# Draggable workout block
│   │   └── runner/
│   │       ├── MetricForm.tsx   # Input form with inputmode="numeric"
│   │       └── EmptyState.tsx   # Unlinked runner empty state screen
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Client-side Supabase client
│   │   │   ├── server.ts        # Server-side Supabase client (@supabase/ssr)
│   │   │   └── middleware.ts    # Session & RBAC Route Protection Middleware
│   │   └── utils.ts             # Date formatting & helper utilities
│   └── types/
│       └── index.ts             # TypeScript definitions matching data-model.md
├── next.config.mjs              # Next.js configuration with PWA wrapper
├── tailwind.config.js           # Styling tokens & animations
└── package.json                 # Node dependencies
```

**Structure Decision**: Standard Next.js 14+ App Router single web application structure (`src/app/`), supporting both Desktop Web Dashboard routes (`/dashboard`) and Mobile PWA routes (`/pwa/`).

---

## Complexity Tracking

> **No Constitution violations. No complex workarounds required.**
