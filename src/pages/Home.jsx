import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Home() {
  const [settings, setSettings] = useState({
    landing_title: 'InPro Sistem Informasi',
    landing_subtitle: 'Platform Manajemen Aktivitas & Tracking Surat Digital Pemerintah Kota Medan'
  });

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && (data.landing_title || data.landing_subtitle)) {
          setSettings(prev => ({
            ...prev,
            landing_title: data.landing_title || prev.landing_title,
            landing_subtitle: data.landing_subtitle || prev.landing_subtitle
          }));
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <img
          src="/Logo_Kota_Medan_(Seal_of_Medan).svg"
          alt="Logo Kota Medan"
          className="hero-logo"
        />
        <h1>{settings.landing_title}</h1>
        <p>{settings.landing_subtitle}</p>

        <div className="action-buttons">
          <Link to="/login" className="btn btn-primary">
            🔐 Login Admin
          </Link>
          <Link to="/tracking" className="btn btn-secondary">
            🔍 Tracking Surat
          </Link>
          <Link to="/search-pegawai" className="btn btn-secondary" style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-dark)' }}>
            👥 Cari Pegawai
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🚀 Real-time Tracking</h3>
          <p>Pantau status dokumen surat anda secara langsung dengan transparansi penuh.</p>
        </div>
        <div className="feature-card">
          <h3>📂 Digital Archiving</h3>
          <p>Arsip surat tersimpan aman dan mudah diakses kapan saja oleh pihak berwenang.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Efisiensi Kerja</h3>
          <p>Mempercepat proses disposisi dan administrasi antar unit kerja dengan sistem digital.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
