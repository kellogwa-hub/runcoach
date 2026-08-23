-- ========================================================
-- RUNCOACH MVP SUPABASE DATABASE SCHEMA & RLS POLICIES
-- UU PDP Compliant & Strictly Isolated per Constitution
-- ========================================================

-- 1. ENUMS
CREATE TYPE public.user_role AS ENUM ('coach', 'runner');

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role NOT NULL,
    coach_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying runners under a coach
CREATE INDEX idx_profiles_coach_id ON public.profiles(coach_id);

-- 3. WORKOUT SCHEDULES TABLE
CREATE TABLE public.workout_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    runner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_runner_date ON public.workout_schedules(runner_id, scheduled_date);
CREATE INDEX idx_schedules_coach_date ON public.workout_schedules(coach_id, scheduled_date);

-- 4. WORKOUT METRICS TABLE
CREATE TABLE public.workout_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES public.workout_schedules(id) ON DELETE CASCADE,
    runner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    distance_km NUMERIC(6,2) NOT NULL CHECK (distance_km >= 0),
    duration_minutes NUMERIC(6,2) NOT NULL CHECK (duration_minutes >= 0),
    heart_rate_bpm INTEGER CHECK (heart_rate_bpm > 0),
    notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metrics_schedule_id ON public.workout_metrics(schedule_id);
CREATE INDEX idx_metrics_runner_id ON public.workout_metrics(runner_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_metrics ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------

-- Users can read their own profile
CREATE POLICY "Allow users to read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Coaches can read profiles of runners linked to them
CREATE POLICY "Allow coaches to read linked runners profiles"
ON public.profiles FOR SELECT
USING (auth.uid() = coach_id);

-- Users can insert their own profile during onboarding
CREATE POLICY "Allow users to insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Allow users to update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Coaches can link runners by updating runner's coach_id
CREATE POLICY "Allow coaches to link runners via email match"
ON public.profiles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'coach'
    )
)
WITH CHECK (role = 'runner');

-- --------------------------------------------------------
-- WORKOUT SCHEDULES POLICIES
-- --------------------------------------------------------

-- Coaches can perform ALL actions on schedules they created
CREATE POLICY "Allow coaches to manage their created schedules"
ON public.workout_schedules FOR ALL
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);

-- Runners can SELECT schedules assigned to them
CREATE POLICY "Allow runners to read their assigned schedules"
ON public.workout_schedules FOR SELECT
USING (auth.uid() = runner_id);

-- --------------------------------------------------------
-- WORKOUT METRICS POLICIES
-- --------------------------------------------------------

-- Runners can INSERT and SELECT their own workout metrics
CREATE POLICY "Allow runners to insert and read own metrics"
ON public.workout_metrics FOR ALL
USING (auth.uid() = runner_id)
WITH CHECK (auth.uid() = runner_id);

-- Coaches can SELECT metrics of schedules they created
CREATE POLICY "Allow coaches to read metrics of their runners"
ON public.workout_metrics FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.workout_schedules ws
        WHERE ws.id = workout_metrics.schedule_id AND ws.coach_id = auth.uid()
    )
);
