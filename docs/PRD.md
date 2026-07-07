# 📄 Product Requirements Document (PRD)

## CMS Sekolah — School Content & Management System

**Versi:** 2.1.0 | **Tanggal:** Juli 2025 | **Status:** ✅ Approved  
**Tech Stack:** NestJS 10 + Next.js 15 (TypeScript Full Stack) | **Arsitektur:** Monorepo (Turborepo)

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Personas](#3-personas)
4. [Scope (In Scope / Out of Scope)](#4-scope-in-scope--out-of-scope)
5. [Functional Requirements](#5-functional-requirements)
6. [Non Functional Requirements](#6-non-functional-requirements)
7. [User Journey](#7-user-journey)
8. [User Stories](#8-user-stories)
9. [Acceptance Criteria](#9-acceptance-criteria)
10. [API Boundary](#10-api-boundary)
11. [Database Domain](#11-database-domain)
12. [Module Dependency](#12-module-dependency)
13. [Permission Matrix (ACL)](#13-permission-matrix-acl)
14. [Milestone & Sprint Planning](#14-milestone--sprint-planning)
15. [Risk & Mitigation](#15-risk--mitigation)
16. [Future Roadmap](#16-future-roadmap)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

**CMS Sekolah** adalah platform manajemen sekolah terpadu berbasis web yang mengintegrasikan pengelolaan website publik, administrasi data induk, Sistem Penerimaan Murid Baru (SPMB) yang fleksibel, presensi harian, serta direktori guru, siswa, dan alumni dalam satu ekosistem digital.

Dibangun dengan arsitektur modern **NestJS 10** sebagai backend API dan **Next.js 15** (App Router + React 19) sebagai frontend, sistem ini memberikan performa tinggi, keamanan kuat, dan pengalaman pengguna yang mulus di semua peran. Sistem ini dirancang untuk menyelesaikan masalah fragmentasi data, proses PPDB yang kaku, dan beban administrasi tinggi di lingkungan sekolah maupun yayasan pendidikan.

---

## 2. Product Vision

> _"Menyediakan satu platform digital terintegrasi yang memberdayakan sekolah dan yayasan untuk mengelola operasional, penerimaan siswa, dan komunikasi publik secara transparan, otomatis, dan efisien."_

**Core Values:**

- **Terintegrasi:** Menghapus silo data antara website, PPDB, dan administrasi.
- **Fleksibel:** Mendukung multi-cabang, multi-gelombang, dan konfigurasi seleksi dinamis.
- **Transparan:** Memberikan visibilitas real-time bagi calon siswa dan orang tua.
- **Efisien:** Mengotomatisasi proses manual seperti seleksi nilai dan rekapitulasi presensi.

---

## 3. Personas

| Peran            | Deskripsi                              | Kebutuhan Utama                                                  |
| :--------------- | :------------------------------------- | :--------------------------------------------------------------- |
| **Superadmin**   | Pengelola sistem tingkat yayasan/pusat | Akses semua cabang, konfigurasi global, backup, ACL.             |
| **Admin Cabang** | Kepala sekolah / staf IT tiap cabang   | Kelola konten web, data siswa/GTK, konfigurasi SPMB cabangnya.   |
| **Operator**     | Panitia SPMB / staf administrasi       | Verifikasi pendaftar, input nilai ujian, cetak bukti, laporan.   |
| **Guru**         | Tenaga pendidik                        | Isi presensi cepat, agenda mengajar, posting artikel (moderasi). |
| **Siswa**        | Peserta didik aktif                    | Lihat presensi sendiri, akses informasi sekolah.                 |
| **Calon Siswa**  | Pendaftar SPMB                         | Daftar, isi data, upload dokumen, pantau status, cetak bukti.    |
| **Alumni**       | Lulusan                                | Daftar direktori, terhubung komunitas.                           |
| **Pengunjung**   | Orang tua, masyarakat umum             | Baca berita, pengumuman, informasi sekolah.                      |

---

## 4. Scope (In Scope / Out of Scope)

### ✅ In Scope (v2.1.0)

- **Website & CMS Publik:** Blog, halaman statis, galeri, slider, kontak, newsletter.
- **Master Data Terpusat:** Tahun akademik, kelas, program, referensi data pokok.
- **SPMB (Penerimaan Siswa):** Multi-branch, multi-gelombang, persyaratan dinamis, seleksi otomatis berbobot.
- **Direktori & Manajemen:** Data Siswa, GTK, Alumni dengan fitur import Excel.
- **Presensi:** Presensi harian (rombel), per mata pelajaran, dan GTK.
- **Sistem Administrasi:** Dynamic ACL (CASL), backup, pengaturan global.

### ❌ Out of Scope (v2.1.0)

- Modul Keuangan / SPP / Akuntansi.
- Learning Management System (LMS) / E-Learning.
- Aplikasi Mobile Native (iOS/Android) — _menggunakan PWA_.
- Integrasi _real-time_ / _push_ data ke Dapodik / EMIS (hanya ekspor).

---

## 5. Functional Requirements

### 5.1 Modul Website & CMS (P0)

| ID    | Fitur               | Deskripsi                                          |
| :---- | :------------------ | :------------------------------------------------- |
| F-001 | Image Slider        | Kelola slider beranda dengan gambar, teks, tautan. |
| F-002 | Blog/Artikel        | CRUD tulisan dengan kategori, tag, penulis.        |
| F-003 | Halaman Statis      | Halaman seperti "Tentang Kami", "Visi Misi".       |
| F-004 | Komentar            | Pengunjung bisa berkomentar (moderasi admin).      |
| F-007 | Album Foto & Galeri | Upload foto dan kelompokkan dalam album.           |
| F-012 | Pesan Masuk         | Form kontak, masuk ke dashboard admin.             |
| F-016 | Navigasi Menu       | Menu dinamis, multi-level.                         |

### 5.2 Modul Master Data & Direktori (P0)

| ID    | Fitur                   | Deskripsi                                        |
| :---- | :---------------------- | :----------------------------------------------- |
| F-020 | Direktori Peserta Didik | CRUD lengkap data siswa.                         |
| F-021 | Import via Excel        | Import siswa/GTK via Excel (validasi per baris). |
| F-024 | Direktori Alumni        | Registrasi mandiri dan verifikasi alumni.        |
| F-028 | Rombongan Belajar       | Pengaturan kelas paralel / rombel.               |

### 5.3 Modul SPMB (P0)

| ID    | Fitur               | Deskripsi                                                |
| :---- | :------------------ | :------------------------------------------------------- |
| F-030 | Form Dinamis        | Field dapat diaktifkan/dinonaktifkan dari admin.         |
| F-032 | Kuota & Offering    | Kuota per kombinasi Periode + Cabang + Grade + Track.    |
| F-035 | Upload Dokumen      | Drag-and-drop dengan status verifikasi real-time.        |
| F-036 | Konfigurasi Seleksi | Bobot nilai rapor dan ujian dalam format JSON fleksibel. |
| F-037 | Seleksi Otomatis    | Ranking otomatis berdasarkan total skor dan kuota.       |
| F-034 | Cetak Bukti         | Generate PDF bukti pendaftaran dengan nomor registrasi.  |

### 5.4 Modul Presensi (P0)

| ID    | Fitur               | Deskripsi                                          |
| :---- | :------------------ | :------------------------------------------------- |
| F-050 | Presensi Harian     | Presensi pagi per rombel.                          |
| F-051 | Presensi Mapel      | Presensi per mata pelajaran oleh guru mapel.       |
| F-057 | Form Presensi Cepat | Checkbox cepat (Hadir/Izin/Sakit/Alpa) untuk guru. |

---

## 6. Non Functional Requirements

| Kategori          | Kriteria                        | Target / Metrik                                           |
| :---------------- | :------------------------------ | :-------------------------------------------------------- |
| **Performance**   | Waktu muat halaman publik (LCP) | < 3 detik                                                 |
| **Performance**   | Waktu proses seleksi otomatis   | < 30 detik untuk 1000 pendaftar                           |
| **Performance**   | Waktu input presensi per kelas  | < 2 menit                                                 |
| **Reliability**   | Uptime sistem                   | ≥ 99.5%                                                   |
| **Security**      | Autentikasi & Otorisasi         | JWT + CASL (Row-level & Action-level security)            |
| **Security**      | Upload File                     | Validasi mimetype, ukuran maks, antivirus scan (opsional) |
| **Usability**     | Kepuasan pengguna (CSAT)        | ≥ 4.0 (skala 1-5)                                         |
| **Compatibility** | Browser Support                 | Chrome, Firefox, Edge (2 versi terakhir)                  |
| **Accessibility** | WCAG Compliance                 | Minimal WCAG 2.1 Level AA                                 |

---

## 7. User Journey

### 🎓 Journey 1: Calon Siswa (Pendaftaran SPMB)

1. **Akses & Registrasi:** Mengunjungi web sekolah → Klik "Daftar SPMB" → Isi Email & Password → Verifikasi Email.
2. **Lengkapi Profil:** Login → Mengisi data diri, alamat, data orang tua, dan sekolah asal.
3. **Pilih Offering:** Melihat daftar cabang, jalur, dan gelombang yang tersedia → Memilih salah satu.
4. **Upload & Input:** Upload dokumen persyaratan (KK, SKL) → Input nilai rapor semester 1-5.
5. **Review & Submit:** Melihat ringkasan data → Klik "Submit" (Status: DRAFT → SUBMITTED).
6. **Pasca-Submit:** Cetak bukti pendaftaran (PDF) → Memantau status verifikasi dan pengumuman kelulusan.

### 🛠️ Journey 2: Operator SPMB (Seleksi Penerimaan)

1. **Konfigurasi:** Membuat Periode & Offering → Menentukan kuota & bobot seleksi (JSON).
2. **Verifikasi:** Membuka daftar pendaftar → Memeriksa dokumen → Status dokumen: VERIFIED/REJECTED.
3. **Input Nilai:** Menginput nilai ujian tulis/wawancara (jika ada).
4. **Eksekusi Seleksi:** Klik tombol "Jalankan Seleksi Otomatis" → Sistem meranking dan menentukan ACCEPTED/REJECTED.
5. **Pelaporan:** Mengekspor laporan statistik penerimaan ke Excel/PDF.

---

## 8. User Stories

**Calon Siswa**

- _Sebagai_ calon siswa, _saya ingin_ mendaftar akun dengan email, _agar_ bisa memulai proses pendaftaran.
- _Saya ingin_ mengunggah dokumen persyaratan dan melihat status verifikasinya secara real-time.
- _Saya ingin_ memasukkan nilai rapor saya semester demi semester dengan validasi yang jelas.
- _Setelah mengirim_, saya ingin mencetak bukti pendaftaran resmi dan memantau status akhir saya.

**Operator SPMB**

- _Sebagai_ operator, _saya ingin_ membuat periode dan offering dengan kuota spesifik per cabang.
- _Saya ingin_ menentukan persyaratan dokumen yang harus diunggah calon siswa secara dinamis.
- _Saya ingin_ menjalankan proses seleksi otomatis dan melihat hasil peringkat berdasarkan bobot yang saya atur.

**Guru**

- _Sebagai_ guru, _saya ingin_ mengisi daftar hadir siswa dalam satu halaman cepat (kurang dari 2 menit).
- _Saya ingin_ mencatat materi ajar saat mengisi presensi untuk keperluan laporan.

**Superadmin**

- _Sebagai_ superadmin, _saya ingin_ mengelola banyak cabang dari satu dashboard dan mengatur hak akses (ACL) secara detail.

---

## 9. Acceptance Criteria

### AC-001: Seleksi Otomatis SPMB

- [ ] Sistem membaca `selectionConfig` (JSON) dari Offering.
- [ ] Menghitung rata-rata nilai rapor hanya dari mapel yang dikonfigurasi.
- [ ] Total Skor = `(rata_rapor * bobot_rapor) + (rata_ujian * bobot_ujian)`.
- [ ] Mengurutkan pendaftar berdasarkan Total Skor (Descending).
- [ ] Memberikan status `ACCEPTED` untuk N pendaftar teratas (sesuai kuota), sisanya `REJECTED`.
- [ ] Proses selesai < 30 detik untuk 1000 pendaftar.

### AC-002: Form Multi-Step Siswa

- [ ] Siswa dapat menyimpan progress di setiap langkah (tersimpan sebagai `DRAFT`).
- [ ] Validasi per langkah; tombol "Next" disabled jika field wajib kosong.
- [ ] Setelah status berubah ke `SUBMITTED`, data terkunci (read-only).
- [ ] PDF bukti pendaftaran ter-generate dengan data lengkap dan nomor registrasi unik.

### AC-003: Dynamic ACL (CASL)

- [ ] Admin dapat membuat peran baru dan mengatur izin (ability) ke modul tertentu.
- [ ] Perubahan izin berlaku instan tanpa restart server.
- [ ] Setiap endpoint API dilindungi Guard yang memeriksa ability CASL.
- [ ] UI menyembunyikan tombol/aksi (misal: tombol Hapus) jika user tidak memiliki akses.

### AC-004: Import Excel

- [ ] Template Excel disediakan untuk diunduh.
- [ ] Server memvalidasi setiap baris; mengembalikan pesan error spesifik per baris jika gagal.
- [ ] Berhasil mengimpor 1000 baris data < 30 detik.

---

## 10. API Boundary

Arsitektur backend menggunakan **NestJS 10** dengan pendekatan modular RESTful API.

| Module          | Endpoint Prefix | Deskripsi Utama                                                         |
| :-------------- | :-------------- | :---------------------------------------------------------------------- |
| **Auth**        | `/api/auth`     | Register, Login, Refresh Token, Verify Email, Forgot Password.          |
| **CMS**         | `/api/cms`      | Posts, Pages, Sliders, Categories, Comments, Menus.                     |
| **Master Data** | `/api/master`   | AcademicYears, Branches, EntryGrades, Tracks, References.               |
| **Users**       | `/api/users`    | Students, Teachers, Alumni, Staff (CRUD & Import Excel).                |
| **SPMB**        | `/api/spmb`     | Periods, Offerings, Requirements, Registrations, Documents, Selections. |
| **Presence**    | `/api/presence` | Daily Attendance, Subject Attendance, Schedules, Reports.               |
| **ACL**         | `/api/acl`      | Roles, Permissions, Abilities (CASL rules).                             |
| **Media**       | `/api/media`    | File upload, image processing, watermarking.                            |

---

## 11. Database Domain

Menggunakan **PostgreSQL 16** dengan **Prisma 6 ORM**. Berikut adalah entitas domain utama:

```prisma
// Domain Inti
model User { id, email, password, role, branchId, ... }
model Branch { id, name, address, ... } // Multi-tenant dalam 1 DB

// Domain SPMB
model AcademicYear { id, name, isActive }
model AdmissionPeriod { id, academicYearId, name, startDate, endDate }
model AdmissionOffering { id, periodId, branchId, entryGradeId, trackId, quota, selectionConfig(Json) }
model AdmissionRequirement { id, offeringId?, name, isMandatory }
model Registration { id, userId, offeringId, status, totalScore }
model RegistrationDocument { id, registrationId, requirementId, fileUrl, status }
model SubjectGrade { id, registrationId, subject, semester, score }
model ExamScore { id, registrationId, subject, score }

// Domain Presensi & Akademik
model Rombel { id, branchId, academicYearId, entryGradeId, name }
model PresenceRecord { id, rombelId, studentId, date, status, note }
```
