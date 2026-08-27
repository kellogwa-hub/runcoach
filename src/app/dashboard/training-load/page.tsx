'use client';

import TrainingLoadChart from '@/components/coach/TrainingLoadChart';
import { TredictSyncButton } from '@/components/common/TredictSyncButton';

export default function TrainingLoadPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Dasbor Analisis Beban Latihan</h1>
          <p className="text-xs text-slate-500">Pantau keseimbangan Kebugaran (Fitness) dan Kelelahan (Fatigue) pelari.</p>
        </div>
        <TredictSyncButton />
      </div>

      <TrainingLoadChart />
    </div>
  );
}
