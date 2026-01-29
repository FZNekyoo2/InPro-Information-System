ALTER TABLE pegawai ADD COLUMN status ENUM('aktif', 'pensiun', 'keluar', 'cuti') DEFAULT 'aktif';
