// Native fetch


const API_URL = 'http://localhost:3000/api';

const runTest = async () => {
    try {
        console.log('1. Registering/Logging in test user...');
        const testUser = {
            username: 'test_docgen_' + Date.now(),
            password: 'password123',
            email: `test_docgen_${Date.now()}@example.com`
        };

        // Register
        await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        // Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: testUser.username, password: testUser.password })
        });

        if (!loginRes.ok) throw new Error('Login failed');
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        // 2. Get a surat
        console.log('Fetching all surat...');
        const res = await fetch(`${API_URL}/surat`);
        const surats = await res.json();

        if (surats.length === 0) {
            console.log('No surat found.');
            return;
        }

        const target = surats[0];
        console.log(`Targeting Surat ID: ${target.id}`);

        // 3. Update surat with new Kepala OPD
        const newKepala = 'UPDATED KEPALA ' + Date.now();
        const updateData = {
            ...target,
            kepala_opd: newKepala,
            status: target.status || 'draft',
            tanggal_surat: target.tanggal_surat ? target.tanggal_surat.split('T')[0] : null
        };

        console.log('Sending update payload...');
        const updateRes = await fetch(`${API_URL}/surat/${target.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        if (!updateRes.ok) {
            const errText = await updateRes.text();
            console.error('Update failed:', updateRes.status, errText);
        } else {
            const result = await updateRes.json();
            console.log('Update success. File path:', result.file_path);
            if (result.file_path) {
                console.log('VERIFIED: File path returned, regeneration likely successful.');
            } else {
                console.log('FAILED: No file path returned.');
            }
        }

    } catch (err) {
        console.error('Test error:', err);
    }
};

runTest();
