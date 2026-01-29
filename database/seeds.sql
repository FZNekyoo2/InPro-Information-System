-- =============================================
-- InPro Database Sample Data
-- Data contoh untuk testing
-- =============================================

USE inpro_db;

-- Hapus data lama jika ada
DELETE FROM tracking;
DELETE FROM surat;
DELETE FROM template_surat;
DELETE FROM pegawai;
DELETE FROM users;

-- Sample Admin Users (password: admin123)
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@inpro.go.id', 'admin'),
('superadmin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'superadmin@inpro.go.id', 'super_admin');

-- Sample Pegawai
INSERT INTO pegawai (nama, nip, pangkat, golongan, jabatan, unit_kerja, tanggal_lahir) VALUES
('Dr. Budi Santoso, S.H., M.H.', '196501051990031001', 'Pembina Utama Muda', 'IV/c', 'Kepala Dinas', 'Dinas Pendidikan', '1965-01-05'),
('Ir. Siti Nurjanah, M.T.', '197203121995122001', 'Pembina', 'IV/a', 'Sekretaris Dinas', 'Dinas Pendidikan', '1972-03-12'),
('Ahmad Wijaya, S.Kom.', '198506152010011002', 'Penata Tk. I', 'III/d', 'Kepala Sub Bagian TI', 'Bagian Umum', '1985-06-15'),
('Dewi Anggraini, S.E.', '199001102015032001', 'Penata', 'III/c', 'Staff Keuangan', 'Bagian Keuangan', '1990-01-10'),
('Muhammad Rizki, S.T.', '199208252018011001', 'Penata Muda Tk. I', 'III/b', 'Staff Teknis', 'Seksi Perencanaan', '1992-08-25');

-- Sample Surat
INSERT INTO surat (nomor_surat, jenis_surat, pengirim, penerima, perihal, tanggal_surat, status, qr_code) VALUES
('001/SK/I/2026', 'Surat Keputusan', 'Kepala Dinas Pendidikan', 'Seluruh Pegawai', 'Penetapan Jadwal Kerja 2026', '2026-01-15', 'proses', '/uploads/qrcodes/qr-001.png'),
('002/ST/I/2026', 'Surat Tugas', 'Sekretaris Dinas', 'Ahmad Wijaya', 'Tugas Implementasi Sistem InPro', '2026-01-18', 'proses', '/uploads/qrcodes/qr-002.png'),
('003/SM/I/2026', 'Surat Masuk', 'Badan Kepegawaian Daerah', 'Kepala Dinas', 'Pemberitahuan Kenaikan Pangkat', '2026-01-20', 'selesai', '/uploads/qrcodes/qr-003.png');

-- Sample Tracking untuk Surat 1 (4 tahap)
INSERT INTO tracking (surat_id, tahap, keterangan, pegawai_id, tanggal_proses, status) VALUES
(1, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan ke sistem', 3, '2026-01-15 08:30:00', 'selesai'),
(1, 'Tahap 2 - Verifikasi', 'Verifikasi kelengkapan dokumen', 2, '2026-01-16 10:15:00', 'selesai'),
(1, 'Tahap 3 - Persetujuan', 'Menunggu persetujuan Kepala Dinas', 1, NULL, 'proses'),
(1, 'Tahap 4 - Distribusi', 'Menunggu proses distribusi', NULL, NULL, 'menunggu');

-- Sample Tracking untuk Surat 2
INSERT INTO tracking (surat_id, tahap, keterangan, pegawai_id, tanggal_proses, status) VALUES
(2, 'Tahap 1 - Pendaftaran', 'Surat tugas dibuat', 2, '2026-01-18 09:00:00', 'selesai'),
(2, 'Tahap 2 - Verifikasi', 'Verifikasi data pegawai', 4, '2026-01-18 11:00:00', 'selesai'),
(2, 'Tahap 3 - Penandatanganan', 'Menunggu tanda tangan Kepala Dinas', 1, NULL, 'proses'),
(2, 'Tahap 4 - Penyerahan', 'Belum diserahkan ke penerima', NULL, NULL, 'menunggu');

-- Sample Tracking untuk Surat 3 (sudah selesai semua)
INSERT INTO tracking (surat_id, tahap, keterangan, pegawai_id, tanggal_proses, status) VALUES
(3, 'Tahap 1 - Penerimaan', 'Surat diterima dari BKD', 3, '2026-01-20 08:00:00', 'selesai'),
(3, 'Tahap 2 - Disposisi', 'Didisposisi ke Kepala Dinas', 2, '2026-01-20 09:30:00', 'selesai'),
(3, 'Tahap 3 - Review', 'Review dan tindak lanjut', 1, '2026-01-21 10:00:00', 'selesai'),
(3, 'Tahap 4 - Arsip', 'Diarsipkan', 3, '2026-01-22 14:00:00', 'selesai');

-- Sample Template Surat
INSERT INTO template_surat (nama_template, jenis, file_path, deskripsi) VALUES
('Template Surat Keputusan', 'SK', '/uploads/templates/template-sk.docx', 'Template untuk membuat Surat Keputusan'),
('Template Surat Tugas', 'ST', '/uploads/templates/template-st.docx', 'Template untuk Surat Tugas'),
('Template Surat Masuk', 'SM', '/uploads/templates/template-sm.docx', 'Template untuk mencatat Surat Masuk'),
('Template Surat Keluar', 'SKel', '/uploads/templates/template-skel.docx', 'Template untuk Surat Keluar');
