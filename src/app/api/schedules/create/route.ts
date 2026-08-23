import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { runner_id, title, description, scheduled_date } = await request.json();

    if (!runner_id || !title || !scheduled_date) {
      return NextResponse.json(
        { error: 'Runner ID, Judul, dan Tanggal wajib diisi.' },
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

    const { data: schedule, error } = await supabase
      .from('workout_schedules')
      .insert({
        coach_id: user.id,
        runner_id,
        title,
        description: description || null,
        scheduled_date,
        is_completed: false,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, schedule });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
