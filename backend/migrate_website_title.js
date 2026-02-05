
import pool from './src/config/database.js';

async function runMigration() {
    try {
        console.log('Running migration to add website_title...');

        await pool.query(
            "INSERT IGNORE INTO application_settings (setting_key, setting_value, description) VALUES ('website_title', 'InPro System', 'Judul pada tab browser')"
        );

        console.log('✅ Migration successful: website_title added.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

runMigration();
