
import pool from './src/config/database.js';

async function runMigration() {
    try {
        console.log('Running migration to add is_starred column...');

        // Add is_starred column if not exists
        await pool.query(
            "ALTER TABLE surat ADD COLUMN is_starred BOOLEAN DEFAULT FALSE"
        );

        console.log('✅ Migration successful: is_starred column added.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️ Column is_starred already exists.');
        } else {
            console.error('❌ Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

runMigration();
