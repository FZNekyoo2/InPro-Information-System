
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { logActivity } from '../utils/logger.js';

export const getAdmins = async (req, res) => {
    try {
        // Get all users except superadmins (optional logic, maybe show all)
        // For now, let's show all users so superadmin can manage everyone
        // But typically we don't want to accidentally delete the superadmin.
        const [users] = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE role != ?', ['superadmin']);
        res.json(users);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const adminCreator = req.user; // From middleware

        // Check if user exists
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username atau email sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, 'admin']
        );

        // Log activity
        await logActivity(adminCreator.id, adminCreator.username, 'CREATE_ADMIN', `Created admin: ${username}`);

        res.status(201).json({ message: 'Admin berhasil dibuat', userId: result.insertId });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const adminDeleter = req.user;

        // Check if target is superadmin
        const [target] = await pool.query('SELECT role, username FROM users WHERE id = ?', [id]);
        if (target.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        if (target[0].role === 'superadmin') {
            return res.status(403).json({ message: 'Tidak dapat menghapus superadmin' });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [id]);

        // Log activity
        await logActivity(adminDeleter.id, adminDeleter.username, 'DELETE_ADMIN', `Deleted admin: ${target[0].username}`);

        res.json({ message: 'Admin berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

export const getActivityLogs = async (req, res) => {
    try {
        const [logs] = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
