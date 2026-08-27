'use client';

import { useState } from 'react';
import { PaceZoneDetail, HrZoneDetail } from '@/types';

export default function VdotCalculator({ runnerId }: { runnerId?: string }) {
  const [vdotInput, setVdotInput] = useState<number | string>(45);
  const [fthrInput, setFthrInput] = useState<number | string>(165);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paceZones, setPaceZones] = useState<Record<string, PaceZoneDetail> | null>(null);
  const [hrZones, setHrZones] = useState<Record<string, HrZoneDetail> | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const vdotNum = parseFloat(String(vdotInput));
    const fthrNum = parseInt(String(fthrInput), 10);

    if (vdotNum < 15 || vdotNum > 85) {
      setErrorMsg('VDOT harus antara 15 - 85');
      setLoading(false);
      return;
    }

    if (fthrNum < 100 || fthrNum > 220) {
      setErrorMsg('FTHR harus antara 100 - 220 bpm');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/zones/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vdot: vdotNum, fthr: fthrNum, runnerId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghitung zona');
      }

      setPaceZones(data.paceZones);
      setHrZones(data.hrZones);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Kalkulator Zona Intensitas (VDOT / FTHR)</h2>
        <p className="text-xs text-slate-500">
          Hitung target laju (Pace) dan detak jantung (HR) berdasarkan skor Daniels' VDOT & Friel FTHR.
        </p>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Skor VDOT (15 - 85)</label>
          <input
            type="number"
            step="0.1"
            min="15"
            max="85"
            value={vdotInput}
            onChange={(e) => setVdotInput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">FTHR (bpm) (100 - 220)</label>
          <input
            type="number"
            min="100"
            max="220"
            value={fthrInput}
            onChange={(e) => setFthrInput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {loading ? 'Menghitung...' : 'Hitung & Simpan Zona'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {errorMsg}
        </div>
      )}

      {paceZones && hrZones && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Table Pace Zones */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              🎯 Zona Laju (Pace - VDOT {vdotInput})
            </h3>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="min-w-full text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Zona</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Kategori</th>
                    <th className="px-3 py-2 text-right font-bold text-slate-600">Rentang Pace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {Object.entries(paceZones).map(([key, zone]) => (
                    <tr key={key}>
                      <td className="px-3 py-2 font-black text-green-700">{key}</td>
                      <td className="px-3 py-2 text-slate-700 font-medium">{zone.name}</td>
                      <td className="px-3 py-2 text-right font-bold text-slate-900">
                        {zone.minPace} - {zone.maxPace} {zone.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table HR Zones */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              ❤️ Zona Detak Jantung (HR - FTHR {fthrInput} bpm)
            </h3>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="min-w-full text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Zona</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Kategori</th>
                    <th className="px-3 py-2 text-right font-bold text-slate-600">Target HR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {Object.entries(hrZones).map(([key, zone]) => (
                    <tr key={key}>
                      <td className="px-3 py-2 font-black text-rose-600">{key}</td>
                      <td className="px-3 py-2 text-slate-700 font-medium">{zone.name}</td>
                      <td className="px-3 py-2 text-right font-bold text-slate-900">
                        {zone.minHr} - {zone.maxHr} {zone.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
