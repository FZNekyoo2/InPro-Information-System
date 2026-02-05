
import pool from './src/config/database.js';

const up = async () => {
    try {
        console.log('Adding created_by column to surat table...');

        // Add created_by column
        await pool.query("ALTER TABLE surat ADD COLUMN created_by VARCHAR(100) DEFAULT 'system'");

        console.log('Column created_by added successfully.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column created_by already exists.');
        } else {
            console.error('Error adding column:', err);
        }
    } finally {
        process.exit();
    }
};

up();
