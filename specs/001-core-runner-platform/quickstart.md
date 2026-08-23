# Quickstart & Verification Guide: Core Runner Coach Platform MVP

**Feature Branch**: `001-core-runner-platform` | **Date**: 2026-08-23 | **Spec**: [spec.md](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/001-core-runner-platform/spec.md)

## Development Setup & Verification Scenarios

This guide provides step-by-step instructions to set up the local environment and verify end-to-end functionality for the Runcoach MVP.

---

## 1. Prerequisites & Environment Setup

### Prerequisites
- Node.js v18.x or v20.x
- npm v9+ or pnpm
- Supabase Account & Project (or local Supabase CLI setup)
- Vercel CLI / Account

### Environment Variables (`.env.local`)
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # For backend server migrations only, NEVER expose to client
```

### Initial Commands
```bash
# Install dependencies
npm install

# Run database schema migration on Supabase SQL Editor
# Paste content from specs/001-core-runner-platform/contracts/supabase-schema.sql

# Start development server
npm run dev
```

---

## 2. Verification Scenarios

### Scenario 1: User Registration & Role Selection Onboarding
1. Open `http://localhost:3000/auth/signup` in browser.
2. Register two test accounts:
   - `coach1@example.com` (Password: `password123`)
   - `runner1@example.com` (Password: `password123`)
3. **Verify Onboarding**:
   - Upon signing up `coach1@example.com`, verify browser redirects to `/onboarding/role`.
   - Click "Saya Pelatih" (Coach). Verify redirect to `/dashboard`.
   - Upon signing up `runner1@example.com`, select "Saya Pelari" (Runner). Verify redirect to `/pwa/home`.
   - Verify pressing browser Back button does not allow bypassing role selection.

---

### Scenario 2: Runner Link via Coach Dashboard
1. Log in as `coach1@example.com` at `http://localhost:3000/auth/login`.
2. Click "Tambah Pelari" button on the dashboard header.
3. Input `runner1@example.com` in the modal input field and click "Tautkan Akun".
4. **Expected Outcome**:
   - Modal closes automatically.
   - `runner1@example.com` appears in the Coach's client list without a full page reload.

---

### Scenario 3: PWA Unlinked vs Linked State for Runner
1. Open Chrome DevTools (F12) -> Mobile View (e.g. iPhone 14 Pro).
2. Log in as `runner1@example.com`.
3. **Before Linking**: Verify the Empty State screen displays: *"Menunggu pelatih menautkan akun Anda."* Calendar & metric forms are hidden.
4. **After Linking (from Scenario 2)**: Refresh or view PWA home page. Verify today's workout schedule card is now visible.

---

### Scenario 4: Coach Drag-and-Drop Calendar Schedule Creation & Editing (`dnd-kit`)
1. In Coach Dashboard (`/dashboard`), select `runner1@example.com`.
2. Drag a workout template block (e.g., "Easy Run 5K") from the side panel and drop it onto tomorrow's calendar cell using `dnd-kit`.
3. **Expected Outcome**: Schedule block displays on the calendar cell and persists in Supabase database.
4. Drag the scheduled block to a different calendar date. Verify date update is saved immediately.

---

### Scenario 5: Runner Metric Submission with Numpad Input & Realtime Sync
1. Open Runner PWA on mobile view (`http://localhost:3000/pwa/home`).
2. Click on today's workout schedule card to open the Metric Form.
3. Click distance/duration input fields. **Verify** attributes include `inputmode="numeric"`.
4. Enter `distance_km = 5.0`, `duration_minutes = 27.5`, `heart_rate_bpm = 145`, and click "Simpan".
5. **Expected Outcome**:
   - Form saves and marks schedule as completed.
   - Coach Dashboard (open in desktop browser window) displays the new metric submission in real-time via Supabase Realtime channel.

---

### Scenario 6: Skeleton Loading & Performance Verification
1. Open Chrome DevTools -> Network -> Throttling -> Set to "Fast 3G".
2. Navigate between pages in Coach Dashboard and Runner PWA.
3. **Expected Outcome**:
   - Skeleton layout placeholders appear instantly during data fetch.
   - NO full-screen blocking spinners appear.
   - Navigation completes and settles in under 3 seconds.

---

### Scenario 7: Static Legal Pages & Medical Disclaimer
1. Navigate to `http://localhost:3000/terms` and `http://localhost:3000/privacy`.
2. **Verify**: Pages load statically, displaying Terms of Service and Privacy Policy with explicit health/medical disclaimer sections.
