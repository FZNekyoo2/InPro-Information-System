
import pool from './src/config/database.js';
import bcrypt from 'bcryptjs';

const setupSuperAdmin = async () => {
    try {
        console.log('Starting Superadmin Setup...');

        // 1. ALTER users table to allow any role string (fixing the ENUM issue)
        console.log('Modifying users table role column...');
        await pool.query("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'admin'");
        console.log('Role column modified to VARCHAR(50).');

        // 2. Create activity_logs table
        const createLogsTable = `
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        username VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `;
        await pool.query(createLogsTable);
        console.log('Table activity_logs created or already exists.');

        // 3. Create Superadmin User
        const superAdminUsername = 'superadmin';
        const superAdminPassword = 'superpassword123'; // Default password
        const superAdminEmail = 'superadmin@inpro.com';

        // Check if exists
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [superAdminUsername]);

        if (existing.length === 0) {
            const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
            await pool.query(
                'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
                [superAdminUsername, hashedPassword, superAdminEmail, 'superadmin']
            );
            console.log(`Superadmin created. Username: ${superAdminUsername}, Password: ${superAdminPassword}`);
        } else {
            console.log('Superadmin user already exists.');
            // Update role/password if needed (optional, just ensuring role here)
            const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
            await pool.query('UPDATE users SET role = ?, password = ? WHERE username = ?', ['superadmin', hashedPassword, superAdminUsername]);
            console.log('Updated existing user "superadmin" role and password.');
        }

    } catch (err) {
        console.error('Setup failed:', err);
    } finally {
        process.exit();
    }
};

setupSuperAdmin();
