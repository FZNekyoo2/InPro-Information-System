-- Insert sample data surat untuk testing
INSERT INTO surat (nomor_surat, jenis_surat, pengirim, penerima, perihal, tanggal_surat, status, qr_code) VALUES
('001/SK/2026', 'Surat Keterangan', 'Bagian Kepegawaian', 'Bagian Umum', 'Keterangan Aktif Bekerja', '2026-01-20', 'draft', '/uploads/qr/001.png'),
('002/SM/2026', 'Surat Masuk', 'Dinas Pendidikan', 'Bagian Administrasi', 'Permohonan Data Pegawai', '2026-01-21', 'draft', '/uploads/qr/002.png'),
('003/SK/2026', 'Surat Keluar', 'Bagian Keuangan', 'Bank BRI', 'Pengajuan Rekening Baru', '2026-01-22', 'draft', '/uploads/qr/003.png'),
('004/SM/2026', 'Surat Masuk', 'Inspektorat', 'Bagian Umum', 'Audit Internal Rutin', '2026-01-23', 'draft', '/uploads/qr/004.png'),
('005/ST/2026', 'Surat Tugas', 'Kepala Dinas', 'Bagian Kepegawaian', 'Tugas Monitoring Lapangan', '2026-01-24', 'draft', '/uploads/qr/005.png');

-- Insert tracking data untuk surat-surat tersebut
INSERT INTO tracking (surat_id, tahap, keterangan, status, admin_username) VALUES
(1, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', 'proses', 'admin'),
(2, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', 'proses', 'admin'),
(3, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', 'proses', 'admin'),
(3, 'Tahap 2 - Verifikasi', 'Dokumen telah diverifikasi', 'proses', 'admin'),
(4, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', 'proses', 'admin'),
(4, 'Tahap 2 - Verifikasi', 'Dokumen telah diverifikasi', 'proses', 'admin'),
(4, 'Tahap 3 - Persetujuan', 'Menunggu persetujuan kepala', 'proses', 'admin'),
(5, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', 'proses', 'admin'),
(5, 'Tahap 2 - Verifikasi', 'Dokumen telah diverifikasi', 'proses', 'admin'),
(5, 'Tahap 3 - Persetujuan', 'Disetujui oleh kepala', 'proses', 'admin'),
(5, 'Tahap 4 - Selesai', 'Proses selesai', 'selesai', 'admin');
