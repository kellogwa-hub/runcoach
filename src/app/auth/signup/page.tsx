'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message || 'Terjadi kesalahan saat pendaftaran');
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push('/onboarding/role');
      }
    } catch (err) {
      console.error('[Signup Error]', err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke server (Kesalahan Jaringan). Silakan periksa koneksi internet Anda.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Runcoach</h1>
          <p className="mt-2 text-sm text-slate-600">Buat akun baru Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Lengkap Anda"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 shadow-md"
          >
            {loading ? 'Membuat Akun...' : 'Daftar Akun'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Sudah memiliki akun?{' '}
          <Link href="/auth/login" className="font-semibold text-green-600 hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
