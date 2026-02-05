import pool from '../config/database.js';

export const getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM application_settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSettings = async (req, res) => {
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No settings provided to update' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const [key, value] of Object.entries(updates)) {
            await connection.query(
                'INSERT INTO application_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
                [key, value]
            );
        }

        await connection.commit();
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
};
