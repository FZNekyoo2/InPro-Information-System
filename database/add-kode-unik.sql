-- Step 1: Add kode_unik column as NULLABLE first (untuk data existing)
ALTER TABLE surat 
ADD COLUMN kode_unik VARCHAR(20) NULL COMMENT 'Kode unik surat format: ZT-XXXXXX' 
AFTER nomor_surat;

-- Step 2: Generate kode unik untuk data yang sudah ada
-- Anda bisa generate manual atau hapus data lama dan buat baru
-- Jika ada data existing, jalankan ini untuk setiap record:
-- UPDATE surat SET kode_unik = 'ZT-XXXXXX' WHERE id = [id_surat];

-- Step 3: Setelah semua data punya kode_unik, baru tambahkan constraint
-- Uncomment baris di bawah setelah semua data sudah punya kode_unik:
-- ALTER TABLE surat MODIFY COLUMN kode_unik VARCHAR(20) NOT NULL;
-- ALTER TABLE surat ADD UNIQUE INDEX idx_kode_unik (kode_unik);
