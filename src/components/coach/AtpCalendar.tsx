'use client';

import { useState } from 'react';
import { AtpPhaseName } from '@/types';

const PHASE_COLORS: Record<AtpPhaseName, { bg: string; text: string; border: string }> = {
  Prep: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  Base: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  Build: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  Peak: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  Race: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  Transition: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
};

const PHASES: AtpPhaseName[] = ['Prep', 'Base', 'Build', 'Peak', 'Race', 'Transition'];

export default function AtpCalendar() {
  const [selectedPhase, setSelectedPhase] = useState<AtpPhaseName>('Base');
  const [weeks, setWeeks] = useState<Record<number, AtpPhaseName>>(() => {
    const initial: Record<number, AtpPhaseName> = {};
    for (let w = 1; w <= 52; w++) {
      if (w <= 4) initial[w] = 'Prep';
      else if (w <= 20) initial[w] = 'Base';
      else if (w <= 36) initial[w] = 'Build';
      else if (w <= 44) initial[w] = 'Peak';
      else if (w <= 48) initial[w] = 'Race';
      else initial[w] = 'Transition';
    }
    return initial;
  });

  const handleWeekClick = (weekNum: number) => {
    setWeeks((prev) => ({
      ...prev,
      [weekNum]: selectedPhase,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Kalender Periodisasi ATP (Annual Training Plan)</h2>
          <p className="text-xs text-slate-500">
            Pilih fase periodisasi lalu klik pada minggu kalender untuk menetapkan struktur musim.
          </p>
        </div>

        {/* Phase Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {PHASES.map((p) => {
            const style = PHASE_COLORS[p];
            const isSelected = selectedPhase === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPhase(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  style.bg
                } ${style.text} ${style.border} ${
                  isSelected ? 'ring-2 ring-slate-900 ring-offset-1 scale-105' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* 52-Week Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-13 gap-2 pt-2">
        {Array.from({ length: 52 }, (_, i) => i + 1).map((weekNum) => {
          const currentPhase = weeks[weekNum] || 'Base';
          const style = PHASE_COLORS[currentPhase];
          return (
            <button
              key={weekNum}
              onClick={() => handleWeekClick(weekNum)}
              className={`p-2 rounded-lg border text-center transition hover:scale-105 ${style.bg} ${style.text} ${style.border}`}
            >
              <div className="text-[10px] font-bold opacity-60">W{weekNum}</div>
              <div className="text-xs font-extrabold truncate">{currentPhase}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
