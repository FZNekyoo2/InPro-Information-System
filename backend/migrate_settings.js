
import pool from './src/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'create_settings_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by ';' to handle multiple statements if pool.query doesn't support multiple statements by default
        // But mysql2 usually needs 'multipleStatements: true' in connection config.
        // Assuming the file content is safe to split or the config supports it.
        // For safety, I'll split by semicolon and run sequentially.

        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

        console.log('Running migration...');

        for (const statement of statements) {
            await pool.query(statement);
        }

        console.log('✅ Migration successful: application_settings table created/updated.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

runMigration();
