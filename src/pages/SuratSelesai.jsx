import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

function SuratSelesai() {
  const [suratList, setSuratList] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuratSelesai();
  }, []);

  const fetchSuratSelesai = async () => {
    try {
      const response = await fetch(`${API_URL}/surat`);
      const data = await response.json();
      
      // Filter clientside or change endpoint? Clientside is fine for now as per previous pattern
      // We also need tracking info to rely on 'selesai' status if header status isn't reliable, 
      // but usually 'status' field in surat table should be updated.
      // Let's rely on surat.status === 'selesai' based on my previous analysis 
      // where updateSurat updates the status field.
      
      const completed = data.filter(s => s.status === 'selesai');
      setSuratList(completed);

    } catch (error) {
      console.error('Error fetching surat:', error);
    }
  };

  const handleCardClick = async (surat) => {
    setSelectedSurat(surat);
    setShowDetailModal(true);
    try {
      const response = await fetch(`${API_URL}/surat/${surat.id}/comments`);
      if (response.ok) setComments(await response.json());
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${API_URL}/surat/${selectedSurat.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ comment: newComment, username: user.username || 'Admin' })
      });
      if (response.ok) {
        setComments([...comments, await response.json()]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUploadAttachment = async (e) => {
    e.preventDefault();
    if (!attachmentFile) return;
    try {
      const formData = new FormData();
      formData.append('attachment', attachmentFile);
      const response = await fetch(`${API_URL}/surat/${selectedSurat.id}/attachment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (response.ok) {
        alert('Attachment berhasil diupload');
        setAttachmentFile(null);
        fetchSuratSelesai();
        // Update selectedSurat file_path so UI updates immediately?
        // setSelectedSurat(prev => ({ ...prev, file_path: ... })) - difficult without response data
        // For now just refresh list.
      }
    } catch (error) {
      console.error('Error uploading attachment:', error);
      alert('Gagal upload attachment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
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
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="table-container" style={{ marginTop: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th className="col-nama">Nama Pegawai</th>
              <th>NIP</th>
              <th>Nomor Surat</th>
              <th>Jenis Surat</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suratList.length === 0 ? (
              <tr><td colSpan="8" className="no-data">Belum ada surat yang selesai.</td></tr>
            ) : (
              suratList.map((surat, index) => (
                <tr key={surat.id}>
                  <td>{index + 1}</td>
                  <td className="col-nama">
                    <div style={{ fontWeight: '500' }}>{surat.nama_pegawai || '-'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{surat.perihal}</div>
                  </td>
                  <td>{surat.nip || '-'}</td>
                  <td>
                    <span className="card-nomor">{surat.nomor_surat}</span>
                  </td>
                  <td>{surat.jenis_surat}</td>
                  <td>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</td>
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
                  <div className="detail-item"><label>Jenis Surat:</label><span>{selectedSurat.jenis_surat || '-'}</span></div>
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
