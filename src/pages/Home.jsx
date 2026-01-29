import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <img
          src="/Logo_Kota_Medan_(Seal_of_Medan).svg"
          alt="Logo Kota Medan"
          className="hero-logo"
        />
        <h1>InPro Sistem Informasi</h1>
        <p>Platform Manajemen Aktivitas & Tracking Surat Digital Pemerintah Kota Medan</p>

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
