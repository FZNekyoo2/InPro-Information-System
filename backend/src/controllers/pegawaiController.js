import pool from '../config/database.js';

export const getAllPegawai = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, nama, nip, pangkat, golongan, jabatan, unit_kerja, 
        tanggal_lahir, status,
        TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) as usia,
        DATE_ADD(tanggal_lahir, INTERVAL 60 YEAR) as tanggal_pensiun,
        created_at
      FROM pegawai 
      ORDER BY nama ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pegawai:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getPegawaiById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, nama, nip, pangkat, golongan, jabatan, unit_kerja, 
        tanggal_lahir, status,
        TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) as usia,
        DATE_ADD(tanggal_lahir, INTERVAL 60 YEAR) as tanggal_pensiun,
        created_at
      FROM pegawai 
      WHERE id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching pegawai:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createPegawai = async (req, res) => {
  try {
    const { nama, nip, pangkat, golongan, jabatan, unit_kerja, tanggal_lahir, status } = req.body;

    const [result] = await pool.query(
      `INSERT INTO pegawai (nama, nip, pangkat, golongan, jabatan, unit_kerja, tanggal_lahir, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama, nip, pangkat, golongan, jabatan, unit_kerja, tanggal_lahir, status || 'aktif']
    );

    res.status(201).json({
      message: 'Pegawai berhasil ditambahkan',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating pegawai:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updatePegawai = async (req, res) => {
  try {
    const { nama, nip, pangkat, golongan, jabatan, unit_kerja, tanggal_lahir, status } = req.body;

    const [result] = await pool.query(
      `UPDATE pegawai 
       SET nama = ?, nip = ?, pangkat = ?, golongan = ?, jabatan = ?, unit_kerja = ?, tanggal_lahir = ?, status = ?
       WHERE id = ?`,
      [nama, nip, pangkat, golongan, jabatan, unit_kerja, tanggal_lahir, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
    }

    res.json({ message: 'Pegawai berhasil diupdate' });
  } catch (error) {
    console.error('Error updating pegawai:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deletePegawai = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pegawai WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
    }

    res.json({ message: 'Pegawai berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting pegawai:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getPegawaiByNip = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, nama, nip, pangkat, golongan, jabatan, unit_kerja, 
        tanggal_lahir, status,
        TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) as usia,
        DATE_ADD(tanggal_lahir, INTERVAL 60 YEAR) as tanggal_pensiun,
        created_at
      FROM pegawai 
      WHERE nip = ?
    `, [req.params.nip]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
    }

    const pegawai = rows[0];
    
    // Status pensiun is now explicit in DB, but we can still check age as a fallback suggestion or redundant check
    // Logic: If explicitly set to 'pensiun' OR > 60 years old
    // For now we trust the DB column 'status', but maybe the frontend wants to know if they ARE of retirement age regardless of status.
    // Keeping usia calculation.

    res.json(pegawai);
  } catch (error) {
    console.error('Error fetching pegawai by NIP:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
