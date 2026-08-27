-- Migration: 20260827_tredict_analytics_atp.sql
-- Feature: Pembaruan Platform LariSync - Otomasi Tredict, VDOT/FTHR, Periodisasi ATP & Training Load

-- 1. Tabel Tredict Integrations
CREATE TABLE IF NOT EXISTS public.tredict_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_api_token TEXT NOT NULL,
    connection_status VARCHAR(50) NOT NULL DEFAULT 'connected',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_tredict UNIQUE (user_id)
);

-- 2. Tabel Intensity Zone Profiles
CREATE TABLE IF NOT EXISTS public.intensity_zone_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    runner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vdot NUMERIC(4, 1),
    fthr INTEGER,
    pace_zones JSONB NOT NULL DEFAULT '{}'::jsonb,
    hr_zones JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_runner_zones UNIQUE (runner_id)
);

-- 3. Tabel Periodization Phases (ATP Calendar)
CREATE TABLE IF NOT EXISTS public.periodization_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    runner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    week_number INTEGER NOT NULL,
    phase_name VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_runner_week_year UNIQUE (runner_id, year, week_number)
);

-- 4. Tabel Training Load Metrics
CREATE TABLE IF NOT EXISTS public.training_load_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    runner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tss NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
    ctl NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
    atl NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
    tsb NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
    source VARCHAR(50) NOT NULL DEFAULT 'tredict',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_runner_load_date UNIQUE (runner_id, date)
);

-- Active RLS on all 4 new tables
ALTER TABLE public.tredict_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_zone_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periodization_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_load_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tredict_integrations
CREATE POLICY "Users can manage their own Tredict integration"
ON public.tredict_integrations
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for intensity_zone_profiles
CREATE POLICY "Runners and Coaches can read zone profiles"
ON public.intensity_zone_profiles
FOR SELECT
USING (
    auth.uid() = runner_id OR
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = intensity_zone_profiles.runner_id
        AND p.coach_id = auth.uid()
    )
);

CREATE POLICY "Runners and Coaches can write zone profiles"
ON public.intensity_zone_profiles
FOR ALL
USING (
    auth.uid() = runner_id OR
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = intensity_zone_profiles.runner_id
        AND p.coach_id = auth.uid()
    )
);

-- RLS Policies for periodization_phases
CREATE POLICY "Runners and Coaches can read ATP phases"
ON public.periodization_phases
FOR SELECT
USING (
    auth.uid() = runner_id OR
    auth.uid() = coach_id
);

CREATE POLICY "Coaches can manage ATP phases for their runners"
ON public.periodization_phases
FOR ALL
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);

-- RLS Policies for training_load_metrics
CREATE POLICY "Runners and Coaches can view training load metrics"
ON public.training_load_metrics
FOR SELECT
USING (
    auth.uid() = runner_id OR
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = training_load_metrics.runner_id
        AND p.coach_id = auth.uid()
    )
);

CREATE POLICY "System and Coaches can insert/update training load metrics"
ON public.training_load_metrics
FOR ALL
USING (
    auth.uid() = runner_id OR
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = training_load_metrics.runner_id
        AND p.coach_id = auth.uid()
    )
);
