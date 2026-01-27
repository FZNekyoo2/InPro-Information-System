import pool from '../config/database.js';

// Get all tahapan (aktif saja untuk kanban board)
export const getAllTahapan = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const query = showAll 
      ? 'SELECT * FROM tahapan ORDER BY urutan ASC'
      : 'SELECT * FROM tahapan WHERE aktif = TRUE ORDER BY urutan ASC';
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tahapan:', error);
    res.status(500).json({ message: 'Gagal mengambil tahapan' });
  }
};

// Create new tahapan
export const createTahapan = async (req, res) => {
  try {
    const { nama, color } = req.body;

    if (!nama || !color) {
      return res.status(400).json({ message: 'Nama dan warna harus diisi' });
    }

    // Get max urutan
    const [maxResult] = await pool.query('SELECT MAX(urutan) as max_urutan FROM tahapan');
    const nextUrutan = (maxResult[0].max_urutan || 0) + 1;

    const [result] = await pool.query(
      'INSERT INTO tahapan (nama, urutan, color, aktif) VALUES (?, ?, ?, TRUE)',
      [nama, nextUrutan, color]
    );

    const [newTahapan] = await pool.query('SELECT * FROM tahapan WHERE id = ?', [result.insertId]);
    res.status(201).json(newTahapan[0]);
  } catch (error) {
    console.error('Error creating tahapan:', error);
    res.status(500).json({ message: 'Gagal menambah tahapan' });
  }
};

// Update tahapan
export const updateTahapan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, color, aktif } = req.body;

    const [result] = await pool.query(
      'UPDATE tahapan SET nama = ?, color = ?, aktif = ? WHERE id = ?',
      [nama, color, aktif, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tahapan tidak ditemukan' });
    }

    const [updated] = await pool.query('SELECT * FROM tahapan WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating tahapan:', error);
    res.status(500).json({ message: 'Gagal update tahapan' });
  }
};

// Update urutan tahapan
export const updateUrutanTahapan = async (req, res) => {
  try {
    const { tahapanOrder } = req.body; // Array of {id, urutan}

    if (!Array.isArray(tahapanOrder)) {
      return res.status(400).json({ message: 'Format data tidak valid' });
    }

    // Update dalam transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const item of tahapanOrder) {
        await connection.query(
          'UPDATE tahapan SET urutan = ? WHERE id = ?',
          [item.urutan, item.id]
        );
      }

      await connection.commit();
      res.json({ message: 'Urutan tahapan berhasil diupdate' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating urutan:', error);
    res.status(500).json({ message: 'Gagal update urutan' });
  }
};

// Delete tahapan (soft delete)
export const deleteTahapan = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if there are surat in this tahapan
    const [trackingCount] = await pool.query(
      'SELECT COUNT(*) as count FROM tracking WHERE tahap LIKE ?',
      [`%${id}%`]
    );

    if (trackingCount[0].count > 0) {
      return res.status(400).json({ 
        message: 'Tidak bisa menghapus tahapan yang masih memiliki surat' 
      });
    }

    // Soft delete
    const [result] = await pool.query(
      'UPDATE tahapan SET aktif = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tahapan tidak ditemukan' });
    }

    res.json({ message: 'Tahapan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting tahapan:', error);
    res.status(500).json({ message: 'Gagal menghapus tahapan' });
  }
};
