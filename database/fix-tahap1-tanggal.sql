-- Fix tanggal_proses untuk Tahap 1 yang belum memiliki tanggal
UPDATE tracking 
SET tanggal_proses = NOW(),
    admin_username = 'system'
WHERE tahap LIKE 'Tahap 1%' 
  AND tanggal_proses IS NULL;

-- Verifikasi hasil
SELECT id, surat_id, tahap, tanggal_proses, admin_username, keterangan 
FROM tracking 
WHERE tahap LIKE 'Tahap 1%'
ORDER BY surat_id;
