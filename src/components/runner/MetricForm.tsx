'use client';

import { useState } from 'react';
import { WorkoutSchedule } from '@/types';

interface MetricFormProps {
  schedule: WorkoutSchedule;
  onSuccess: () => void;
}

export default function MetricForm({ schedule, onSuccess }: MetricFormProps) {
  const [distanceKm, setDistanceKm] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [heartRateBpm, setHeartRateBpm] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (Number(distanceKm) <= 0 || Number(durationMinutes) <= 0) {
      setErrorMsg('Jarak dan durasi latihan harus lebih besar dari 0.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/runner/submit-metric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_id: schedule.id,
          distance_km: distanceKm,
          duration_minutes: durationMinutes,
          heart_rate_bpm: heartRateBpm || null,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal menyalin metrik latihan.');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
        Laporkan Metrik Latihan
      </h3>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Jarak Lari (Kilometer)
        </label>
        <input
          type="number"
          inputMode="numeric"
          step="0.01"
          required
          placeholder="Contoh: 5.25"
          value={distanceKm}
          onChange={(e) => setDistanceKm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base font-semibold focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Durasi Waktu (Menit)
        </label>
        <input
          type="number"
          inputMode="numeric"
          step="0.1"
          required
          placeholder="Contoh: 28.5"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base font-semibold focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Detak Jantung Rata-rata / Heart Rate (BPM)
        </label>
        <input
          type="number"
          inputMode="numeric"
          step="1"
          placeholder="Contoh: 145"
          value={heartRateBpm}
          onChange={(e) => setHeartRateBpm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base font-semibold focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Catatan Pelari (Opsional)
        </label>
        <textarea
          rows={2}
          placeholder="Contoh: Kondisi fisik segar, cuaca cerah..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3 text-xs focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-green-600 py-3 font-bold text-white shadow-md hover:bg-green-700 disabled:opacity-50 text-sm transition"
      >
        {loading ? 'Kirim Metrik...' : 'Kirim Laporan Metrik Lari'}
      </button>
    </form>
  );
}
