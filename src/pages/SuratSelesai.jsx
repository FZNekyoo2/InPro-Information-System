import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Removed

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

function SuratSelesai() {
  const [suratList, setSuratList] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const fetchSuratSelesai = async () => {
    try {
      const response = await fetch(`${API_URL}/surat`);
      const data = await response.json();
      
      // Fetch tracking for all items to get accurate completion date
      const suratWithTracking = await Promise.all(data.map(async (surat) => {
        try {
          // Only fetch tracking if we suspect it's relevant, or just fetch for all to be safe?
          // Fetching for all is safer for consistency with dashboard.
          const trackingResponse = await fetch(`${API_URL}/tracking/surat/${surat.id}`);
          const tracking = await trackingResponse.json();
          return { ...surat, tracking };
        } catch {
          return { ...surat, tracking: [] };
        }
      }));

      // Filter date: Last 2 days (Today and Yesterday)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const completed = suratWithTracking.filter(s => {
        // Check status 'selesai' from header OR from latest tracking
        const isSelesaiHead = s.status === 'selesai';
        const lastTrack = s.tracking && s.tracking.length > 0 ? s.tracking[s.tracking.length - 1] : null;
        const isSelesaiTrack = lastTrack && lastTrack.status === 'selesai';

        if (!isSelesaiHead && !isSelesaiTrack) return false;
        
        // Determine Finish Date
        // Priority: tanggal_selesai (if fixed) > last tracking date > updated_at > tanggal_surat
        let finishDateObj = null;
        
        if (s.tanggal_selesai) {
             finishDateObj = new Date(s.tanggal_selesai);
        } else if (isSelesaiTrack && lastTrack) {
             finishDateObj = new Date(lastTrack.created_at || lastTrack.tanggal_proses);
        } else {
             finishDateObj = new Date(s.updated_at || s.tanggal_surat);
        }

        const finishDateOnly = new Date(finishDateObj.getFullYear(), finishDateObj.getMonth(), finishDateObj.getDate());
        
        // Check if finished date is today or yesterday
        return finishDateOnly.getTime() === today.getTime() || finishDateOnly.getTime() === yesterday.getTime();
      });

      setSuratList(completed);

    } catch (error) {
      console.error('Error fetching surat:', error);
    }
  };

  useEffect(() => {
    fetchSuratSelesai();
  }, []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();
  // const { logout } = useAuth(); // Removed
  // Removed logout handlers

  const filteredSuratList = suratList
    .filter(surat => 
      (surat.nama_pegawai && surat.nama_pegawai.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (surat.nip && surat.nip.includes(searchTerm)) ||
      (surat.no_pdna && surat.no_pdna.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.tanggal_surat) - new Date(a.tanggal_surat);
      } else if (sortOrder === 'oldest') {
        return new Date(a.tanggal_surat) - new Date(b.tanggal_surat);
      } else if (sortOrder === 'az') {
        return (a.nama_pegawai || '').localeCompare(b.nama_pegawai || '');
      } else if (sortOrder === 'za') {
        return (b.nama_pegawai || '').localeCompare(a.nama_pegawai || '');
      }
      return 0;
    });

  return (
    <div className="dashboard-container">
      {/* Removed ConfirmationModal */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" className="header-logo" style={{ width: '64px' }} />
          <div>
            <h1 style={{ marginBottom: '0.25rem', fontSize: '2.25rem' }}>Arsip Surat Selesai</h1>
            <p className="dashboard-subtitle" style={{ margin: 0, fontSize: '1.1rem' }}>Daftar surat yang telah selesai diproses</p>
          </div>
        </div>
        <div className="header-actions">
           <Link to="/admin" className="btn btn-secondary">← Kembali ke Dashboard</Link>
           {/* Removed Logout Button */}
        </div>
      </header>
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-control"
              style={{ margin: 0, width: 'auto', minWidth: '150px' }}
            >
              <option value="newest">📅 Terbaru</option>
              <option value="oldest">📅 Terlama</option>
              <option value="az">🔤 Nama (A-Z)</option>
              <option value="za">🔤 Nama (Z-A)</option>
            </select>

            <input
              type="text"
              placeholder="🔍 Cari Nama / NIP / No. OPD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ maxWidth: '300px', margin: 0 }}
            />
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>No. Urut</th>
              <th className="col-nama">Nama Pegawai</th>
              <th>NIP</th>
              <th>No. OPD</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuratList.length === 0 ? (
              <tr><td colSpan="8" className="no-data" style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada surat ditemukan.</td></tr>
            ) : (
              filteredSuratList.map((surat, index) => (
                <tr key={surat.id}>
                  <td>{index + 1}</td>
                  <td className="col-nama">
                    <div style={{ fontWeight: '500' }}>{surat.nama_pegawai || '-'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{surat.perihal}</div>
                  </td>
                  <td>{surat.nip || '-'}</td>
                  <td>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#374151' }}>{surat.no_pdna || '-'}</span>
                  </td>
                  <td>
                    <div>📅 Selesai: {surat.tanggal_selesai ? new Date(surat.tanggal_selesai).toLocaleDateString('id-ID') : '-'}</div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>Surat: {new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td>
                    <span className="badge badge-success">Selesai</span>
                  </td>
                  <td>
                    <button onClick={() => handleCardClick(surat)} className="btn-sm btn-secondary">
                      👁️ Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDetailModal && selectedSurat && (
        <div className="modal-overlay-surat" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content-surat" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-surat" onClick={() => setShowDetailModal(false)}>✕</button>
            <div className="modal-header-surat">
              <div>
                <h2>📄 {selectedSurat.perihal}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href={`${BASE_URL}${selectedSurat.qr_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#2563eb',
                      textDecoration: 'none',
                      padding: '0.5rem 1rem',
                      background: '#eff6ff',
                      borderRadius: '0.5rem',
                      border: '2px solid #2563eb',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                  >
                    🔖 {selectedSurat.kode_unik}
                  </a>
                  <span className="card-nomor">{selectedSurat.nomor_surat}</span>
                </div>
              </div>
            </div>
            <div className="modal-body-surat">
              <div className="detail-section">
                <h3>📋 Detail Surat</h3>
                 <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="detail-item"><label>Tanggal Surat:</label><span>{new Date(selectedSurat.tanggal_surat).toLocaleDateString('id-ID')}</span></div>
                  <div className="detail-item"><label>Nama Pegawai:</label><span>{selectedSurat.nama_pegawai || '-'}</span></div>
                  <div className="detail-item"><label>NIP:</label><span>{selectedSurat.nip || '-'}</span></div>
                </div>
              </div>
              <div className="detail-section">
                <h3>📎 Attachment</h3>
                {selectedSurat.file_path ? (
                  <div className="attachment-item">
                    <a href={`${BASE_URL}${selectedSurat.file_path}`} target="_blank" rel="noopener noreferrer">📄 Lihat Dokumen Surat</a>
                  </div>
                ) : <p className="no-data">Belum ada attachment</p>}
                <form onSubmit={handleUploadAttachment} className="upload-form">
                  <input type="file" onChange={(e) => setAttachmentFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
                  <button type="submit" className="btn btn-sm btn-primary" disabled={!attachmentFile}>Upload</button>
                </form>
              </div>
              <div className="detail-section">
                <h3>💬 Komentar</h3>
                <form onSubmit={handleAddComment} className="comment-form">
                  <textarea placeholder="Tulis komentar..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows="3" />
                  <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>Kirim Komentar</button>
                </form>
                <div className="comments-list">
                  {comments.length === 0 ? <p className="no-data">Belum ada komentar</p> : comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <div className="comment-header">
                        <strong>👤 {comment.username}</strong>
                        <span className="comment-date">
                          {new Date(comment.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="comment-text">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuratSelesai;
