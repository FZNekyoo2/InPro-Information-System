
import pool from './src/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'add_instansi_pegawai.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        const [result] = await pool.query(sql); // Assuming single statement
        console.log('✅ Migration successful.');
        console.log(result);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️ Column already exists, skipping.');
        } else {
            console.error('❌ Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

runMigration();
