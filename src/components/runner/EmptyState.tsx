export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm my-4">
      <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 text-2xl">
        ⏳
      </div>
      <h2 className="text-lg font-extrabold text-slate-900 mb-2">Menunggu Pelatih Menautkan Akun Anda</h2>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        Beritahukan alamat email akun ini kepada pelatih Anda agar mereka dapat memasukkan Anda ke dalam daftar pelari binaan.
      </p>
      <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono">
        Status: Belum Tertaut (Unlinked)
      </div>
    </div>
  );
}
