
import pool from './src/config/database.js';

const checkSchema = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM template_surat LIMIT 1');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkSchema();
