import pool from '../config/database.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import { generateKodeUnik } from '../utils/kodeUnikGenerator.js';
import { generateSuratDocument } from '../utils/documentGenerator.js'; // Import generator
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const {
      nomor_surat, pengirim, penerima, tanggal_surat,
      kepala_opd, no_pdna, nama_pegawai, nip, pangkat, jabatan, opd_new
    } = req.body;
    const jenis_surat = 'Surat Pidana';

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

    // --- Automatic Document Generation Start ---
    let generatedFilePath = null;
    try {
      // 1. Get the latest template for this type OR use default
      // Check if DB has template, otherwise look for default file
      let templateAbsPath = null;

      const [templates] = await pool.query(
        'SELECT * FROM template_surat WHERE jenis = ? ORDER BY created_at DESC LIMIT 1',
        [jenis_surat]
      );

      if (templates.length > 0) {
        // Use DB template
        templateAbsPath = path.join(__dirname, '../../', templates[0].file_path);
      } else {
        // Use default template fallback
        const defaultTemplatePath = path.join(__dirname, '../../uploads/templates/template_surat_pernyataan.docx');
        if (fs.existsSync(defaultTemplatePath)) {
          templateAbsPath = defaultTemplatePath;
        }
      }

      if (templateAbsPath) {
        const outputFilename = `${kodeUnik}.docx`; // Use kodeUnik as filename

        // Resolve absolute path for QR Code
        // qrCodePath is like /uploads/qrcodes/file.png
        // We need c:\...\backend\uploads\qrcodes\file.png
        const qrCodeAbsPath = path.join(__dirname, '../../', qrCodePath);

        // Prepare data object
        const docData = {
          nomor_surat, kepala_opd, no_pdna, nama_pegawai, nip, pangkat, jabatan, opd_new,
          pengirim, penerima, tanggal_surat,
          qr_code_path: qrCodeAbsPath // Pass ABSOLUTE path
        };

        // Generate the document
        generatedFilePath = generateSuratDocument(templateAbsPath, docData, outputFilename);
        console.log('Document generated:', generatedFilePath);
      } else {
        console.log('No template found for automatic generation.');
      }
    } catch (genError) {
      console.error('Failed to generate document:', genError);
      // We don't block surat creation if gen fails, just log it
    }
    // --- Automatic Document Generation End ---

    const [result] = await pool.query(
      `INSERT INTO surat (
        nomor_surat, kode_unik, jenis_surat, pengirim, penerima, tanggal_surat, qr_code, status,
        kepala_opd, no_pdna, nama_pegawai, nip, pangkat, jabatan, opd_new, file_path
      ) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomor_surat, kodeUnik, jenis_surat, pengirim, penerima, tanggal_surat, qrCodePath,
        kepala_opd, no_pdna, nama_pegawai, nip, pangkat, jabatan, opd_new, generatedFilePath
      ]
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
      qr_code: qrCodePath,
      file_path: generatedFilePath // Return the generated file path
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.warn('Duplicate entry:', error.sqlMessage);
      return res.status(409).json({ message: 'Nomor Surat sudah terdaftar. Gunakan Nomor Surat lain.' });
    }
    console.error('Error creating surat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateSurat = async (req, res) => {
  try {
    const {
      nomor_surat, pengirim, penerima, tanggal_surat, status,
      kepala_opd, no_pdna, nama_pegawai, nip, pangkat, jabatan, opd_new
    } = req.body;
    const jenis_surat = 'Surat Pidana';

    const [result] = await pool.query(
      `UPDATE surat 
       SET nomor_surat = ?, jenis_surat = ?, pengirim = ?, penerima = ?, tanggal_surat = ?, status = ?,
           kepala_opd = ?, no_pdna = ?, nama_pegawai = ?, nip = ?, pangkat = ?, jabatan = ?, opd_new = ?
       WHERE id = ?`,
      [
        nomor_surat, jenis_surat, pengirim, penerima, tanggal_surat, status,
        kepala_opd, no_pdna, nama_pegawai, nip, pangkat, jabatan, opd_new,
        req.params.id
      ]
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
      [search.trim(), search.trim()]
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
