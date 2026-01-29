-- Migration: Tambah kolom kode_unik
-- PERINGATAN: Script ini akan menghapus semua data surat dan tracking

-- Hapus data tracking dulu (karena ada foreign key ke surat)
DELETE FROM tracking;

-- Hapus data surat
DELETE FROM surat;

-- Reset auto increment
ALTER TABLE tracking AUTO_INCREMENT = 1;
ALTER TABLE surat AUTO_INCREMENT = 1;

-- Tambah kolom kode_unik dengan constraint
ALTER TABLE surat 
ADD COLUMN kode_unik VARCHAR(20) UNIQUE NOT NULL COMMENT 'Kode unik surat format: ZT-XXXXXX' 
AFTER nomor_surat;

-- Tambah index untuk performa
CREATE INDEX idx_kode_unik ON surat(kode_unik);

-- Selesai
SELECT 'Migration berhasil! Kolom kode_unik sudah ditambahkan.' AS status;
