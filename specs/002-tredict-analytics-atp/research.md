# Phase 0 Research: Pembaruan Platform LariSync - Otomasi Tredict, VDOT/FTHR, Periodisasi ATP & Dasbor Training Load

## Overview

Riset teknis ini dilakukan untuk menentukan pilihan arsitektur, algoritma kalkulasi zona intensitas, visualisasi grafik beban latihan (Training Load), dan strategi integrasi aman Tredict API.

---

## 1. Algoritma & Formulas Zona Intensitas (VDOT & FTHR)

### Decision
Menggunakan implementasi algoritma matematika Jack Daniels' Running Formula untuk perhitungan VDOT (Pace Zones: Easy, Marathon, Threshold, Interval, Repetition) dan Joe Friel 7-zone Heart Rate Model untuk FTHR.

### Rationale
- **VDOT**: Standar emas fisiologi lari yang mengonversi waktu tempuh atau skor VDOT ke laju per kilometer ($min/km$) untuk 5 zona intensitas utama:
  - **Easy (E)**: 59% - 74% $VO_2max$ (Lari pemulihan & daya tahan dasar)
  - **Marathon (M)**: 75% - 84% $VO_2max$ (Spesifik laju maraton)
  - **Threshold (T)**: 85% - 88% $VO_2max$ (Ambang laktat / tempo)
  - **Interval (I)**: 95% - 100% $VO_2max$ (Kapasitas aerobik maks)
  - **Repetition (R)**: > 105% $VO_2max$ (Ekonomi lari & kecepatan)
- **FTHR**: Menghitung rentang detak jantung target ($bpm$) berdasarkan rasio persentase dari FTHR (Zone 1 s.d. Zone 5).

### Alternatives Considered
- *Kalkulasi berbasis RPE / Subjective Effort*: Ditolak karena terlalu subjektif dan tidak presisi untuk atlet binaan pelatih.

---

## 2. Visualisasi Grafik Training Load (CTL, ATL, TSB)

### Decision
Menggunakan library **Recharts** (`recharts`) untuk merender grafik area/garis *time-series* beban latihan.

### Rationale
- Recharts mendukung Server Component Next.js dan merender SVG responsif dengan cepat.
- Memungkinkan overlay 3 kurva sekaligus:
  - **CTL (Chronic Training Load / Fitness)**: Exponential Moving Average 42 hari dari TSS harian.
  - **ATL (Acute Training Load / Fatigue)**: Exponential Moving Average 7 hari dari TSS harian.
  - **TSB (Training Stress Balance / Form)**: Selisih $CTL - ATL$.

### Alternatives Considered
- *Chart.js / Chartjs-2*: Memerlukan canvas element dan konfigurasi client-side wrapper yang lebih berat.
- *D3.js*: Terlalu low-level untuk kebutuhan grafik time-series sederhana.

---

## 3. Desain Antarmuka Kalender Periodisasi (ATP)

### Decision
Menggunakan antarmuka grid mingguan (52 minggu) berbasis Tailwind CSS dengan komponen interaktif pendeteksi klik/drag untuk menetapkan fase periodisasi: `Prep`, `Base`, `Build`, `Peak`, `Race`, `Transition`.

### Rationale
- Kode warna visual yang jelas:
  - **Prep**: Indigo/Blue
  - **Base**: Green/Emerald
  - **Build**: Amber/Yellow
  - **Peak**: Orange
  - **Race**: Red/Rose
  - **Transition**: Slate/Gray
- Menyimpan entri per minggu di tabel `periodization_phases` Supabase.

---

## 4. Keamanan Simpanan Tredict API Token

### Decision
Setiap pelari/pelatih menyimpan Tredict Access Token yang dienkrpsi di database Supabase pada tabel `tredict_integrations`. Penarikan data hanya dilakukan dari Next.js Server-side API Route (`/api/tredict/sync`) menggunakan token tersebut tanpa memaparkan token ke client.

### Rationale
- Memenuhi Prinsip Konstitusi I (UU PDP & Keamanan Data).
- Mencegah kebocoran token di jaringan peramban (browser network tab).
