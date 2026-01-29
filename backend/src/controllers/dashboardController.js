import pool from '../config/database.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Get total surat
        const [suratRows] = await pool.query('SELECT COUNT(*) as total FROM surat');
        const totalSurat = suratRows[0].total;

        // Get total pegawai
        const [pegawaiRows] = await pool.query('SELECT COUNT(*) as total FROM pegawai');
        const totalPegawai = pegawaiRows[0].total;

        // Get surat status stats (optional, but good to have)
        const [suratProsesRows] = await pool.query("SELECT COUNT(*) as total FROM surat WHERE status != 'selesai'");
        const suratProses = suratProsesRows[0].total;

        const [suratSelesaiRows] = await pool.query("SELECT COUNT(*) as total FROM surat WHERE status = 'selesai'");
        const suratSelesai = suratSelesaiRows[0].total;

        res.json({
            totalSurat,
            totalPegawai,
            suratProses,
            suratSelesai
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
