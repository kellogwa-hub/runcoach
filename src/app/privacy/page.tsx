import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Kebijakan Privasi (Privacy Policy)</h1>
        
        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
          <p>Privacy Policy ini menjelaskan bagaimana <strong>Runcoach</strong> mengumpulkan, mengelola, dan melindungi data pribadi Anda sesuai dengan <strong>Undang-Undang Pelindungan Data Pribadi (UU PDP) Indonesia</strong>.</p>
          
          <h2 className="text-lg font-semibold text-slate-900 mt-6">1. Pengumpulan & Penggunaan Data</h2>
          <p>Kami mengumpulkan data seperti nama lengkap, alamat email, peran pengguna (Coach/Runner), jadwal latihan, dan metrik lari harian (jarak, waktu, detak jantung). Data ini hanya digunakan untuk memfasilitasi interaksi pelatihan lari antara Anda dan pelatih tertaut.</p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">2. Keamanan & Enkripsi Data (Kepatuhan UU PDP)</h2>
          <p>Seluruh kredensial dan kata sandi disimpan menggunakan enkripsi hashing standar industri. Akses terhadap data metrik latihan Anda dilindungi oleh kebijakan <strong>Row Level Security (RLS) Supabase</strong>, sehingga pelari lain DILARANG dapat mengakses log latihan Anda tanpa izin otorisasi.</p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">3. Hak Subjek Data</h2>
          <p>Berdasarkan UU PDP, Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi Anda kapan saja melalui permohonan ke admin platform.</p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">4. Disclaimer Penggunaan Data Medis</h2>
          <p>Metrik latihan yang tersimpan digunakan untuk pemantauan perkembangan fisik dan bukan merupakan rekam medis resmi.</p>
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
