
import pool from '../config/database.js';

export const logActivity = async (userId, username, action, details) => {
    try {
        await pool.query(
            'INSERT INTO activity_logs (user_id, username, action, details) VALUES (?, ?, ?, ?)',
            [userId, username, action, details]
        );
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};
