-- Tabel untuk menyimpan tahapan proses yang dinamis
CREATE TABLE IF NOT EXISTS tahapan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  urutan INT NOT NULL,
  color VARCHAR(20) NOT NULL,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert tahapan default
INSERT INTO tahapan (nama, urutan, color, aktif) VALUES
('Pendaftaran', 1, '#f59e0b', TRUE),
('Verifikasi', 2, '#3b82f6', TRUE),
('Persetujuan', 3, '#8b5cf6', TRUE),
('Selesai', 4, '#10b981', TRUE);

-- Index untuk optimasi query
CREATE INDEX idx_tahapan_urutan ON tahapan(urutan);
CREATE INDEX idx_tahapan_aktif ON tahapan(aktif);
