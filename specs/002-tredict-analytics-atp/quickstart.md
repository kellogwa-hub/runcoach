# Quickstart & Validation Guide: Pembaruan Platform LariSync

Panduan ini mendeskripsikan skenario pengujian cepat end-to-end untuk memvalidasi fitur baru tanpa memerlukan penulisan ulang kode.

---

## Prasyarat Lingkungan

1. File [.env.local](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/.env.local) memuat kredensial Supabase dan `TREDICT_API_TOKEN`.
2. Supabase instance sudah terpasang skema tabel baru (`tredict_integrations`, `intensity_zone_profiles`, `periodization_phases`, `training_load_metrics`).
3. Server lokal Next.js berjalan via `npm run dev`.

---

## Skenario Uji 1: Penarikan Metrik Tredict via Tombol "Sinkronkan Metrik Terbaru"

1. Buka Dasbor Pelatih (`http://localhost:3000/dashboard`).
2. Cari tombol utama **"Sinkronkan Metrik Terbaru"**.
3. Tekan tombol tersebut:
   - Pastikan tombol langsung ter-disable dan menampilkan spinner/loading state.
   - Periksa notifikasi toast muncul di pojok layar: *"Berhasil menyinkronkan metrik latihan dari Tredict!"*
   - Verifikasi data metrik latihan terbaru terisi di riwayat latihan pelari.

---

## Skenario Uji 2: Kalkulator Zona Intensitas (VDOT / FTHR)

1. Buka menu Kalkulator Zona (`http://localhost:3000/dashboard/zones`).
2. Masukkan VDOT = `45` dan FTHR = `165`.
3. Tekan tombol **"Hitung & Simpan Zona"**.
4. Verifikasi dalam < 1 detik tabel zona E, M, T, I, R (Pace & HR) tampil lengkap di antarmuka.

---

## Skenario Uji 3: Kalender Periodisasi ATP

1. Buka menu Kalender ATP (`http://localhost:3000/dashboard/periodization`).
2. Pilih minggu 3 s.d. minggu 8 dan tetapkan fase `Base`.
3. Pilih minggu 9 s.d. minggu 12 dan tetapkan fase `Build`.
4. Refresh halaman dan verifikasi kode warna fase tersimpan secara konsisten.

---

## Skenario Uji 4: Dasbor Training Load (Fitness & Fatigue)

1. Buka Dasbor Training Load (`http://localhost:3000/dashboard/training-load`).
2. Verifikasi grafik time-series CTL (Fitness), ATL (Fatigue), dan TSB (Form) merender data secara responsif.
3. Hover kursor pada titik grafik dan pastikan tooltip detail nilai tampil.

---

## Perintah Verifikasi Kompilasi & Tipe

```bash
npm run build
```
*Hasil yang diharapkan: Process exited with code 0 (bebas error kompilasi & tipe TypeScript).*
