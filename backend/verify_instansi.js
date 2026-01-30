
import pool from './src/config/database.js';

async function verifyInstansi() {
    try {
        const uniqueNip = 'TEST_' + Date.now();
        const instansiValue = 'Dinas Pertanian';

        // 1. Insert
        console.log('Testing Insert...');
        const textInsert = `INSERT INTO pegawai (nama, nip, pangkat, golongan, jabatan, unit_kerja, instansi, tanggal_lahir, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const paramsInsert = ['Test Pegawai', uniqueNip, 'Pembina', 'IV/a', 'Staff', 'Bidang A', instansiValue, '1980-01-01', 'aktif'];

        const [insertResult] = await pool.query(textInsert, paramsInsert);
        const newId = insertResult.insertId;
        console.log('✅ Insert successful, ID:', newId);

        // 2. Select
        console.log('Testing Select...');
        const [rows] = await pool.query('SELECT * FROM pegawai WHERE id = ?', [newId]);
        if (rows.length > 0 && rows[0].instansi === instansiValue) {
            console.log('✅ Select verified: instansi =', rows[0].instansi);
        } else {
            console.error('❌ Select failed or instansi mismatch:', rows[0]);
        }

        // 3. Update
        console.log('Testing Update...');
        const newInstansi = 'Dinas Perkebunan';
        await pool.query('UPDATE pegawai SET instansi = ? WHERE id = ?', [newInstansi, newId]);

        const [updatedRows] = await pool.query('SELECT instansi FROM pegawai WHERE id = ?', [newId]);
        if (updatedRows[0].instansi === newInstansi) {
            console.log('✅ Update verified: instansi =', updatedRows[0].instansi);
        } else {
            console.error('❌ Update failed:', updatedRows[0]);
        }

        // 4. Clean up
        await pool.query('DELETE FROM pegawai WHERE id = ?', [newId]);
        console.log('✅ Clean up successful');

    } catch (error) {
        console.error('❌ Verification failed:', error);
    } finally {
        process.exit();
    }
}

verifyInstansi();
