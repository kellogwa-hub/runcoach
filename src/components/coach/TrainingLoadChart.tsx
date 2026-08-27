'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export interface TrainingLoadPoint {
  date: string;
  ctl: number; // Fitness
  atl: number; // Fatigue
  tsb: number; // Form
}

const mockData: TrainingLoadPoint[] = [
  { date: '08-01', ctl: 35, atl: 40, tsb: -5 },
  { date: '08-05', ctl: 38, atl: 45, tsb: -7 },
  { date: '08-10', ctl: 42, atl: 50, tsb: -8 },
  { date: '08-15', ctl: 45, atl: 35, tsb: 10 },
  { date: '08-20', ctl: 48, atl: 55, tsb: -7 },
  { date: '08-25', ctl: 52, atl: 42, tsb: 10 },
  { date: '08-27', ctl: 55, atl: 38, tsb: 17 },
];

export default function TrainingLoadChart({ data = mockData }: { data?: TrainingLoadPoint[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900">Dasbor Beban Latihan (Training Load)</h2>
        <p className="text-xs text-slate-500">
          Grafik time-series mengukur Kebugaran (CTL), Kelelahan (ATL), dan Keseimbangan Performa (TSB/Form).
        </p>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCtl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAtl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTsb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="ctl"
              name="CTL (Fitness)"
              stroke="#059669"
              fillOpacity={1}
              fill="url(#colorCtl)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="atl"
              name="ATL (Fatigue)"
              stroke="#dc2626"
              fillOpacity={1}
              fill="url(#colorAtl)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="tsb"
              name="TSB (Form / Freshness)"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorTsb)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
