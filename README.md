# Runcoach - Platform Manajemen Klien Pelatih Lari (MVP)

**Runcoach** adalah platform berbasis Progressive Web App (PWA) yang menghubungkan pelatih lari dan pelari binaannya. Pelatih dapat mengelola daftar pelari dan menyusun jadwal latihan interaktif menggunakan antarmuka kalender drag-and-drop (`dnd-kit`), sedangkan pelari dapat melihat jadwal harian dan menginput metrik lari via aplikasi PWA seluler.

---

## 🚀 Fitur Utama

- **Autentikasi & RBAC (Supabase Auth)**: Pemisahan peran antara **Pelatih (Coach)** dan **Pelari (Runner)** dengan halaman onboarding wajib Pemilihan Peran.
- **Row Level Security (RLS) Ketat**: Isolasi data penuh di mana pelari tidak dapat melihat log atau metrik latihan pelari lain (Kepatuhan UU PDP).
- **Dasbor Pelatih (Web)**:
  - Penautan akun pelari binaan via modal pop-up input email.
  - Kalender penjadwalan latihan interaktif menggunakan pustaka `@dnd-kit`.
  - Notifikasi toast dan state client-side real-time saat pelari mengirimkan metrik.
- **Aplikasi Pelari (PWA Seluler)**:
  - Tampilan kartu jadwal latihan harian khusus.
  - Layar Empty State (*"Menunggu pelatih menautkan akun Anda"*) untuk pelari yang belum tertaut.
  - Formulir input metrik lari (jarak, waktu, detak jantung) dengan pemicu numpad keyboard (`inputmode="numeric"`).
  - PWA Add to Home Screen & Service Worker offline caching.
- **Performa & Skeleton UI**: Waktu muat navigasi sub-3-detik dengan komponen Skeleton loading tanpa spinner layar penuh.
- **Halaman Legal Statis**: Syarat & Ketentuan serta Kebijakan Privasi yang mengakomodasi **health/medical disclaimer**.

---

## 🛠️ Tumpukan Teknologi

- **Frontend**: Next.js 14+ (App Router), React 18, Tailwind CSS, `@dnd-kit/core`, `@dnd-kit/sortable`, `@ducanh2912/next-pwa`
- **Backend & Database**: Supabase (PostgreSQL, Auth, RLS Policies, Realtime Channels)
- **Deployment**: Vercel
- **Version Control**: GitHub

---

## 📦 Cara Memulai (Local Setup)

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/your-username/runcoach.git
   cd runcoach
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan**:
   Salin `.env.example` ke `.env.local` dan isi kredensial Supabase Anda:
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan Migrasi Database SQL**:
   Buka SQL Editor di Dashboard Supabase Anda, lalu salin dan jalankan seluruh isi file script SQL di:
   [`specs/001-core-runner-platform/contracts/supabase-schema.sql`](file:///c:/Users/kellog/Documents/Data%20Process/runcoach/specs/001-core-runner-platform/contracts/supabase-schema.sql)

5. **Jalankan Dev Server**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban Anda.

---

## 🌐 Pengerahan ke Vercel (Deployment)

1. Push kode terbaru ke cabang `main` atau `001-core-runner-platform` di GitHub.
2. Impor repositori ke Vercel.
3. Di bagian **Environment Variables** di Vercel, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Tekan **Deploy**.

---

## 📜 Lisensi & Kepatuhan

Dikembangkan sesuai standar Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia.
