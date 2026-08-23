import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { schedule_id, distance_km, duration_minutes, heart_rate_bpm, notes } =
      await request.json();

    if (!schedule_id || distance_km === undefined || duration_minutes === undefined) {
      return NextResponse.json(
        { error: 'Schedule ID, Jarak, dan Durasi Waktu wajib diisi.' },
        { status: 400 }
      );
    }

    if (Number(distance_km) < 0 || Number(duration_minutes) < 0) {
      return NextResponse.json(
        { error: 'Jarak dan durasi tidak boleh bernilai negatif.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }

    // Insert workout metric into database
    const { data: metric, error: metricError } = await supabase
      .from('workout_metrics')
      .insert({
        schedule_id,
        runner_id: user.id,
        distance_km: Number(distance_km),
        duration_minutes: Number(duration_minutes),
        heart_rate_bpm: heart_rate_bpm ? Number(heart_rate_bpm) : null,
        notes: notes || null,
      })
      .select('*')
      .single();

    if (metricError) {
      return NextResponse.json({ error: metricError.message }, { status: 500 });
    }

    // Update schedule completed status
    await supabase
      .from('workout_schedules')
      .update({ is_completed: true, updated_at: new Date().toISOString() })
      .eq('id', schedule_id)
      .eq('runner_id', user.id);

    return NextResponse.json({ success: true, metric });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
