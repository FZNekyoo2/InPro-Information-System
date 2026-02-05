import pool from '../config/database.js';

export const toggleStarSurat = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if surat exists
        const [surat] = await pool.query('SELECT is_starred FROM surat WHERE id = ?', [id]);
        if (surat.length === 0) {
            return res.status(404).json({ message: 'Surat tidak ditemukan' });
        }

        const currentStatus = surat[0].is_starred;
        const newStatus = !currentStatus;

        await pool.query('UPDATE surat SET is_starred = ? WHERE id = ?', [newStatus, id]);

        res.json({ message: 'Status bintang berhasil diubah', is_starred: newStatus });
    } catch (error) {
        console.error('Error toggling star:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
