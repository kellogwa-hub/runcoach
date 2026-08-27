export interface TredictPlannedWorkout {
  id?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string;
  notes?: string;
  sportType?: 'running' | 'cycling' | 'swimming' | 'misc';
  distance?: number; // meters
  duration?: number; // seconds
}

export interface TredictActivity {
  id: string;
  date: string;
  sportType: string;
  title?: string;
  distance?: number; // meters
  duration?: number; // seconds
  averageHeartRate?: number; // bpm
}

const TREDICT_BASE_URL = 'https://www.tredict.com/api';

/**
 * Get Tredict Authorization header using configured environment token.
 */
function getHeaders(): Record<string, string> {
  const token = process.env.TREDICT_API_TOKEN;
  if (!token) {
    throw new Error('TREDICT_API_TOKEN is not defined in environment variables');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

/**
 * Fetch planned workouts from Tredict.
 */
export async function getTredictPlannedWorkouts(params?: {
  startDate?: string;
  endDate?: string;
  sportType?: string;
}): Promise<TredictPlannedWorkout[]> {
  try {
    const url = new URL(`${TREDICT_BASE_URL}/planned-workout/list`);
    if (params?.startDate) url.searchParams.append('startDate', params.startDate);
    if (params?.endDate) url.searchParams.append('endDate', params.endDate);
    if (params?.sportType) url.searchParams.append('sportType', params.sportType);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Tredict API] Failed to fetch planned workouts: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.plannedWorkoutList || [];
  } catch (error) {
    console.error('[Tredict API Error]', error);
    return [];
  }
}

/**
 * Create a new planned workout session in Tredict.
 */
export async function createTredictPlannedWorkout(
  workout: TredictPlannedWorkout
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch(`${TREDICT_BASE_URL}/planned-workout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        date: workout.date,
        title: workout.title,
        notes: workout.notes || '',
        sportType: workout.sportType || 'running',
        distance: workout.distance,
        duration: workout.duration,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText || res.statusText };
    }

    const result = await res.json();
    return { success: true, id: result.id || result.workoutId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Tredict creation',
    };
  }
}

/**
 * Fetch recorded activities from Tredict.
 */
export async function getTredictActivities(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<TredictActivity[]> {
  try {
    const url = new URL(`${TREDICT_BASE_URL}/activity/list`);
    if (params?.startDate) url.searchParams.append('startDate', params.startDate);
    if (params?.endDate) url.searchParams.append('endDate', params.endDate);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Tredict API] Failed to fetch activities: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.activityList || [];
  } catch (error) {
    console.error('[Tredict API Error]', error);
    return [];
  }
}
