
import pool from './src/config/database.js';

async function checkAdmin() {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
        console.log('Admin user found:', rows);
        if (rows.length > 0) {
            console.log('Password hash:', rows[0].password);
        } else {
            console.log('Admin user NOT found.');
        }
    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        process.exit();
    }
}

checkAdmin();
