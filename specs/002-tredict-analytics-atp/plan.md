# Implementation Plan: Pembaruan Platform LariSync - Otomasi Tredict, Kalkulator VDOT/FTHR, Periodisasi ATP & Dasbor Training Load

**Branch**: `002-tredict-analytics-atp` | **Date**: 2026-08-27 | **Spec**: [spec.md](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/002-tredict-analytics-atp/spec.md)

**Input**: Feature specification from `specs/002-tredict-analytics-atp/spec.md`

## Summary

Pembaruan platform LariSync untuk mengotomatisasi penarikan metrik latihan dari Tredict API via pemicu tombol tunggal "Sinkronkan Metrik Terbaru", melengkapi sistem dengan Kalkulator Zona Intensitas berbasis VDOT/FTHR, Kalender Periodisasi Musiman (ATP - Annual Training Plan), dan Dasbor Beban Latihan (Training Load: Fitness/CTL, Fatigue/ATL, Form/TSB) berbasis Next.js App Router, Tailwind CSS, Supabase (PostgreSQL + RLS), dan Vercel.

## Technical Context

**Language/Version**: TypeScript 5+ / Node.js 18+ (Next.js 14 App Router)

**Primary Dependencies**: Next.js 14, React 18, Tailwind CSS, `@supabase/supabase-js`, `@supabase/ssr`, `recharts`

**Storage**: Supabase (PostgreSQL) dengan Row Level Security (RLS) ketat

**Testing**: `npm run build` (Next.js type checking, linting, dan validasi skema)

**Target Platform**: Web Browser (Desktop Coach Dashboard & Mobile Runner PWA), Vercel Serverless Environment

**Project Type**: Full-stack Web Application (Next.js App Router)

**Performance Goals**: Waktu muat antarmuka <= 3 detik, kalkulasi zona VDOT < 1 detik, waktu respon sync API < 3 detik

**Constraints**: Mematuhi Konstitusi UU PDP, isolasi data RLS Supabase, UX non-blocking skeleton loading. Penegakan tegas larangan fitur Out-of-Scope (Mental Log, Biomechanics, Chat, Billing).

**Scale/Scope**: Multitenant Coach & Runner platform

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Kepatuhan UU PDP**: Encrypted storage untuk Tredict API tokens di Supabase database.
- [x] **II. Autentikasi RBAC & Isolasi RLS**: RLS diaktifkan untuk 4 tabel baru (`tredict_integrations`, `intensity_zone_profiles`, `periodization_phases`, `training_load_metrics`).
- [x] **III. Load Time <= 3s**: Dioptimalkan dengan Server Components & async fetch.
- [x] **IV. UX Non-Blocking & Skeleton Loading**: Tombol "Sinkronkan Metrik Terbaru" dengan disabled state visual, loading spinner, dan toast notification.
- [x] **V. Legal & Health Disclaimer**: Tetap mematuhi disclaimer kesehatan bawaan platform.

## Project Structure

### Documentation (this feature)

```text
specs/002-tredict-analytics-atp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    ├── tredict-sync-api.md
    └── vdot-calculator-api.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── tredict/
│   │   │   └── sync/route.ts
│   │   └── zones/
│   │       └── calculate/route.ts
│   ├── dashboard/
│   │   ├── zones/page.tsx
│   │   ├── periodization/page.tsx
│   │   └── training-load/page.tsx
├── components/
│   ├── coach/
│   │   ├── VdotCalculator.tsx
│   │   ├── AtpCalendar.tsx
│   │   └── TrainingLoadChart.tsx
│   └── common/
│       └── TredictSyncButton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── tredict.ts
│   └── vdot.ts
└── types/
    └── index.ts
```

**Structure Decision**: Single Next.js 14 App Router project (Option 1) memperluas struktur `src/` yang sudah ada di repositori `runcoach`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**
> *Tidak ada pelanggaran Konstitusi. Seluruh arsitektur mematuhi aturan platform.*
