'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, WorkoutSchedule } from '@/types';
import RunnerModal from '@/components/coach/RunnerModal';
import Calendar from '@/components/coach/Calendar';

export default function CoachDashboardPage() {
  const [runners, setRunners] = useState<UserProfile[]>([]);
  const [selectedRunner, setSelectedRunner] = useState<UserProfile | null>(null);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [loadingRunners, setLoadingRunners] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  const fetchRunners = useCallback(async () => {
    setLoadingRunners(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('coach_id', user.id)
        .eq('role', 'runner');

      if (data) {
        setRunners(data as UserProfile[]);
        if (data.length > 0 && !selectedRunner) {
          setSelectedRunner(data[0] as UserProfile);
        }
      }
    }
    setLoadingRunners(false);
  }, [supabase, selectedRunner]);

  const fetchSchedules = useCallback(async (runnerId: string) => {
    setLoadingSchedules(true);
    const { data } = await supabase
      .from('workout_schedules')
      .select('*')
      .eq('runner_id', runnerId);

    if (data) {
      setSchedules(data as WorkoutSchedule[]);
    }
    setLoadingSchedules(false);
  }, [supabase]);

  useEffect(() => {
    fetchRunners();
  }, [fetchRunners]);

  useEffect(() => {
    if (selectedRunner) {
      fetchSchedules(selectedRunner.id);
    }
  }, [selectedRunner, fetchSchedules]);

  const handleRunnerAdded = (newRunner: UserProfile) => {
    setRunners((prev) => [...prev, newRunner]);
    setSelectedRunner(newRunner);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Client Roster Selection */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Klien Pelari Binaan</h1>
          <p className="text-xs text-slate-500">Pilih pelari untuk melihat & mengedit jadwal latihan</p>
        </div>

        <div className="flex items-center space-x-3">
          {loadingRunners ? (
            <div className="h-9 w-40 bg-slate-100 rounded-lg animate-pulse"></div>
          ) : (
            <select
              value={selectedRunner?.id || ''}
              onChange={(e) => {
                const found = runners.find((r) => r.id === e.target.value);
                if (found) setSelectedRunner(found);
              }}
              className="text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {runners.length === 0 ? (
                <option value="">Belum ada pelari tertaut</option>
              ) : (
                runners.map((r) => (
                  <option key={r.id} value={r.id}>
                    🏃‍♂️ {r.full_name} ({r.email})
                  </option>
                ))
              )}
            </select>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition whitespace-nowrap"
          >
            + Tambah Pelari
          </button>
        </div>
      </div>

      {/* Main Calendar View */}
      {selectedRunner ? (
        loadingSchedules ? (
          <div className="h-64 bg-white rounded-2xl border border-slate-200 p-8 flex items-center justify-center animate-pulse">
            <span className="text-xs text-slate-400 font-medium">Memuat kalender latihan...</span>
          </div>
        ) : (
          <Calendar
            runnerId={selectedRunner.id}
            schedules={schedules}
            onScheduleUpdated={(updated) =>
              setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
            }
            onNewScheduleCreated={(created) => setSchedules((prev) => [...prev, created])}
          />
        )
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3">
            🏃‍♂️
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum Ada Pelari Binaan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tekan tombol <strong>"Tambah Pelari"</strong> di atas untuk menautkan akun pelari binaan Anda menggunakan email mereka.
          </p>
        </div>
      )}

      {/* Modal Tambah Pelari */}
      <RunnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRunnerAdded={handleRunnerAdded}
      />
    </div>
  );
}
