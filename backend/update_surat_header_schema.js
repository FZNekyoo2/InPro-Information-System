import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') }); // Adjust path if needed, usually .env is in root

// Fallback config if .env not found in specific path, try standard process.env
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inpro_db',
};

async function updateSchema() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const columnsToAdd = [
            'kepala_opd VARCHAR(255)',
            'no_pdna VARCHAR(100)',
            'nama_pegawai VARCHAR(255)',
            'nip VARCHAR(50)',
            'pangkat VARCHAR(100)',
            'jabatan VARCHAR(255)',
            'opd_new VARCHAR(255)'
        ];

        for (const colDef of columnsToAdd) {
            try {
                const colName = colDef.split(' ')[0];
                await connection.query(`ALTER TABLE surat ADD COLUMN ${colDef}`);
                console.log(`Added column: ${colName}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column ${colDef.split(' ')[0]} already exists. Skipping.`);
                } else {
                    throw err;
                }
            }
        }

        console.log('Schema update completed.');

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
