'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  // Disable back button navigation to enforce mandatory onboarding
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectRole = async (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/role-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal menyimpan pilihan peran.');
        setLoading(false);
        return;
      }

      // Redirect immediately to dashboard or PWA home
      router.replace(data.redirect);
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pilih Peran Anda</h1>
          <p className="mt-2 text-sm text-slate-600">
            Tentukan bagaimana Anda akan menggunakan platform Runcoach.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Saya Pelatih */}
          <button
            type="button"
            onClick={() => handleSelectRole('coach')}
            disabled={loading}
            className={`flex flex-col items-center justify-between rounded-xl border-2 p-6 text-center transition shadow-sm hover:shadow-md ${
              selectedRole === 'coach'
                ? 'border-green-600 bg-green-50/50'
                : 'border-slate-200 bg-white hover:border-green-500'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Saya Pelatih</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Saya ingin mengelola daftar pelari binaan dan menyusun jadwal latihan harian via Dasbor Kalender Web.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-green-600">
              Pilih Pelatih &rarr;
            </span>
          </button>

          {/* Card 2: Saya Pelari */}
          <button
            type="button"
            onClick={() => handleSelectRole('runner')}
            disabled={loading}
            className={`flex flex-col items-center justify-between rounded-xl border-2 p-6 text-center transition shadow-sm hover:shadow-md ${
              selectedRole === 'runner'
                ? 'border-green-600 bg-green-50/50'
                : 'border-slate-200 bg-white hover:border-green-500'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Saya Pelari</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Saya ingin melihat jadwal latihan harian dan menginput metrik lari via aplikasi PWA Seluler.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-blue-600">
              Pilih Pelari &rarr;
            </span>
          </button>
        </div>

        {loading && (
          <div className="mt-6 text-center text-sm font-medium text-slate-600 animate-pulse">
            Menyiapkan dasbor Anda...
          </div>
        )}
      </div>
    </div>
  );
}
