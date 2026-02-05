CREATE TABLE IF NOT EXISTS application_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO application_settings (setting_key, setting_value, description) VALUES
('landing_title', 'InPro Sistem Informasi', 'Judul utama di halaman landing page'),
('landing_subtitle', 'Platform Manajemen Aktivitas & Tracking Surat Digital Pemerintah Kota Medan', 'Subjudul di halaman landing page'),
('dashboard_title', 'Dashboard Setup', 'Judul di halaman dashboard admin'),
('dashboard_subtitle', 'Sistem Informasi Manajemen Aktivitas', 'Subjudul di halaman dashboard admin');
