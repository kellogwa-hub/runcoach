'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { WorkoutSchedule } from '@/types';
import EmptyState from '@/components/runner/EmptyState';
import MetricForm from '@/components/runner/MetricForm';
import Link from 'next/link';

export default function RunnerPwaHomePage() {
  const [profileName, setProfileName] = useState('');
  const [coachId, setCoachId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<WorkoutSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const supabase = createClient();

  const fetchProfileAndSchedule = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, coach_id')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfileName(profile.full_name);
        setCoachId(profile.coach_id);

        if (profile.coach_id) {
          const today = new Date().toISOString().split('T')[0];
          const { data: schedData } = await supabase
            .from('workout_schedules')
            .select('*')
            .eq('runner_id', user.id)
            .eq('scheduled_date', today)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (schedData) {
            setSchedule(schedData as WorkoutSchedule);
          }
        }
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProfileAndSchedule();
  }, [fetchProfileAndSchedule]);

  const handleMetricSuccess = () => {
    setShowForm(false);
    setSuccessMsg(true);
    if (schedule) {
      setSchedule({ ...schedule, is_completed: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 flex flex-col justify-center items-center">
        <div className="h-12 w-12 bg-green-500 rounded-full animate-bounce mb-3"></div>
        <div className="text-xs text-slate-500 font-medium">Memuat jadwal lari...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Mobile Top App Bar */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-black text-lg tracking-wider bg-white text-green-700 px-2 py-0.5 rounded-lg">
            RC
          </span>
          <span className="font-extrabold text-base">Aplikasi Pelari</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold block">{profileName}</span>
          <span className="text-[10px] text-green-100">Pelari</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        {!coachId ? (
          <EmptyState />
        ) : (
          <>
            {successMsg && (
              <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg text-center font-bold text-sm">
                🎉 Metrik Latihan Berhasil Dikirimkan Ke Pelatih Anda!
              </div>
            )}

            {/* Daily Schedule Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Jadwal Hari Ini ({new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })})
                </span>
                {schedule?.is_completed && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Selesai
                  </span>
                )}
              </div>

              {schedule ? (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{schedule.title}</h2>
                  {schedule.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {schedule.description}
                    </p>
                  )}

                  {!schedule.is_completed && !showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition"
                    >
                      + Laporkan Metrik Lari Hari Ini
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🌴</div>
                  <h3 className="text-sm font-bold text-slate-800">Hari Ini Istirahat / Rest Day</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tidak ada jadwal lari yang ditugaskan oleh pelatih untuk hari ini.
                  </p>
                </div>
              )}
            </div>

            {/* Metric Form Section */}
            {schedule && !schedule.is_completed && showForm && (
              <MetricForm schedule={schedule} onSuccess={handleMetricSuccess} />
            )}
          </>
        )}
      </main>

      {/* Footer Legal Links */}
      <footer className="p-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white mt-auto">
        <Link href="/terms" className="hover:underline">Syarat & Ketentuan</Link> •{' '}
        <Link href="/privacy" className="hover:underline">Kebijakan Privasi</Link>
      </footer>
    </div>
  );
}
