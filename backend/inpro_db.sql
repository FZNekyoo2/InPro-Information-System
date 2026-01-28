-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 27, 2026 at 02:21 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inpro_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `pegawai`
--

CREATE TABLE `pegawai` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nomor Induk Pegawai 18 digit',
  `pangkat` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Contoh: Pembina, Penata Muda',
  `golongan` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Contoh: IV/a, III/b',
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_kerja` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pegawai`
--

INSERT INTO `pegawai` (`id`, `nama`, `nip`, `pangkat`, `golongan`, `jabatan`, `unit_kerja`, `tanggal_lahir`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Budi Santoso, S.H., M.H.', '196501051990031001', 'Pembina Utama Muda', 'IV/c', 'Kepala Dinas', 'Dinas Pendidikan', '1965-01-05', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(2, 'Ir. Siti Nurjanah, M.T.', '197203121995122001', 'Pembina', 'IV/a', 'Sekretaris Dinas', 'Dinas Pendidikan', '1972-03-12', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(3, 'Ahmad Wijaya, S.Kom.', '198506152010011002', 'Penata Tk. I', 'III/d', 'Kepala Sub Bagian TI', 'Bagian Umum', '1985-06-15', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(4, 'Dewi Anggraini, S.E.', '199001102015032001', 'Penata', 'III/c', 'Staff Keuangan', 'Bagian Keuangan', '1990-01-10', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(5, 'Muhammad Rizki, S.T.', '199208252018011001', 'Penata Muda Tk. I', 'III/b', 'Staff Teknis', 'Seksi Perencanaan', '1992-08-25', '2026-01-25 16:26:24', '2026-01-25 16:26:24');

-- --------------------------------------------------------

--
-- Table structure for table `surat`
--

CREATE TABLE `surat` (
  `id` int NOT NULL,
  `nomor_surat` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_unik` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kode unik surat format: ZT-XXXXXX',
  `jenis_surat` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Surat Masuk, Surat Keluar, SK, dll',
  `pengirim` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `penerima` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perihal` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_surat` date NOT NULL,
  `qr_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path ke file QR code',
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path ke file surat (PDF)',
  `status` enum('draft','proses','selesai','ditolak') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `surat`
--

INSERT INTO `surat` (`id`, `nomor_surat`, `kode_unik`, `jenis_surat`, `pengirim`, `penerima`, `perihal`, `tanggal_surat`, `qr_code`, `file_path`, `status`, `created_at`, `updated_at`) VALUES
(1, '001/UNIMED/MM/SKRIPSI/03', 'ZT-EFBT4D', 'Surat Keputusan', 'Jurusan Matematika UNIMED', 'M. Fikri Zulfi', 'Surat Keputusan Skripsi', '2026-01-26', '/uploads/qrcodes/qr-ZT-EFBT4D-1769414021114.png', '/uploads/attachment-1769414470150-906846304.docx', 'selesai', '2026-01-26 07:53:41', '2026-01-26 08:18:10'),
(2, 'owakodakowa', 'ZT-V8HDB5', 'Surat Masuk', 'dawda', 'dwadad', 'wdadada', '2026-01-22', '/uploads/qrcodes/qr-ZT-V8HDB5-1769415528709.png', NULL, 'proses', '2026-01-26 08:18:48', '2026-01-26 08:19:02');

-- --------------------------------------------------------

--
-- Table structure for table `surat_comments`
--

CREATE TABLE `surat_comments` (
  `id` int NOT NULL,
  `surat_id` int NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `surat_comments`
--

INSERT INTO `surat_comments` (`id`, `surat_id`, `username`, `comment`, `created_at`) VALUES
(2, 1, 'admin', 'BUAT NILAINYA A YA\n', '2026-01-26 08:01:50');

-- --------------------------------------------------------

--
-- Table structure for table `tahapan`
--

CREATE TABLE `tahapan` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urutan` int NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tahapan`
--

INSERT INTO `tahapan` (`id`, `nama`, `urutan`, `color`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 'Pendaftaran', 1, '#f59e0b', 1, '2026-01-26 05:01:45', '2026-01-26 07:11:51'),
(2, 'Verifikasi', 2, '#3b82f6', 1, '2026-01-26 05:01:45', '2026-01-26 07:13:49'),
(3, 'Persetujuan', 3, '#8b5cf6', 1, '2026-01-26 05:01:45', '2026-01-26 07:15:29'),
(4, 'Pidana dan TTD', 4, '#931515', 1, '2026-01-26 05:02:08', '2026-01-26 08:12:27'),
(5, 'TTD Kabid', 5, '#3b82f6', 1, '2026-01-26 06:58:53', '2026-01-26 08:12:37'),
(6, 'Selesai', 6, '#10b981', 1, '2026-01-26 05:01:45', '2026-01-26 08:12:44');

-- --------------------------------------------------------

--
-- Table structure for table `template_surat`
--

CREATE TABLE `template_surat` (
  `id` int NOT NULL,
  `nama_template` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Jenis template: SK, Surat Tugas, dll',
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Path ke file template',
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `template_surat`
--

INSERT INTO `template_surat` (`id`, `nama_template`, `jenis`, `file_path`, `deskripsi`, `created_at`, `updated_at`) VALUES
(1, 'Template Surat Keputusan', 'SK', '/uploads/templates/template-sk.docx', 'Template untuk membuat Surat Keputusan', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(2, 'Template Surat Tugas', 'ST', '/uploads/templates/template-st.docx', 'Template untuk Surat Tugas', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(3, 'Template Surat Masuk', 'SM', '/uploads/templates/template-sm.docx', 'Template untuk mencatat Surat Masuk', '2026-01-25 16:26:24', '2026-01-25 16:26:24'),
(4, 'Template Surat Keluar', 'SKel', '/uploads/templates/template-skel.docx', 'Template untuk Surat Keluar', '2026-01-25 16:26:24', '2026-01-25 16:26:24');

-- --------------------------------------------------------

--
-- Table structure for table `tracking`
--

CREATE TABLE `tracking` (
  `id` int NOT NULL,
  `surat_id` int NOT NULL,
  `tahap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tahap 1, Tahap 2, dst',
  `keterangan` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi proses di tahap ini',
  `pegawai_id` int DEFAULT NULL COMMENT 'PNS yang menangani tahap ini',
  `admin_username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_proses` datetime DEFAULT NULL COMMENT 'Kapan tahap ini diproses',
  `status` enum('menunggu','proses','selesai') COLLATE utf8mb4_unicode_ci DEFAULT 'menunggu',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tracking`
--

INSERT INTO `tracking` (`id`, `surat_id`, `tahap`, `keterangan`, `pegawai_id`, `admin_username`, `tanggal_proses`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', NULL, 'system', '2026-01-26 15:24:31', 'proses', '2026-01-26 07:53:41', '2026-01-26 08:24:31'),
(6, 1, 'Tahap 1 - Pendaftaran', 'Dipindahkan ke Pendaftaran', NULL, 'admin', '2026-01-26 15:09:05', 'proses', '2026-01-26 08:09:05', '2026-01-26 08:09:05'),
(9, 1, 'Tahap 4 - Pidana dan TTD', 'Dipindahkan ke Pidana dan TTD', NULL, 'admin', '2026-01-26 15:09:18', 'proses', '2026-01-26 08:09:18', '2026-01-26 08:09:18'),
(11, 1, 'Tahap 4 - Pidana dan TTD', 'Dipindahkan ke Pidana dan TTD', NULL, 'admin', '2026-01-26 15:11:06', 'proses', '2026-01-26 08:11:06', '2026-01-26 08:11:06'),
(13, 1, 'Tahap 1 - Pendaftaran', 'Dipindahkan ke Pendaftaran', NULL, 'admin', '2026-01-26 15:11:08', 'proses', '2026-01-26 08:11:08', '2026-01-26 08:11:08'),
(14, 1, 'Tahap 2 - Verifikasi', 'Dipindahkan ke Verifikasi', NULL, 'admin', '2026-01-26 15:11:12', 'proses', '2026-01-26 08:11:12', '2026-01-26 08:11:12'),
(15, 1, 'Tahap 3 - Persetujuan', 'Dipindahkan ke Persetujuan', NULL, 'admin', '2026-01-26 15:11:13', 'proses', '2026-01-26 08:11:13', '2026-01-26 08:11:13'),
(16, 1, 'Tahap 4 - Pidana dan TTD', 'Dipindahkan ke Pidana dan TTD', NULL, 'admin', '2026-01-26 15:11:14', 'proses', '2026-01-26 08:11:14', '2026-01-26 08:11:14'),
(17, 1, 'Tahap 3 - Persetujuan', 'Dipindahkan ke Persetujuan', NULL, 'admin', '2026-01-26 15:12:58', 'proses', '2026-01-26 08:12:58', '2026-01-26 08:12:58'),
(18, 1, 'Tahap 4 - Pidana dan TTD', 'Dipindahkan ke Pidana dan TTD', NULL, 'admin', '2026-01-26 15:12:59', 'proses', '2026-01-26 08:12:59', '2026-01-26 08:12:59'),
(19, 1, 'Tahap 2 - Verifikasi', 'Dipindahkan ke Verifikasi', NULL, 'admin', '2026-01-26 15:13:00', 'proses', '2026-01-26 08:13:00', '2026-01-26 08:13:00'),
(20, 1, 'Tahap 3 - Persetujuan', 'Dipindahkan ke Persetujuan', NULL, 'admin', '2026-01-26 15:13:01', 'proses', '2026-01-26 08:13:01', '2026-01-26 08:13:01'),
(21, 1, 'Tahap 4 - Pidana dan TTD', 'Dipindahkan ke Pidana dan TTD', NULL, 'admin', '2026-01-26 15:13:05', 'proses', '2026-01-26 08:13:05', '2026-01-26 08:13:05'),
(22, 1, 'Tahap 5 - TTD Kabid', 'Dipindahkan ke TTD Kabid', NULL, 'admin', '2026-01-26 15:18:09', 'proses', '2026-01-26 08:18:09', '2026-01-26 08:18:09'),
(23, 1, 'Tahap 6 - Selesai', 'Dipindahkan ke Selesai', NULL, 'admin', '2026-01-26 15:18:10', 'selesai', '2026-01-26 08:18:10', '2026-01-26 08:18:10'),
(33, 2, 'Tahap 1 - Pendaftaran', 'Dipindahkan ke Pendaftaran', NULL, 'admin', '2026-01-26 15:26:21', 'proses', '2026-01-26 08:26:21', '2026-01-26 08:26:21'),
(34, 2, 'Tahap 2 - Verifikasi', 'Dipindahkan ke Verifikasi', NULL, 'admin', '2026-01-26 15:26:47', 'proses', '2026-01-26 08:26:47', '2026-01-26 08:26:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','super_admin') COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`, `updated_at`) VALUES
(4, 'admin', '$2a$10$vHQjinDO7t2MJw83o1A6Xudu3oZ4EEwVlKIkyTfPx9K9fxy.wHqYK', 'admin@inpro.go.id', 'admin', '2026-01-25 16:26:24', '2026-01-25 17:03:51'),
(5, 'superadmin', '$2a$10$vHQjinDO7t2MJw83o1A6Xudu3oZ4EEwVlKIkyTfPx9K9fxy.wHqYK', 'superadmin@inpro.go.id', 'super_admin', '2026-01-25 16:26:24', '2026-01-25 17:03:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD KEY `idx_nip` (`nip`),
  ADD KEY `idx_nama` (`nama`);

--
-- Indexes for table `surat`
--
ALTER TABLE `surat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_surat` (`nomor_surat`),
  ADD UNIQUE KEY `kode_unik` (`kode_unik`),
  ADD KEY `idx_nomor_surat` (`nomor_surat`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_tanggal` (`tanggal_surat`),
  ADD KEY `idx_kode_unik` (`kode_unik`);

--
-- Indexes for table `surat_comments`
--
ALTER TABLE `surat_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_surat_comments_surat_id` (`surat_id`);

--
-- Indexes for table `tahapan`
--
ALTER TABLE `tahapan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tahapan_urutan` (`urutan`),
  ADD KEY `idx_tahapan_aktif` (`aktif`);

--
-- Indexes for table `template_surat`
--
ALTER TABLE `template_surat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_jenis` (`jenis`);

--
-- Indexes for table `tracking`
--
ALTER TABLE `tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pegawai_id` (`pegawai_id`),
  ADD KEY `idx_surat_id` (`surat_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `surat`
--
ALTER TABLE `surat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `surat_comments`
--
ALTER TABLE `surat_comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tahapan`
--
ALTER TABLE `tahapan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `template_surat`
--
ALTER TABLE `template_surat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tracking`
--
ALTER TABLE `tracking`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `surat_comments`
--
ALTER TABLE `surat_comments`
  ADD CONSTRAINT `surat_comments_ibfk_1` FOREIGN KEY (`surat_id`) REFERENCES `surat` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tracking`
--
ALTER TABLE `tracking`
  ADD CONSTRAINT `tracking_ibfk_1` FOREIGN KEY (`surat_id`) REFERENCES `surat` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tracking_ibfk_2` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
