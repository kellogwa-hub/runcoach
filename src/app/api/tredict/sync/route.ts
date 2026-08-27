import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTredictPlannedWorkouts, createTredictPlannedWorkout, getTredictActivities } from '@/lib/tredict';

export async function POST() {
  try {
    const supabase = await createClient();

    // Check user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Silakan login terlebih dahulu' }, { status: 401 });
    }

    // Fetch existing Tredict planned workouts
    const tredictWorkouts = await getTredictPlannedWorkouts();
    const tredictActivities = await getTredictActivities();

    // Sync local schedules if table exists
    const { data: schedules } = await supabase
      .from('workout_schedules')
      .select('*')
      .eq('coach_id', user.id);

    let syncedCount = 0;
    if (schedules && schedules.length > 0) {
      for (const schedule of schedules) {
        const alreadyExists = tredictWorkouts.some(
          (tw) => tw.title === schedule.title && tw.date === schedule.scheduled_date
        );

        if (!alreadyExists) {
          const res = await createTredictPlannedWorkout({
            date: schedule.scheduled_date,
            title: schedule.title || 'Latihan Lari',
            notes: schedule.description || '',
            sportType: 'running',
          });

          if (res.success) {
            syncedCount++;
          }
        }
      }
    }

    // Upsert integration status in Supabase
    await supabase.from('tredict_integrations').upsert(
      {
        user_id: user.id,
        encrypted_api_token: 'env-configured',
        connection_status: 'connected',
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    return NextResponse.json({
      success: true,
      syncedCount,
      tredictTotal: tredictWorkouts.length,
      activitiesTotal: tredictActivities.length,
      lastSyncedAt: new Date().toISOString(),
      message: `Berhasil menyinkronkan ${syncedCount} jadwal latihan & ${tredictActivities.length} aktivitas dari Tredict!`,
    });
  } catch (error) {
    console.error('[Sync Route Error]', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Terjadi gangguan jaringan / Tredict API downtime',
      },
      { status: 500 }
    );
  }
}
