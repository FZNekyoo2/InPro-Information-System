-- =============================================
-- InPro Database Schema
-- Sistem Informasi Manager Activity dan Tracking
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS inpro_db;
USE inpro_db;

-- =============================================
-- Table: users
-- Deskripsi: Menyimpan data admin/user sistem
-- =============================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: pegawai
-- Deskripsi: Data Pegawai Negeri Sipil
-- =============================================
CREATE TABLE pegawai (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  nip VARCHAR(18) NOT NULL UNIQUE COMMENT 'Nomor Induk Pegawai 18 digit',
  pangkat VARCHAR(50) NOT NULL COMMENT 'Contoh: Pembina, Penata Muda',
  golongan VARCHAR(10) NOT NULL COMMENT 'Contoh: IV/a, III/b',
  jabatan VARCHAR(100) NOT NULL,
  unit_kerja VARCHAR(100) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nip (nip),
  INDEX idx_nama (nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: surat
-- Deskripsi: Data surat yang masuk/keluar
-- =============================================
CREATE TABLE surat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nomor_surat VARCHAR(100) NOT NULL UNIQUE,
  jenis_surat VARCHAR(50) NOT NULL COMMENT 'Surat Masuk, Surat Keluar, SK, dll',
  pengirim VARCHAR(100) NOT NULL,
  penerima VARCHAR(100) NOT NULL,
  perihal TEXT NOT NULL,
  tanggal_surat DATE NOT NULL,
  qr_code VARCHAR(255) COMMENT 'Path ke file QR code',
  file_path VARCHAR(255) COMMENT 'Path ke file surat (PDF)',
  status ENUM('draft', 'proses', 'selesai', 'ditolak') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nomor_surat (nomor_surat),
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal_surat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: tracking
-- Deskripsi: Tracking proses surat (4 tahap)
-- =============================================
CREATE TABLE tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  surat_id INT NOT NULL,
  tahap VARCHAR(100) NOT NULL COMMENT 'Tahap 1, Tahap 2, dst',
  keterangan TEXT COMMENT 'Deskripsi proses di tahap ini',
  pegawai_id INT COMMENT 'PNS yang menangani tahap ini',
  tanggal_proses DATETIME COMMENT 'Kapan tahap ini diproses',
  status ENUM('menunggu', 'proses', 'selesai') DEFAULT 'menunggu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (surat_id) REFERENCES surat(id) ON DELETE CASCADE,
  FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE SET NULL,
  INDEX idx_surat_id (surat_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: template_surat
-- Deskripsi: Template surat yang bisa didownload
-- =============================================
CREATE TABLE template_surat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_template VARCHAR(100) NOT NULL,
  jenis VARCHAR(50) NOT NULL COMMENT 'Jenis template: SK, Surat Tugas, dll',
  file_path VARCHAR(255) NOT NULL COMMENT 'Path ke file template',
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jenis (jenis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Insert sample admin user
-- Username: admin, Password: admin123
-- =============================================
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$YourHashedPasswordHere', 'admin@inpro.go.id', 'admin');

-- Note: Password hash above is placeholder. 
-- Run the following to generate real password:
-- In Node.js: bcrypt.hash('admin123', 10)
