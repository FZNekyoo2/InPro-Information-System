import pool from './src/config/database.js';

const updateSchema = async () => {
    try {
        console.log('Altering surat table...');
        // Check if column exists first to avoid error if run multiple times (optional, but good practice, though simple ALTER DROP is fine if we accept error)
        // simplistic approach: try to drop, ignore if it fails or check schema
        // Let's just try to drop it.

        await pool.query('ALTER TABLE surat DROP COLUMN perihal');
        console.log('Successfully dropped column perihal from surat table.');
    } catch (error) {
        if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log('Column perihal might not exist. Skipping.');
        } else {
            console.error('Error altering table:', error);
        }
    } finally {
        process.exit();
    }
};

updateSchema();
