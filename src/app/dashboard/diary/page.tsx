'use client';

import { useState } from 'react';
import { TredictSyncButton } from '@/components/common/TredictSyncButton';

export default function TrainingDiaryPage() {
  const [rpe, setRpe] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Buku Harian Latihan (Training Diary)</h1>
          <p className="text-xs text-slate-500">Catat RPE (Tingkat Usaha Subjektif) dan sinkronkan data metrik Tredict.</p>
        </div>
        <TredictSyncButton />
      </div>

      {/* RPE Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
        <h2 className="text-base font-bold text-slate-900 mb-4">Input RPE (Rate of Perceived Exertion)</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Skala RPE (0 - 10): <span className="text-sm font-extrabold text-orange-600">{rpe}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (Istirahat)</span>
              <span>5 (Sedang)</span>
              <span>10 (Maksimal)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Latihan</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan sensasi lari atau hambatan fisik hari ini..."
              className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition"
          >
            Simpan Buku Harian
          </button>
        </form>

        {savedSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg">
            ✓ Catatan RPE berhasil disimpan!
          </div>
        )}
      </div>
    </div>
  );
}
