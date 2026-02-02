
import pool from './src/config/database.js';

const filePath = 'uploads/templates/file-1769997542911-579092527.docx';
const jenis = 'Surat Pidana'; // Matching what's used in suratController

const registerTemplate = async () => {
    try {
        console.log(`Registering template: ${filePath} for type: ${jenis}`);

        const [result] = await pool.query(
            'INSERT INTO template_surat (nama_template, jenis, file_path, deskripsi, created_at) VALUES (?, ?, ?, ?, NOW())',
            ['Template Baru (Manual Upload)', jenis, filePath, 'Uploaded via script']
        );

        console.log('Template registered successfully. ID:', result.insertId);
        process.exit(0);
    } catch (error) {
        console.error('Error registering template:', error);
        process.exit(1);
    }
};

registerTemplate();
