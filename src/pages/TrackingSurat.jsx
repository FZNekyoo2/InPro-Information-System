import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackSurat } from '../services/suratService';
import QRScanner from '../components/qr/QRScanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function TrackingSurat() {
  const [trackingData, setTrackingData] = useState(null);
  const [nomorSurat, setNomorSurat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [totalTahapanAktif, setTotalTahapanAktif] = useState(0);

  useEffect(() => {
    // Fetch jumlah tahapan aktif saat component mount
    fetchTotalTahapan();
  }, []);

  const fetchTotalTahapan = async () => {
    try {
      const response = await fetch(`${API_URL}/tahapan`);
      const tahapan = await response.json();
      setTotalTahapanAktif(tahapan.length);
    } catch (err) {
      console.error('Error fetching tahapan:', err);
      setTotalTahapanAktif(4); // Fallback default
    }
  };

  const handleTrack = async (nomor) => {
    setLoading(true);
    setError('');
    try {
      const data = await trackSurat(nomor);
      setTrackingData(data);
    } catch (err) {
      setError('Nomor surat tidak ditemukan. Silakan periksa kembali nomor surat Anda.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedNomor = nomorSurat.trim();
    if (trimmedNomor) {
      handleTrack(trimmedNomor);
    }
  };

  const handleScanSuccess = (result) => {
    setNomorSurat(result);
    setShowScanner(false);
    handleTrack(result);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'selesai': return '#10b981';
      case 'proses': return '#f59e0b';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getProgressPercentage = () => {
    if (!trackingData?.tracking || totalTahapanAktif === 0) return 0;
    // Hitung berdasarkan jumlah tracking yang ada dibanding total tahapan aktif
    const currentProgress = trackingData.tracking.length;
    return Math.min((currentProgress / totalTahapanAktif) * 100, 100);
  };

  return (
    <div className="tracking-page">
      <header className="tracking-header">
        <div className="branding">
          <Link to="/">
            <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" />
          </Link>
          <h1>Tracking Layanan Surat</h1>
        </div>
        <Link to="/" className="btn btn-sm btn-secondary">← Kembali</Link>
      </header>

      <div className="tracking-container">
        <div className="tracking-search-card">
          <h2>🔍 Scan QR Code</h2>
          <p className="search-hint">Gunakan <strong>QR Scanner</strong> untuk melacak status dokumen dengan mudah dan cepat</p>

          <button
            className="btn btn-scan-qr"
            onClick={() => setShowScanner(!showScanner)}
            style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
          >
            📷 {showScanner ? 'Tutup Scanner' : 'Buka QR Scanner'}
          </button>

          <div className="divider">
            <span>atau masukkan kode unik manual</span>
          </div>

          <form onSubmit={handleSubmit} className="tracking-form">
            <div className="search-input-group">
              <span className="search-icon">🔖</span>
              <input
                type="text"
                placeholder="Contoh: ST-ABCDEF1234"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                disabled={loading}
                className="search-input"
              />
              <button type="submit" disabled={loading || !nomorSurat.trim()} className="btn btn-primary">
                {loading ? (
                  <span>⏳ Mencari...</span>
                ) : (
                  <span>🔍 Lacak</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {showScanner && (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setShowScanner(false)}
          />
        )}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {trackingData && (
          <div className="tracking-results">
            {/* Surat Info Card */}
            <div className="surat-info-card">
              <div className="card-header">
                <h3>📋 Informasi Surat</h3>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(trackingData.status) }}>
                  {trackingData.status}
                </span>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Kode Unik</span>
                  <span className="info-value" style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {trackingData.kode_unik}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nomor Surat</span>
                  <span className="info-value">{trackingData.nomor_surat}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Instansi</span>
                  <span className="info-value">{trackingData.opd_new || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tanggal Surat Masuk</span>
                  <span className="info-value">
                    {new Date(trackingData.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nama Pegawai</span>
                  <span className="info-value">{trackingData.nama_pegawai || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">NIP</span>
                  <span className="info-value">{trackingData.nip || '-'}</span>
                </div>
              </div>

              {/* Completion Date Banner */}
              {(() => {
                const isFinished = trackingData.status === 'selesai' || (trackingData.status === 'SELESAI');
                
                if (isFinished) {
                   // Priority: tanggal_selesai > last tracking date > updated_at
                   let finishDate = trackingData.tanggal_selesai;
                   
                   if (!finishDate && trackingData.tracking && trackingData.tracking.length > 0) {
                      // Find last tracking with status selesai or just the very last one
                      const lastTrack = trackingData.tracking[trackingData.tracking.length - 1];
                      finishDate = lastTrack.tanggal_proses || lastTrack.created_at;
                   }
                   
                   if (!finishDate) {
                      finishDate = trackingData.updated_at;
                   }

                   if (finishDate) {
                     return (
                        <div style={{ 
                          textAlign: 'center', 
                          margin: '1.5rem 0', 
                          padding: '0.75rem', 
                          backgroundColor: '#ecfdf5', 
                          color: '#059669', 
                          borderRadius: '6px', 
                          fontWeight: '600',
                          border: '1px solid #10b981'
                        }}>
                          ✅ Surat Selesai pada Tanggal: {new Date(finishDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                     );
                   }
                }
                return null;
              })()}

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Progress Penyelesaian</span>
                  <span className="progress-percentage">{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="tracking-timeline-card">
              <h3>📊 Timeline Proses</h3>
              <p className="timeline-subtitle">Riwayat lengkap perjalanan dokumen surat</p>

              <div className="timeline">
                {trackingData.tracking.map((item, index) => {
                  // Tentukan status: jika bukan tracking terakhir, berarti sudah selesai
                  const isLastItem = index === trackingData.tracking.length - 1;
                  const displayStatus = isLastItem ? 'proses' : 'selesai';

                  return (
                    <div
                      key={item.id}
                      className={`timeline-item ${displayStatus === 'selesai' ? 'completed' : 'in-progress'}`}
                    >
                      <div className="timeline-marker">
                        {displayStatus === 'selesai' ? (
                          <span className="marker-icon">✓</span>
                        ) : (
                          <span className="marker-icon">⏳</span>
                        )}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{item.tahap}</h4>
                          <span className={`timeline-status status-${displayStatus}`}>
                            {displayStatus === 'selesai' ? 'Selesai' : 'Sedang Diproses'}
                          </span>
                        </div>
                        <p className="timeline-description">{item.keterangan}</p>
                        <div className="timeline-meta">{item.tanggal_proses ? (
                          <>
                            <span className="meta-item">
                              🕐 {new Date(item.tanggal_proses).toLocaleString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {(item.processed_by || item.admin_username || item.pegawai) && (
                              <span className="meta-item">
                                👤 {item.processed_by || item.admin_username || item.pegawai}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="meta-item waiting">⏸️ Belum diproses</span>
                        )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
}

export default TrackingSurat;
