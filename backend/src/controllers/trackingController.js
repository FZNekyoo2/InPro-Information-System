import pool from '../config/database.js';

export const addTracking = async (req, res) => {
  try {
    const { surat_id, tahap, keterangan, pegawai_id, status, admin_username } = req.body;

    // Extract tahap number dari format "Tahap X - Nama"
    const extractTahapNumber = (tahapString) => {
      const match = tahapString.match(/Tahap (\d+)/);
      return match ? parseInt(match[1]) : 0;
    };

    const currentTahapNumber = extractTahapNumber(tahap);

    // Cek tracking terakhir
    const [existingTracking] = await pool.query(
      `SELECT * FROM tracking WHERE surat_id = ? ORDER BY created_at DESC LIMIT 1`,
      [surat_id]
    );

    if (existingTracking.length > 0) {
      const lastTahap = existingTracking[0].tahap;
      const lastTahapNumber = extractTahapNumber(lastTahap);

      // Jika backtrack (tahap baru lebih rendah dari tahap terakhir)
      if (currentTahapNumber < lastTahapNumber) {
        // Hapus semua tracking yang urutannya >= urutan tahap baru
        await pool.query(
          `DELETE FROM tracking 
           WHERE surat_id = ? 
           AND tahap REGEXP 'Tahap ([0-9]+)' 
           AND CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(tahap, ' ', 2), ' ', -1) AS UNSIGNED) >= ?`,
          [surat_id, currentTahapNumber]
        );
      }
      // Jika tahap sama dengan terakhir, skip insert (sudah ada di tahap ini)
      else if (currentTahapNumber === lastTahapNumber) {
        return res.status(200).json({
          message: 'Surat sudah berada di tahap ini',
          id: existingTracking[0].id
        });
      }
    }

    // Insert tracking baru
    const [result] = await pool.query(
      `INSERT INTO tracking (surat_id, tahap, keterangan, pegawai_id, admin_username, tanggal_proses, status) 
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [surat_id, tahap, keterangan, pegawai_id, admin_username, status]
    );

    // Update surat status
    if (status === 'selesai') {
      await pool.query(
        'UPDATE surat SET status = ?, tanggal_selesai = NOW() WHERE id = ?',
        ['selesai', surat_id]
      );
    } else {
      await pool.query(
        'UPDATE surat SET status = ?, tanggal_selesai = NULL WHERE id = ?',
        ['proses', surat_id]
      );
    }

    res.status(201).json({
      message: 'Tracking berhasil ditambahkan',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error adding tracking:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getTrackingBySurat = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, 
             p.nama as pegawai_nama,
             COALESCE(t.admin_username, p.nama) as processed_by
      FROM tracking t
      LEFT JOIN pegawai p ON t.pegawai_id = p.id
      WHERE t.surat_id = ?
      ORDER BY t.created_at ASC
    `, [req.params.suratId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching tracking:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateTracking = async (req, res) => {
  try {
    const { tahap, keterangan, pegawai_id, status } = req.body;

    const [result] = await pool.query(
      `UPDATE tracking 
       SET tahap = ?, keterangan = ?, pegawai_id = ?, tanggal_proses = NOW(), status = ?
       WHERE id = ?`,
      [tahap, keterangan, pegawai_id, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tracking tidak ditemukan' });
    }

    res.json({ message: 'Tracking berhasil diupdate' });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
