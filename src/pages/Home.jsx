import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>InPro - Sistem Informasi Manager Activity</h1>
        <p>Sistem tracking surat untuk Pegawai Negeri Sipil</p>
        
        <div className="action-buttons">
          <Link to="/login" className="btn btn-primary">
            Login Admin
          </Link>
          <Link to="/tracking" className="btn btn-secondary">
            Tracking Surat
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🔍 Tracking Real-time</h3>
          <p>Pantau proses surat secara real-time dengan QR Code</p>
        </div>
        <div className="feature-card">
          <h3>📄 Template Surat</h3>
          <p>Akses template surat yang siap digunakan</p>
        </div>
        <div className="feature-card">
          <h3>👥 Manajemen PNS</h3>
          <p>Kelola data pegawai negeri sipil dengan mudah</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
