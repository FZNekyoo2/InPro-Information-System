
import pool from './src/config/database.js';

async function checkSchema() {
    try {
        const [rows] = await pool.query("SHOW COLUMNS FROM users LIKE 'role'");
        console.log(JSON.stringify(rows, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkSchema();
