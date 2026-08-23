import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    if (!role || (role !== 'coach' && role !== 'runner')) {
      return NextResponse.json(
        { error: 'Peran pengguna tidak valid.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Sesi pengguna tidak ditemukan.' },
        { status: 401 }
      );
    }

    const full_name = user.user_metadata?.full_name || 'Pengguna';

    // Upsert profile with selected role
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email!,
        full_name,
        role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const redirectPath = role === 'coach' ? '/dashboard' : '/pwa/home';

    return NextResponse.json({
      success: true,
      role,
      redirect: redirectPath,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
