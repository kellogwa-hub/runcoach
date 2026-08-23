import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { runner_email } = await request.json();

    if (!runner_email) {
      return NextResponse.json(
        { error: 'Email pelari wajib diisi.' },
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

    // Verify coach profile
    const { data: coachProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (coachProfile?.role !== 'coach') {
      return NextResponse.json(
        { error: 'Hanya pelatih yang dapat menautkan akun pelari.' },
        { status: 403 }
      );
    }

    // Find runner profile by email
    const { data: runnerProfile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', runner_email.trim().toLowerCase())
      .eq('role', 'runner')
      .single();

    if (findError || !runnerProfile) {
      return NextResponse.json(
        { error: 'Akun pelari dengan email tersebut tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Update runner profile with coach_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coach_id: user.id })
      .eq('id', runnerProfile.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      runner: {
        ...runnerProfile,
        coach_id: user.id,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
