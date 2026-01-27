import pool from '../src/config/database.js';

// Get all comments for a surat
export const getCommentsBySurat = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM surat_comments WHERE surat_id = ? ORDER BY created_at ASC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
};

// Add a comment to a surat
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, username } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Komentar tidak boleh kosong' });
    }

    const [result] = await pool.query(
      'INSERT INTO surat_comments (surat_id, username, comment) VALUES (?, ?, ?)',
      [id, username, comment]
    );

    const [newComment] = await pool.query(
      'SELECT * FROM surat_comments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Gagal menambahkan komentar' });
  }
};
