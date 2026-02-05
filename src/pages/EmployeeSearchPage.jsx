import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const EmployeeSearchPage = () => {
  const [nip, setNip] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); 
    if (!nip.trim()) return;
    
    setLoading(true);
    setEmployee(null);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/pegawai/nip/${nip}`);
      setEmployee(response.data);
    } catch (err) {
      setError('Pegawai tidak ditemukan. Periksa NIP kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-page">
      <header className="tracking-header">
        <div className="branding">
          <Link to="/">
            <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" />
          </Link>
          <h1>Cari Data Pegawai</h1>
        </div>
        <Link to="/" className="btn btn-sm btn-secondary">← Kembali</Link>
      </header>

      <div className="tracking-container">
        <div className="tracking-search-card">
          <h2>🔍 Cari Data Pegawai</h2>
          <p className="search-hint">Masukkan <strong>NIP</strong> untuk melihat profil dan status pegawai</p>

          <form onSubmit={handleSearch} className="tracking-form">
            <div className="search-input-group">
              <span className="search-icon">👤</span>
              <input
                type="text"
                className="search-input"
                placeholder="Masukkan NIP (Contoh: 19850615...)"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || !nip.trim()}
              >
                {loading ? '⏳ Mencari...' : '🔍 Cari'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {employee && (
          <div className="tracking-results">
            <div className="surat-info-card">
              <div className="card-header">
                <h3>📋 Informasi Pegawai</h3>
                <span 
                  className={`status-badge ${employee.is_retired ? 'status-pensiun' : 'status-aktif'}`}
                >
                  {employee.is_retired ? 'Pensiun' : 'Aktif'}
                </span>
              </div>

              <div className="info-grid">
                <div className="info-item full-width">
                   <span className="info-label">Nama Lengkap</span>
                   <span className="info-value" style={{ fontSize: '1.5rem', color: '#2563eb' }}>{employee.nama}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">NIP</span>
                  <span className="info-value">{employee.nip}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Pangkat / Golongan</span>
                  <span className="info-value">{employee.pangkat} ({employee.golongan})</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Jabatan</span>
                  <span className="info-value">{employee.jabatan}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Unit Kerja</span>
                  <span className="info-value">{employee.unit_kerja}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Usia</span>
                  <span className="info-value">{employee.usia} Tahun</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status Kepegawaian</span>
                  <span className="info-value">{employee.is_retired ? 'Pensiun' : 'Aktif'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearchPage;
