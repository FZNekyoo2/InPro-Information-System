
import pool from './src/config/database.js';

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE users');
        console.log(rows);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkSchema();
