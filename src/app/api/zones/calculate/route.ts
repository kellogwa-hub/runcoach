import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculatePaceZones, calculateHrZones } from '@/lib/vdot';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { vdot, fthr, runnerId } = body;

    // Boundary validation
    if (vdot !== undefined && (vdot < 15 || vdot > 85)) {
      return NextResponse.json(
        { error: 'Nilai VDOT harus berada di antara 15.0 dan 85.0' },
        { status: 400 }
      );
    }

    if (fthr !== undefined && (fthr < 100 || fthr > 220)) {
      return NextResponse.json(
        { error: 'Nilai FTHR harus berada di antara 100 dan 220 bpm' },
        { status: 400 }
      );
    }

    const targetVdot = vdot || 45.0;
    const targetFthr = fthr || 165;

    const paceZones = calculatePaceZones(targetVdot);
    const hrZones = calculateHrZones(targetFthr);

    const targetRunnerId = runnerId || user?.id;

    if (targetRunnerId) {
      await supabase.from('intensity_zone_profiles').upsert(
        {
          runner_id: targetRunnerId,
          vdot: targetVdot,
          fthr: targetFthr,
          pace_zones: paceZones,
          hr_zones: hrZones,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'runner_id' }
      );
    }

    return NextResponse.json({
      success: true,
      vdot: targetVdot,
      fthr: targetFthr,
      paceZones,
      hrZones,
    });
  } catch (error) {
    console.error('[Zone Calculate Route Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghitung zona intensitas' },
      { status: 500 }
    );
  }
}
