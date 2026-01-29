-- Tambahkan tabel untuk comments
CREATE TABLE IF NOT EXISTS surat_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surat_id INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (surat_id) REFERENCES surat(id) ON DELETE CASCADE
);

-- Index untuk optimasi query
CREATE INDEX idx_surat_comments_surat_id ON surat_comments(surat_id);
