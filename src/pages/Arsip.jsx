import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Removed
// import ConfirmationModal from '../components/ConfirmationModal'; // Removed

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

function Arsip() {
  const [suratList, setSuratList] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Removed
  
  const navigate = useNavigate();
  // const { logout } = useAuth(); // Removed

  useEffect(() => {
    fetchArsip();
  }, []);

  const fetchArsip = async () => {
    try {
      const response = await fetch(`${API_URL}/surat`);
      const data = await response.json();
      
      // Filter ONLY completed letters (Arsip = All Completed)
      const finished = data.filter(s => s.status === 'selesai');
      setSuratList(finished);

    } catch (error) {
      console.error('Error fetching arsip:', error);
    }
  };

  const toggleStar = async (e, surat) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/surat/${surat.id}/star`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Optimistic update
        setSuratList(prevList => prevList.map(s => 
          s.id === surat.id ? { ...s, is_starred: !s.is_starred } : s
        ));
      }
    } catch (error) {
        console.error('Error toggling star:', error);
        alert('Gagal mengubah status bintang');
    }
  };

  const handleCardClick = async (surat) => {
    setSelectedSurat(surat);
    setShowDetailModal(true);
  };

  // Removed handleLogoutClick
  // Removed handleConfirmLogout
  
  const filteredList = suratList.filter(surat => 
    (surat.nama_pegawai && surat.nama_pegawai.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (surat.no_pdna && surat.no_pdna.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
      // Sort starred first, then date
      if (a.is_starred !== b.is_starred) return b.is_starred - a.is_starred;
      return new Date(b.tanggal_surat) - new Date(a.tanggal_surat);
  });

  return (
    <div className="dashboard-container">
      {/* Removed ConfirmationModal */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" className="header-logo" style={{ width: '64px' }} />
          <div>
            <h1 style={{ marginBottom: '0.25rem', fontSize: '2.25rem' }}>Arsip Digital</h1>
            <p className="dashboard-subtitle" style={{ margin: 0, fontSize: '1.1rem' }}>Penyimpanan permanen seluruh surat selesai</p>
          </div>
        </div>
        <div className="header-actions">
           <Link to="/admin" className="btn btn-secondary">← Kembali ke Dashboard</Link>
           {/* Removed Logout Button */}
        </div>
      </header>

      <div className="container" style={{ marginTop: '2rem' }}>
         <input
              type="text"
              placeholder="🔍 Cari Nama / No. OPD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ maxWidth: '400px' }}
            />
      </div>

      <div className="table-container" style={{ marginTop: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th style={{width: '50px'}}>⭐</th>
              <th>No</th>
              <th>No. OPD</th>
              <th>Nama Pegawai</th>
              <th>Tanggal Selesai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((surat, index) => (
                <tr key={surat.id} style={surat.is_starred ? {background: '#fffbeb'} : {}}>
                    <td style={{textAlign: 'center', cursor: 'pointer', fontSize: '1.5rem'}} onClick={(e) => toggleStar(e, surat)}>
                        {surat.is_starred ? '⭐' : '☆'}
                    </td>
                    <td>{index+1}</td>
                    <td style={{fontWeight: 'bold'}}>{surat.no_pdna || '-'}</td>
                    <td>{surat.nama_pegawai}</td>
                    <td>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</td>
                    <td>
                         <button onClick={() => handleCardClick(surat)} className="btn-sm btn-secondary">
                          👁️ Detail
                        </button>
                    </td>
                </tr>
            ))}
             {filteredList.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Belum ada arsip surat</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetailModal && selectedSurat && (
        <div className="modal-overlay-surat" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content-surat" onClick={e => e.stopPropagation()}>
                <button className="close-btn-surat" onClick={() => setShowDetailModal(false)}>✕</button>
                <h2>Detail Arsip: {selectedSurat.nomor_surat}</h2>
                <p><strong>Perihal:</strong> {selectedSurat.perihal || '-'}</p>
                <div style={{marginTop: '1rem'}}>
                    {selectedSurat.file_path && (
                         <a href={`${BASE_URL}${selectedSurat.file_path}`} className="btn btn-primary" target="_blank" rel="noopener noreferrer">📄 Download Dokumen</a>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default Arsip;
