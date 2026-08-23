import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Syarat & Ketentuan (Terms of Service)</h1>
        
        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
          <p>Selamat datang di <strong>Runcoach</strong>. Dengan mengakses dan menggunakan platform ini, Anda menyetujui Syarat dan Ketentuan berikut.</p>
          
          <h2 className="text-lg font-semibold text-slate-900 mt-6">1. Disclaimer Kesehatan & Medis (Health & Medical Disclaimer)</h2>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
            <p className="mb-2">⚠️ <strong>PERHATIAN PENTING KESEHATAN:</strong></p>
            <p>Runcoach adalah platform manajemen dan jadwal latihan lari. Informasi, modul latihan, dan metrik yang disediakan TIDAK DIMAKSUDKAN sebagai saran medis, diagnosis, atau perawatan medis profesional.</p>
            <p className="mt-2">Sebelum memulai program latihan lari berat atau meningkatkan intensitas fisik secara drastis, pengguna WAJIB berkonsultasi dengan dokter atau profesional kesehatan berlisensi. Anda bertanggung jawab penuh atas kondisi fisik dan risiko cedera pribadi selama menjalankan aktivitas fisik.</p>
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">2. Akun & Keamanan</h2>
          <p>Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi akun Anda. Segala aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab penuh Anda.</p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">3. Peran Pelatih & Pelari</h2>
          <p>Pelatih menyusun jadwal latihan berdasarkan pengetahuan mandiri. Platform Runcoach menyediakan sarana komunikasi teknis dan tidak bertanggung jawab atas isi materi jadwal yang disusun oleh Pelatih.</p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">4. Batas Tanggung Jawab</h2>
          <p>Platform disajikan "sebagaimana adanya" tanpa jaminan medis atau fisik. Pengguna membebaskan Runcoach dari klaim atau tuntutan hukum atas cedera fisik atau kerugian akibat penggunaan platform.</p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Terakhir Diperbarui: 23 Agustus 2026</span>
          <Link href="/auth/login" className="font-semibold text-green-600 hover:underline">
            &larr; Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
