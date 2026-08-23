<!--
Sync Impact Report:
- Version change: Initial Scaffold -> 1.0.0
- Added Principles:
  - I. Kepatuhan Pelindungan Data Pribadi (UU PDP) & Keamanan Data
  - II. Autentikasi RBAC & Isolasi Data RLS (Supabase)
  - III. Batas Performa Waktu Muat (Load Time <= 3s)
  - IV. UX Non-Blocking & Skeleton Loading
  - V. Akses Halaman Legal & Disclaimer Kesehatan
- Added Sections: Keamanan & Privasi Data, Standar Kinerja & Antarmuka, Kepatuhan Hukum & Medis
- Follow-up TODOs: None
-->

# Runcoach Constitution

## Core Principles

### I. Kepatuhan Pelindungan Data Pribadi (UU PDP) & Keamanan Data
Aplikasi MUST mematuhi seluruh standar keamanan dan regulasi Undang-Undang Pelindungan Data Pribadi (UU PDP). Seluruh kata sandi pengguna dan data metrik lari yang tersimpan di dalam database MUST menggunakan enkripsi dan hashing standar industri (misalnya hashing kredensial bawaan Supabase Auth dan enkripsi data sensitif).

### II. Autentikasi RBAC & Isolasi Data RLS (Supabase)
Autentikasi dan otorisasi MUST memanfaatkan sistem Role-Based Access Control (RBAC) bawaan Supabase untuk memisahkan hak akses peran Coach (Pelatih) dan Runner (Pelari). Row Level Security (RLS) pada database Supabase MUST diterapkan secara ketat dan diuji untuk memastikan data pelari terisolasi sepenuhnya (pelari DILARANG dapat melihat log latihan pelari lain tanpa izin otorisasi).

### III. Batas Performa Waktu Muat (Load Time <= 3s)
Waktu muat (load time) untuk setiap navigasi antarmuka pada Web Dashboard maupun Progressive Web App (PWA) MUST tidak boleh melebihi 3 detik. Pengembang MUST mengoptimalkan ukuran bundle, query data, serta strategi caching untuk menjamin ambang batas performa ini.

### IV. UX Non-Blocking & Skeleton Loading
Pengambilan data secara asinkron dari server MUST menggunakan teknik skeleton loading pada komponen antarmuka terkait. Animasi spinner layar penuh (full-screen blocking spinner) yang menghalangi atau memblokir navigasi pengguna DILARANG digunakan dalam kondisi apa pun.

### V. Akses Halaman Legal & Disclaimer Kesehatan
Aplikasi MUST menyediakan templat halaman statis publik untuk Syarat & Ketentuan (Terms of Service) dan Kebijakan Privasi (Privacy Policy). Halaman ini MUST secara eksplisit mengakomodasi disclaimer kesehatan dan medis (health/medical disclaimer) guna melindungi platform dari liabilitas aktivitas fisik pengguna.

## Keamanan & Privasi Data

- **Proteksi Data Sensitif**: Data identitas pelari dan data pelacakan aktivitas fisik dikategorikan sebagai data pribadi yang dilindungi UU PDP.
- **Kebijakan Akses Database**: Seluruh query data dari klien web/PWA ke Supabase MUST melewati kebijakan RLS. Penggunaan `service_role` key di sisi klien DILARANG.

## Standar Kinerja & Antarmuka

- **Antarmuka Responsif (Web & PWA)**: Pengalaman pengguna di perangkat seluler (PWA) dan desktop (Web Dashboard) wajib konsisten.
- **Strategi Loading**: Penggunaan layout placeholder / skeleton UI diperhitungkan sebagai bagian dari batas waktu muat 3 detik.

## Kepatuhan Hukum & Medis

- **Health Disclaimer**: Pengguna wajib menyetujui pernyataan disclaimer kesehatan sebelum mengakses fitur rencana latihan lari.

## Governance

- **Amandemen**: Setiap perubahan pada Konstitusi Runcoach wajib melalui dokumentasi ringkasan perubahan (Sync Impact Report) dan persetujuan pengembang/pemangku kepentingan.
- **Peninjauan Kepatuhan**: Seluruh Pull Request dan implementasi fitur baru wajib diverifikasi terhadap aturan RLS Supabase, batas performa 3 detik, dan kepatuhan UU PDP.

**Version**: 1.0.0 | **Ratified**: 2026-08-23 | **Last Amended**: 2026-08-23
