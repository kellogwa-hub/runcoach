import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const { schedule_id, new_date } = await request.json();

    if (!schedule_id || !new_date) {
      return NextResponse.json(
        { error: 'Schedule ID dan Tanggal Baru wajib diisi.' },
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
      .update({
        scheduled_date: new_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schedule_id)
      .eq('coach_id', user.id)
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
