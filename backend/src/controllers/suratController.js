import pool from '../config/database.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import { generateKodeUnik } from '../utils/kodeUnikGenerator.js';

export const getAllSurat = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM surat 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getSuratById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM surat WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createSurat = async (req, res) => {
  try {
    const { nomor_surat, jenis_surat, pengirim, penerima, perihal, tanggal_surat } = req.body;

    // Generate Kode Unik
    let kodeUnik;
    let isUnique = false;
    
    // Pastikan kode unik benar-benar unik
    while (!isUnique) {
      kodeUnik = generateKodeUnik();
      const [existing] = await pool.query('SELECT id FROM surat WHERE kode_unik = ?', [kodeUnik]);
      if (existing.length === 0) {
        isUnique = true;
      }
    }

    // Generate QR Code dengan Kode Unik
    const qrCodePath = await generateQRCode(kodeUnik);

    const [result] = await pool.query(
      `INSERT INTO surat (nomor_surat, kode_unik, jenis_surat, pengirim, penerima, perihal, tanggal_surat, qr_code, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [nomor_surat, kodeUnik, jenis_surat, pengirim, penerima, perihal, tanggal_surat, qrCodePath]
    );

    // Create initial tracking entry
    await pool.query(
      `INSERT INTO tracking (surat_id, tahap, keterangan, status, tanggal_proses, admin_username) 
       VALUES (?, 'Tahap 1 - Pendaftaran', 'Surat telah didaftarkan', 'proses', NOW(), ?)`,
      [result.insertId, req.user?.username || 'system']
    );

    res.status(201).json({
      message: 'Surat berhasil dibuat',
      id: result.insertId,
      kode_unik: kodeUnik,
      qr_code: qrCodePath
    });
  } catch (error) {
    console.error('Error creating surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateSurat = async (req, res) => {
  try {
    const { nomor_surat, jenis_surat, pengirim, penerima, perihal, tanggal_surat, status } = req.body;

    const [result] = await pool.query(
      `UPDATE surat 
       SET nomor_surat = ?, jenis_surat = ?, pengirim = ?, penerima = ?, perihal = ?, tanggal_surat = ?, status = ?
       WHERE id = ?`,
      [nomor_surat, jenis_surat, pengirim, penerima, perihal, tanggal_surat, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json({ message: 'Surat berhasil diupdate' });
  } catch (error) {
    console.error('Error updating surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteSurat = async (req, res) => {
  try {
    // Delete tracking records first
    await pool.query('DELETE FROM tracking WHERE surat_id = ?', [req.params.id]);
    
    // Delete surat
    const [result] = await pool.query('DELETE FROM surat WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json({ message: 'Surat berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const trackSurat = async (req, res) => {
  try {
    const { search } = req.query; // Bisa kode unik atau nomor surat

    // Get surat info - cari berdasarkan kode unik atau nomor surat
    const [suratRows] = await pool.query(
      'SELECT * FROM surat WHERE kode_unik = ? OR nomor_surat = ?',
      [search, search]
    );

    if (suratRows.length === 0) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    const surat = suratRows[0];

    // Get tracking history
    const [trackingRows] = await pool.query(`
      SELECT t.*, p.nama as pegawai
      FROM tracking t
      LEFT JOIN pegawai p ON t.pegawai_id = p.id
      WHERE t.surat_id = ?
      ORDER BY t.created_at ASC
    `, [surat.id]);

    res.json({
      ...surat,
      tracking: trackingRows
    });
  } catch (error) {
    console.error('Error tracking surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Upload attachment for surat
export const uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    
    await pool.query(
      'UPDATE surat SET file_path = ? WHERE id = ?',
      [filePath, id]
    );

    res.json({ message: 'Attachment berhasil diupload', filePath });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    res.status(500).json({ message: 'Gagal upload attachment' });
  }
};
