import pool from '../config/database.js';

export const getAllTemplates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM template_surat ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM template_surat WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const uploadTemplate = async (req, res) => {
  try {
    const { nama_template, deskripsi } = req.body;
    const jenis = 'Surat Pidana';
    const file_path = req.file ? `/uploads/templates/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO template_surat (nama_template, jenis, file_path, deskripsi) VALUES (?, ?, ?, ?)',
      [nama_template, jenis, file_path, deskripsi]
    );

    res.status(201).json({
      message: 'Template berhasil diupload',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM template_surat WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    res.json({ message: 'Template berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
