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
