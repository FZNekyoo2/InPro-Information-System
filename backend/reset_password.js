
import bcrypt from 'bcryptjs';
import pool from './src/config/database.js';

async function resetPassword() {
    try {
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update admin password
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, 'admin']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Password for user "admin" updated successfully.');
            console.log('New password:', password);
        } else {
            console.log('❌ User "admin" not found.');
        }
    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        process.exit();
    }
}

resetPassword();
