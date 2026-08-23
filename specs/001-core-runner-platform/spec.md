# Feature Specification: Platform Manajemen Klien Pelatih Lari (MVP)

**Feature Branch**: `001-core-runner-platform`

**Created**: 2026-08-23

**Status**: Draft

**Input**: User description: "Definisi Produk Inti (MVP): Platform Manajemen Klien Pelatih Lari berbasis Progressive Web App (PWA) untuk memudahkan pelatih menyusun jadwal dan memudahkan pelari melaporkan metrik latihan..."

## Clarifications

### Session 2026-08-23

- Q: Bagaimana mekanisme penentuan peran (Role: Coach vs Runner) saat pengguna pertama kali mendaftar (onboarding)? → A: Setelah registrasi email/password, pengguna secara otomatis diarahkan ke halaman khusus "Pemilihan Peran" (Role Selection) yang menampilkan dua kartu visual ("Saya Pelatih" dan "Saya Pelari"). Pilihan disimpan ke tabel profil pengguna di Supabase, kemudian pengguna langsung di-redirect ke rute dasbor sesuai peran. Tombol navigasi kembali (Back) dinonaktifkan pada halaman ini untuk memastikan alur onboarding wajib diselesaikan.
- Q: Bagaimana mekanisme penghubungan (pairing) antara Pelatih (Coach) dan Pelari (Runner) agar Pelari masuk ke dalam daftar binaan Pelatih? → A: Pelatih menekan tombol "Tambah Pelari" di Dasbor Web untuk membuka modal input email Pelari dan menekan "Tautkan Akun". Sistem mencari email tersebut di tabel profil Runner dan memperbarui kolom `coach_id` dengan ID Pelatih yang sedang login. Pada PWA Pelari, jika `coach_id` bernilai null, tampilkan layar Empty State ("Menunggu pelatih menautkan akun Anda.") serta sembunyikan kalender dan formulir metrik hingga akun tertaut.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autentikasi Peran & Akses Dasbor Terpisah (Priority: P1)

Sebagai Pengguna (Pelatih atau Pelari), saya ingin masuk ke dalam aplikasi menggunakan sistem autentikasi yang aman dan menyelesaikan alur pemilihan peran awal agar saya dapat secara otomatis diarahkan ke antarmuka yang sesuai dengan peran (role) saya.

**Why this priority**: Autentikasi dan pemisahan peran (RBAC) adalah pondasi dasar keamanan aplikasi, pemisahan hak akses, dan perlindungan data pribadi sesuai Konstitusi (UU PDP & Supabase RLS).

**Independent Test**: Dapat diuji secara independen dengan mendaftarkan akun baru, memverifikasi pengarahan otomatis ke halaman Pemilihan Peran, memilih peran 'Coach' atau 'Runner', lalu memastikan Coach diarahkan ke Dasbor Pelatih (Web) dan Runner diarahkan ke Antarmuka PWA Seluler.

**Acceptance Scenarios**:

1. **Given** Pengguna baru menyelesaikan pendaftaran email & kata sandi, **When** akun berhasil dibuat, **Then** sistem otomatis mengarahkan pengguna ke halaman wajib Pemilihan Peran (Role Selection) dengan tombol Back dinonaktifkan.
2. **Given** Pengguna berada di halaman Pemilihan Peran dan memilih "Saya Pelatih", **When** pilihan disimpan, **Then** peran `coach` tersimpan di database Supabase dan pengguna di-redirect ke Dasbor Pelatih (Web).
3. **Given** Pengguna berada di halaman Pemilihan Peran dan memilih "Saya Pelari", **When** pilihan disimpan, **Then** peran `runner` tersimpan di database Supabase dan pengguna di-redirect ke Antarmuka PWA Seluler Pelari.
4. **Given** Pelari terautentikasi mencoba mengoperasikan atau mengakses URL data pelari lain atau halaman pelatih secara langsung, **When** permintaan dikirim ke server, **Then** kebijakan Supabase Row Level Security (RLS) secara tegas menolak akses dan mengembalikan pesan otorisasi ditolak.

---

### User Story 2 - Penyusunan & Penjadwalan Latihan Pelari via Kalender Drag-and-Drop (Priority: P1)

Sebagai Pelatih, saya ingin melihat daftar pelari yang saya bina, menambahkan pelari baru via input email, dan mengatur jadwal latihan harian mereka menggunakan antarmuka kalender interaktif drag-and-drop agar proses perencanaan latihan efisien.

**Why this priority**: Menjadwalkan latihan dan mengelola hubungan pelatih-pelari adalah nilai bisnis utama bagi Pelatih dalam mengelola klien.

**Independent Test**: Pelatih dapat menekan tombol "Tambah Pelari", menginput email akun pelari, memverifikasi pelari bertaut di daftar klien, memindahkan (drag) blok modul latihan ke tanggal kalender (menggunakan library `dnd-kit`), dan memastikan jadwal tersimpan di Supabase.

**Acceptance Scenarios**:

1. **Given** Pelatih berada di Dasbor Pelatih, **When** menekan tombol "Tambah Pelari" dan menginput email Runner valid di modal pop-up, **Then** sistem memperbarui `coach_id` pelari tersebut dan daftar pelari di dasbor langsung terbarui tanpa refresh halaman penuh.
2. **Given** Pelatih berada di Dasbor Pelatih dan memilih seorang pelari binaan, **When** Pelatih menarik (drag) modul latihan dan menjatuhkannya (drop) ke tanggal di kalender menggunakan `dnd-kit`, **Then** jadwal latihan baru berhasil dibuat dan tersimpan di database Supabase.
3. **Given** Pelatih mengubah tanggal latihan di kalender dengan menggeser blok jadwal latihan, **When** aksi drop selesai, **Then** tanggal latihan di database Supabase diperbarui secara instan.
4. **Given** Pelatih memuat antarmuka dasbor kalender, **When** data sedang diambil dari server, **Then** antarmuka menampilkan komponen skeleton loading tanpa memblokir navigasi layar penuh.

---

### User Story 3 - Pelaporan Metrik Latihan Harian Pelari via PWA (Priority: P2)

Sebagai Pelari, saya ingin melihat jadwal latihan saya hari ini di aplikasi PWA seluler dan menginput hasil metrik lari (jarak, waktu, detak jantung) agar pelatih saya dapat melihat perkembangan latihan saya secara real-time.

**Why this priority**: Menginput hasil latihan memungkinkan umpan balik berkelanjutan antara pelari dan pelatih.

**Independent Test**: Pelari dapat membuka PWA pada ponsel/browser seluler, melihat kartu latihan hari ini (atau pesan Empty State jika belum ditautkan pelatih), menginput metrik melalui formulir dengan numpad keyboard, dan mengirim data. Pelatih kemudian dapat melihat metrik yang baru dikirimkan di dasbor secara real-time.

**Acceptance Scenarios**:

1. **Given** Pelari terautentikasi yang belum memiliki pelatih (`coach_id` null) membuka PWA Seluler, **When** halaman utama terbuka, **Then** sistem menampilkan layar Empty State ("Menunggu pelatih menautkan akun Anda.") serta menyembunyikan elemen kalender dan formulir metrik.
2. **Given** Pelari terautentikasi yang sudah tertaut dengan pelatih membuka PWA Seluler pada hari latihan, **When** halaman utama terbuka, **Then** sistem menampilkan jadwal latihan khusus untuk hari tersebut dengan indikator status belum selesai.
3. **Given** Pelari membuka formulir pelaporan metrik latihan pada perangkat seluler, **When** menekan bidang input angka (jarak, waktu, detak jantung), **Then** keyboard perangkat otomatis memunculkan keyboard angka (`inputmode="numeric"`).
4. **Given** Pelari mengisi formulir metrik valid dan menekan tombol simpan, **When** data dikirimkan, **Then** data metrik tersimpan di Supabase dan terintegrasi secara real-time ke dasbor pelatih.

---

### Edge Cases

- **Koneksi Terputus saat Input Metrik**: Jika pelari menginput metrik latihan di area tanpa sinyal seluler, PWA MUST menyimpan draf metrik secara lokal dan melakukan sinkronisasi otomatis saat koneksi terhubung kembali.
- **Konflik Perubahan Jadwal**: Jika pelatih mengubah jadwal latihan tepat pada saat pelari sedang membuka formulir pelaporan, sistem MUST menggunakan langganan real-time Supabase untuk memperbarui antarmuka pelari secara halus.
- **Format Input Angka Tidak Valid**: Jika pelari memasukkan nilai metrik negatif atau format durasi yang tidak valid, formulir MUST melakukan validasi lokal sebelum pengiriman dan menampilkan pesan kesalahan di bawah bidang input yang bersangkutan.
- **Penautan Email Pelari Tidak Ditemukan**: Jika pelatih menginput email di modal "Tambah Pelari" yang belum terdaftar atau bukan role Runner, sistem MUST menampilkan pesan peringatan di modal tanpa menutup pop-up.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem MUST mengautentikasi pengguna menggunakan Supabase Auth dan secara otomatis mengarahkan pendaftar baru ke halaman wajib "Pemilihan Peran" (Role Selection: Coach/Runner) sebelum membuka akses ke dasbor terkait.
- **FR-002**: Sistem MUST menerapkan kebijakan Supabase Row Level Security (RLS) secara ketat sehingga data log latihan dan metrik setiap pelari terisolasi sepenuhnya dan hanya dapat diakses oleh pelari yang bersangkutan serta pelatih yang membina pelari tersebut.
- **FR-003**: Dasbor Pelatih MUST menyediakan fitur modal "Tambah Pelari" via input email untuk menautkan akun pelari (mengisi `coach_id` pada profil Runner), daftar pelari binaan, dan antarmuka kalender penjadwalan latihan.
- **FR-004**: Fitur drag-and-drop jadwal latihan pada kalender pelatih MUST diimplementasikan menggunakan pustaka eksternal `dnd-kit` (DILARANG membangun logika drag-and-drop dari nol).
- **FR-005**: Aplikasi PWA Seluler Pelari MUST menampilkan kartu jadwal latihan harian khusus untuk pengguna terautentikasi yang sudah tertaut pelatih, dan menampilkan layar Empty State ("Menunggu pelatih menautkan akun Anda.") jika `coach_id` masih null.
- **FR-006**: Formulir pelaporan metrik lari pada PWA (mencakup jarak, waktu, dan detak jantung) MUST menggunakan elemen input beratribut `inputmode="numeric"` untuk memicu keyboard numpad di layar seluler.
- **FR-007**: Data metrik lari yang dikirimkan oleh pelari MUST dikirim dan ditampilkan secara real-time pada Dasbor Pelatih.
- **FR-008**: Antarmuka Web Dashboard dan PWA MUST menggunakan teknik skeleton loading saat mengambil data async dari server dan DILARANG menggunakan animasi spinner layar penuh yang memblokir navigasi.
- **FR-009**: Sistem MUST menyediakan templat halaman statis publik untuk Syarat & Ketentuan (Terms of Service) dan Kebijakan Privasi (Privacy Policy) yang memuat disclaimer medis/kesehatan sesuai Konstitusi.
- **FR-010**: Fitur Pembayaran/Billing, Chat In-App, dan Pelacakan GPS (live tracking) DILARANG dibuat atau disediakan dalam skop MVP ini.

### Key Entities *(include if feature involves data)*

- **UserProfile**: Mewakili profil pengguna aplikasi. Memiliki atribut ID pengguna (link ke Supabase Auth), nama lengkap, email, peran (`coach` atau `runner`), `coach_id` (nullable foreign key ke `UserProfile` pelatih), dan timestamp pembuatan.
- **WorkoutSchedule**: Mewakili modul/blok jadwal latihan yang dialokasikan oleh pelatih ke pelari. Memiliki atribut ID jadwal, `runner_id`, `coach_id`, tanggal latihan, judul latihan, instruksi/target latihan, dan status penyelesaian.
- **WorkoutMetric**: Memuat data laporan metrik aktual dari pelari setelah menyelesaikan latihan. Memiliki atribut ID metrik, `schedule_id`, `runner_id`, jarak (km), waktu/durasi, detak jantung rata-rata (bpm), catatan pelari, dan timestamp pengiriman.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Waktu muat (load time) navigasi antarmuka pada Web Dashboard dan PWA tidak melebihi 3 detik.
- **SC-002**: 100% percobaan akses data antar-pelari yang tidak berhak diblokir oleh kebijakan Supabase Row Level Security (RLS).
- **SC-003**: Pelatih dapat menambahkan pelari via modal email dan memindahkan (drag-and-drop) jadwal latihan bulanan untuk pelari dalam waktu kurang dari 30 detik per sesi latihan.
- **SC-004**: Pelari dapat menyelesaikan pengisian dan pengiriman formulir metrik latihan harian di PWA seluler dalam waktu kurang dari 15 detik.
- **SC-005**: 100% komponen pemuat data menggunakan skeleton UI tanpa adanya full-screen blocking spinner.

## Assumptions

- **Target Pengguna**: Pelatih lari mengakses platform melalui peramban web desktop/laptop, sedangkan Pelari mengakses antarmuka PWA melalui ponsel pintar.
- **Konektivitas Dasar**: Pengguna memiliki koneksi internet yang cukup untuk autentikasi awal dan sinkronisasi data Supabase.
- **Pustaka Drag-and-Drop**: Penggunaan `dnd-kit` dipilih sebagai pustaka eksternal teruji untuk antarmuka kalender drag-and-drop.
