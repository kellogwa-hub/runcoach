# Feature Specification: Pembaruan Platform LariSync - Otomasi Tredict, Kalkulator VDOT/FTHR, Periodisasi ATP & Dasbor Training Load

**Feature Branch**: `002-tredict-analytics-atp`

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "Pembaruan platform pelatih LariSync untuk mengotomatisasi penarikan metrik latihan (Tredict API), ditambah fitur Kalkulator Zona Intensitas (VDOT/FTHR), Kalender Periodisasi (ATP), dan Dasbor Beban Latihan (Training Load)..."

## Clarifications

### Session 2026-08-27

- Q: Bagaimana frekuensi otomatisasi penarikan metrik latihan (auto-fetch) dari Tredict API ke platform LariSync hendak dijalankan? → A: Penarikan data Tredict API dipicu secara manual via tombol utama "Sinkronkan Metrik Terbaru" pada Dasbor Pelatih & Pelari. Tombol dinonaktifkan saat loading, menampilkan indikator visual (spinner/skeleton), dan memunculkan notifikasi toast saat selesai guna mencegah permintaan ganda.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Integrasi Auto-Fetch Metrik Latihan Tredict (Priority: P1)

Sebagai Pelatih, saya ingin mengonfigurasi API Key Tredict pelari secara aman di platform dan memicu penarikan data via tombol "Sinkronkan Metrik Terbaru" agar sistem dapat secara otomatis menarik metrik latihan aktual (durasi, detak jantung, dan pace) dari Tredict ke database tanpa perlu menginput manual.

**Why this priority**: Penarikan metrik secara otomatis menghilangkan beban pelaporan manual dari pelari dan memastikan pelatih mendapatkan data aktual yang valid dan real-time untuk pemantauan beban latihan.

**Independent Test**: Pelatih/Pelari dapat membuka dasbor, memasukkan Tredict API Key terenkripsi, menekan tombol "Sinkronkan Metrik Terbaru", melihat indikator loading dan tombol ter-disable, menerima notifikasi toast saat selesai, dan melihat data durasi, pace, serta detak jantung dari Tredict muncul pada riwayat latihan.

**Acceptance Scenarios**:

1. **Given** Pelatih berada di halaman pengaturan integrasi pelari, **When** memasukkan API Key Tredict yang valid dan menekan simpan, **Then** sistem menyimpan kredensial secara terenkripsi di database dan menampilkan status koneksi "Terhubung".
2. **Given** Akun terhubung ke Tredict, **When** tombol utama "Sinkronkan Metrik Terbaru" ditekan, **Then** tombol otomatis dinonaktifkan (disabled), indikator visual loading ditampilkan, backend secara aman menarik data durasi latihan, detak jantung rata-rata, dan pace harian dari Tredict lalu menyimpannya ke database platform.
3. **Given** Proses penarikan data dari Tredict API selesai (sukses atau gagal), **When** eksekusi backend selesai, **Then** sistem mengaktifkan kembali tombol dan memunculkan notifikasi toast singkat terkait status akhir (sukses/gagal).
4. **Given** Kredensial API Key Tredict tidak valid atau expired, **When** penarikan data dipicu, **Then** sistem menampilkan notifikasi toast kesalahan otentikasi yang jelas tanpa menghentikan fungsi aplikasi lainnya.

---

### User Story 2 - Kalkulator Zona Intensitas Latihan (VDOT/FTHR) (Priority: P1)

Sebagai Pelatih, saya ingin menginput skor VDOT atau nilai Functional Threshold Heart Rate (FTHR) pelari untuk secara otomatis menghitung dan merender rentang zona latihan intensitas harian (E, M, T, I, R).

**Why this priority**: Zona latihan yang akurat berbasis VDOT/FTHR adalah dasar preskripsi latihan yang aman dan efektif bagi pelatih untuk menentukan target laju dan detak jantung pelari.

**Independent Test**: Pelatih dapat menginput angka VDOT (misal: 45) atau FTHR (misal: 165 bpm) pada formulir kalkulator, kemudian sistem langsung merender tabel zona latihan lengkap dengan rentang laju (pace) dan detak jantung (HR) untuk zona Easy (E), Marathon (M), Threshold (T), Interval (I), dan Repetition (R).

**Acceptance Scenarios**:

1. **Given** Pelatih berada di halaman formulir kalkulator intensitas, **When** memasukkan nilai VDOT valid dan menekan hitung, **Then** sistem merender rentang laju per kilometer untuk zona E (Easy), M (Marathon), T (Threshold), I (Interval), dan R (Repetition).
2. **Given** Pelatih memasukkan nilai FTHR valid, **When** kalkulasi dijalankan, **Then** sistem menghitung dan merender rentang detak jantung target (bpm) untuk setiap zona intensitas.
3. **Given** Pelatih menyimpan hasil zona intensitas, **When** konfirmasi ditekan, **Then** profil zona intensitas pelari diperbarui di database dan menjadi acuan target latihan harian.

---

### User Story 3 - Kalender Periodisasi Tahunan / ATP (Annual Training Plan) (Priority: P2)

Sebagai Pelatih, saya ingin merencanakan struktur musim latihan pelari dalam kalender periodisasi tahunan dengan memetakan setiap minggu ke dalam label fase periodisasi yang sesuai.

**Why this priority**: Periodisasi tahunan memungkinkan pelatih menyusun strategi jangka panjang guna memastikan pelari mencapai puncak performa (peaking) pada hari perlombaan tanpa mengalami overtraining.

**Independent Test**: Pelatih dapat membuka antarmuka Kalender Periodisasi (ATP), memilih rentang minggu, menetapkan label fase latihan (Prep, Base, Build, Peak, Race, Transition), dan melihat visualisasi blok warna fase pada kalender musiman pelari.

**Acceptance Scenarios**:

1. **Given** Pelatih membuka tampilan Kalender Periodisasi (ATP), **When** memilih minggu-minggu tertentu di kalender, **Then** pelatih dapat menetapkan salah satu label fase periodisasi: Prep (Persiapan), Base (Fondasi), Build (Pengembangan), Peak (Puncak), Race (Lomba), atau Transition (Transisi).
2. **Given** Label fase periodisasi ditetapkan pada kalender, **When** kalender dimuat ulang, **Then** setiap blok minggu menampilkan warna dan penanda fase secara visual yang jelas.
3. **Given** Pelatih mengubah fase periodisasi pada suatu minggu, **When** perubahan disimpan, **Then** jadwal dan target mingguan pelari secara otomatis menyesuaikan dengan konteks fase baru tersebut.

---

### User Story 4 - Dasbor Beban Latihan & Grafik Kebugaran/Kelelahan (Priority: P2)

Sebagai Pelatih, saya ingin memantau perkembangan rasio Fitness (Kebugaran) dan Fatigue (Kelelahan) pelari melalui grafik visual time-series beban latihan (Training Load) yang bersumber dari data Tredict.

**Why this priority**: Memantau grafik Fitness dan Fatigue membantu pelatih mendeteksi risiko cedera dan kelelahan berlebih sebelum berdampak buruk pada performa pelari.

**Independent Test**: Pelatih dapat membuka Dasbor Training Load pelari dan melihat grafik garis time-series interaktif yang menampilkan kurva Fitness (CTL), Fatigue (ATL), dan Form/Freshness (TSB) berdasarkan data latihan yang ditarik dari Tredict.

**Acceptance Scenarios**:

1. **Given** Data metrik latihan dari Tredict sudah tersimpan di database, **When** Pelatih membuka Dasbor Training Load, **Then** sistem merender grafik visual time-series yang menunjukkan tren Fitness dan Fatigue secara akurat.
2. **Given** Pelatih mengarahkan kursor (hover) pada poin tanggal di grafik beban latihan, **When** kursor berada di atas tanggal tertentu, **Then** sistem menampilkan tooltip berisi rincian nilai Kebugaran, Kelelahan, dan Tingkat Keseimbangan (Form/TSB) pada hari tersebut.
3. **Given** Belum ada data metrik latihan yang ditarik untuk rentang tanggal yang dipilih, **When** dasbor dibuka, **Then** sistem menampilkan tampilan skeleton loading dan indikator ramah bahwa data latihan belum tersedia.

---

### Edge Cases

- **Tredict API Downtime / Gangguan Jaringan**: Jika API Tredict tidak dapat diakses saat tombol penarikan ditekan, sistem MUST menghentikan status loading, menampilkan notifikasi toast kegagalan, dan menggunakan data metrik lokal terakhir tanpa memblokir antarmuka pengguna.
- **Input Nilai VDOT / FTHR Di Luar Batas Wajar**: Jika pelatih memasukkan VDOT di luar rentang realistis (misal: < 15 atau > 85) atau FTHR (< 100 bpm atau > 220 bpm), formulir MUST memberikan validasi batas langsung sebelum kalkulasi.
- **Penetapan Fase Periodisasi Tumpang Tulis**: Jika pelatih menetapkan dua fase yang bertabrakan pada minggu yang sama, sistem MUST meminta konfirmasi penggantian fase pada minggu tersebut.
- **Data Metrik Latihan Kosong / Nol dari Tredict**: Jika latihan yang ditarik memiliki nilai durasi atau detak jantung nol, sistem MUST menandai data tersebut sebagai tidak lengkap pada dasbor tanpa mengganggu akumulasi grafik Training Load mingguan.

---

### Strict Out-of-Scope (Batasan Negatif Tegas)

> [!CAUTION]
> **Fitur-Fitur Berikut DILARANG Dibuat pada Pembaruan Ini**:
> 1. **Jurnal Kebugaran Mental (Mental Fitness Log)**
> 2. **Analisis Gaya Berlari (Biomechanics Analysis)**
> 3. **Modul Chat / Komunikasi In-App**
> 4. **Fitur Pembayaran / Billing**
> 
> *DILARANG membuat komponen antarmuka, rute API, fungsi backend, maupun tabel database apa pun untuk ke-4 fitur di atas!*

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem MUST menyediakan antarmuka penyimpanan Tredict API Key yang tersimpan secara terenkripsi pada level database Supabase dengan otorisasi berbasis peran (RBAC/RLS).
- **FR-002**: Sistem MUST menyediakan tombol utama bertuliskan "Sinkronkan Metrik Terbaru" pada Dasbor Pelatih dan Pelari sebagai pemicu (trigger) tunggal penarikan data metrik latihan (durasi, detak jantung rata-rata, dan pace) dari Tredict API ke database platform. Tombol MUST menampilkan indikator visual (loading state/spinner), dinonaktifkan (disabled) selama proses berlangsung guna mencegah permintaan ganda, serta memunculkan notifikasi toast singkat terkait status akhir (sukses/gagal).
- **FR-003**: Sistem MUST menyediakan Kalkulator Zona Intensitas yang menerima input VDOT dan/atau FTHR serta merender rentang zona latihan: Easy (E), Marathon (M), Threshold (T), Interval (I), dan Repetition (R).
- **FR-004**: Sistem MUST menyimpan profil zona latihan yang dihitung ke database dan mengaitkannya dengan profil pelari yang bersangkutan.
- **FR-005**: Sistem MUST menyediakan antarmuka Kalender Periodisasi (ATP - Annual Training Plan) interaktif yang memungkinkan Pelatih menetapkan label fase musiman pada setiap minggu (Prep, Base, Build, Peak, Race, Transition).
- **FR-006**: Sistem MUST menampilkan kode warna visual yang membedakan setiap fase periodisasi pada tampilan kalender tahunan/musiman.
- **FR-007**: Sistem MUST menyediakan Dasbor Beban Latihan (Training Load Dashboard) yang merender grafik visual time-series untuk memantau nilai Kebugaran (Fitness), Kelelahan (Fatigue), dan Keseimbangan Performa (Form/Freshness) pelari berdasarkan metrik Tredict.
- **FR-008**: Seluruh antarmuka baru MUST mematuhi batas waktu muat maksimal 3 detik dan menggunakan teknik skeleton loading tanpa adanya full-screen blocking spinner.
- **FR-009**: Seluruh akses data metrik dan profil zona MUST diisolasi secara ketat menggunakan Supabase Row Level Security (RLS) sesuai Konstitusi platform.

### Key Entities *(include if feature involves data)*

- **TredictIntegration**: Memuat kredensial integrasi Tredict pelari. Atribut: ID integrasi, ID pengguna pelari, API Key terenkripsi, status koneksi, timestamp sinkronisasi terakhir.
- **IntensityZoneProfile**: Memuat nilai VDOT, FTHR, dan rentang zona latihan yang dihitung. Atribut: ID profil zona, ID pelari, nilai VDOT, nilai FTHR, rentang laju (pace range E/M/T/I/R), rentang detak jantung (HR range E/M/T/I/R), timestamp pembaruan.
- **PeriodizationPhase**: Memuat alokasi fase periodisasi tahunan pada kalender. Atribut: ID fase, ID pelari, ID pelatih, nomor minggu/tahun, nama fase (Prep, Base, Build, Peak, Race, Transition), catatan fase.
- **TrainingLoadMetric**: Memuat perhitungan nilai beban latihan harian/mingguan. Atribut: ID beban, ID pelari, tanggal, nilai beban latihan (training stress score), akumulasi Fitness (CTL), akumulasi Fatigue (ATL), nilai Form/Freshness (TSB).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Penarikan data metrik latihan dari Tredict API ke database via tombol "Sinkronkan Metrik Terbaru" selesai dalam waktu kurang dari 3 detik untuk sesi penarikan harian.
- **SC-002**: Kalkulator VDOT/FTHR merender seluruh 5 rentang zona latihan (E, M, T, I, R) secara instan dalam waktu kurang dari 1 detik setelah formulir dikirimkan.
- **SC-003**: 100% data Tredict API Key tersimpan dalam bentuk terenkripsi dan tidak pernah terekspos dalam teks polos di antarmuka pengguna atau log server.
- **SC-004**: Pelatih dapat menetapkan dan mengupdate label fase periodisasi pada kalender ATP dalam waktu kurang dari 10 detik per minggu.
- **SC-005**: Dasbor Training Load merender grafik time-series Fitness & Fatigue secara mulus dengan waktu pemuatan kurang dari 3 detik tanpa adanya spinner layar penuh.
- **SC-006**: 100% upaya pengaksesan data zona intensitas atau beban latihan antar-pelari diblokir oleh kebijakan Supabase Row Level Security (RLS).

---

## Assumptions

- **Integrasi Tredict**: API Token yang digunakan didapatkan melalui pengaturan Personal API Tredict milik pelari atau pelatih.
- **Perhitungan VDOT/FTHR**: Formula kalkulasi zona mengacu pada standar umum fisiologi olahraga lari (Daniels' Running Formula untuk VDOT dan Coggan/Friel untuk FTHR).
- **Akses Peran**: Fitur kalkulator zona, periodisasi ATP, dan dasbor beban latihan utamanya diakses dan dikelola oleh pengguna berpendan Pelatih (Coach), serta dapat dilihat oleh Pelari (Runner) binaannya.
- **Metrik Beban Latihan**: Nilai beban latihan (Training Load) dihitung berdasarkan durasi dan intensitas detak jantung / laju dari data aktivitas yang ditarik dari Tredict.
