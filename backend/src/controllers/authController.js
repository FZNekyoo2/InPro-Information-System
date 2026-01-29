import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    // Get user from database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
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
