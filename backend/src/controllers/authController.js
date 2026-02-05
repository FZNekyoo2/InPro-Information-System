import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '../../logs/login_attempts.log');

// Ensure stats/logs dir exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logFailedAttempt = (username, ip, reason) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Failed Login | User: ${username} | IP: ${ip} | Reason: ${reason}\n`;
  try {
    fs.appendFileSync(logFilePath, logMessage);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};

export const login = async (req, res) => {
  console.log('Login attempt:', req.body);
  try {
    const { username, password } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    // Get user from database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      logFailedAttempt(username, clientIp, 'User not found');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      logFailedAttempt(username, clientIp, 'Invalid password');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'inpro-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password, email, role = 'admin' } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username atau email sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, role]
    );

    res.status(201).json({
      message: 'User berhasil dibuat',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
