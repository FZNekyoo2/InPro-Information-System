
fetch('http://localhost:3000/api/settings')
    .then(res => res.json())
    .then(data => {
        console.log('API Response:', data);
        if (data.landing_title === 'InPro Sistem Informasi') {
            console.log('✅ Default settings loaded correctly');
        } else {
            console.log('❌ Unexpected settings data');
        }
    })
    .catch(err => console.error('❌ Error hitting API:', err));
