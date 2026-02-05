import React, { useState, useEffect } from 'react';
import AlertModal from '../AlertModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const SettingsManagement = () => {
    const [settings, setSettings] = useState({
        landing_title: '',
        landing_subtitle: '',
        dashboard_title: '',
        dashboard_subtitle: '',
        website_title: ''
    });
    const [loading, setLoading] = useState(true);
    const [alertData, setAlertData] = useState({ message: '', type: 'success' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (response.ok) {
                const data = await response.json();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                if (settings.website_title) {
                    document.title = settings.website_title;
                }
                setAlertData({ message: 'Data Berhasil Diubah', type: 'success' });
            } else {
                setAlertData({ message: 'Gagal mengubah data', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            setAlertData({ message: 'Error updating settings', type: 'error' });
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="card">
            <AlertModal 
                message={alertData.message} 
                type={alertData.type} 
                onClose={() => setAlertData({ message: '', type: 'success' })} 
            />
            <h2>⚙️ Konfigurasi Website</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Nama Website (Browser Tab)</label>
                    <input
                        type="text"
                        name="website_title"
                        value={settings.website_title}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Contoh: InPro System"
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Judul Landing Page</label>
                    <input
                        type="text"
                        name="landing_title"
                        value={settings.landing_title}
                        onChange={handleChange}
                        className="form-control"
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Subjudul Landing Page</label>
                    <input
                        type="text"
                        name="landing_subtitle"
                        value={settings.landing_subtitle}
                        onChange={handleChange}
                        className="form-control"
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Judul Dashboard Admin</label>
                    <input
                        type="text"
                        name="dashboard_title"
                        value={settings.dashboard_title}
                        onChange={handleChange}
                        className="form-control"
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Subjudul Dashboard Admin</label>
                    <input
                        type="text"
                        name="dashboard_subtitle"
                        value={settings.dashboard_subtitle}
                        onChange={handleChange}
                        className="form-control"
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>💾 Simpan Perubahan</button>
            </form>
        </div>
    );
};

export default SettingsManagement;
