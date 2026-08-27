export type UserRole = 'coach' | 'runner';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  coach_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSchedule {
  id: string;
  coach_id: string;
  runner_id: string;
  title: string;
  description?: string | null;
  scheduled_date: string; // YYYY-MM-DD
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutMetric {
  id: string;
  schedule_id: string;
  runner_id: string;
  distance_km: number;
  duration_minutes: number;
  heart_rate_bpm?: number | null;
  notes?: string | null;
  submitted_at: string;
}

export interface LinkRunnerResponse {
  success: boolean;
  runner?: UserProfile;
  error?: string;
}

export interface TredictIntegration {
  id: string;
  user_id: string;
  encrypted_api_token: string;
  connection_status: 'connected' | 'error' | 'disconnected';
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PaceZoneName = 'E' | 'M' | 'T' | 'I' | 'R';

export interface PaceZoneDetail {
  name: string;
  minPace: string;
  maxPace: string;
  unit: string;
}

export interface HrZoneDetail {
  name: string;
  minHr: number;
  maxHr: number;
  unit: string;
}

export interface IntensityZoneProfile {
  id: string;
  runner_id: string;
  vdot?: number | null;
  fthr?: number | null;
  pace_zones: Record<PaceZoneName, PaceZoneDetail>;
  hr_zones: Record<string, HrZoneDetail>;
  created_at: string;
  updated_at: string;
}

export type AtpPhaseName = 'Prep' | 'Base' | 'Build' | 'Peak' | 'Race' | 'Transition';

export interface PeriodizationPhase {
  id: string;
  runner_id: string;
  coach_id: string;
  year: number;
  week_number: number;
  phase_name: AtpPhaseName;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingLoadMetric {
  id: string;
  runner_id: string;
  date: string;
  tss: number;
  ctl: number; // Chronic Training Load (Fitness)
  atl: number; // Acute Training Load (Fatigue)
  tsb: number; // Training Stress Balance (Form)
  source: 'tredict' | 'manual';
  created_at: string;
}

