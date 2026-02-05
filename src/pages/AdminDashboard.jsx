import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="cards-container">{children}</div>;
}

function SortableCard({ card, onCardClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card" onClick={() => !isDragging && onCardClick(card)}>
      <div className="card-header-info">
        <span className="card-nomor">No. OPD: {card.no_pdna || '-'}</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            👤 {card.created_by || 'system'}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <h4 className="card-perihal" style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: '700' }}>{card.nama_pegawai || '-'}</h4>
        <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>OPD: {card.kepala_opd || '-'}</div>
      </div>
      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="card-date">📅 {new Date(card.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
        {(card.status === 'selesai' || (card.tracking && card.tracking.length > 0 && card.tracking[card.tracking.length-1].status === 'selesai')) && (() => {
           // Find the completion date
           // Usually the last tracking item, or specifically search for 'selesai' status
           // If card.status is selesai, we can assume the last tracking update was the completion time or close to it.
           // However, to be more precise, let's look for the last 'status: selesai' tracking or just use the last item.
           const lastTrack = card.tracking && card.tracking.length > 0 ? card.tracking[card.tracking.length - 1] : null;
           // If database doesn't have explicit 'completed_at', we use tracking timestamp
           const completeDate = lastTrack ? new Date(lastTrack.created_at || lastTrack.tanggal_proses) : new Date(); // Fallback if missing
           
           return (
             <span className="card-date-completed" style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
               ✅ {completeDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
             </span>
           );
        })()}
      </div>
    </div>
  );
}



function AdminDashboard() {
  const [columns, setColumns] = useState({});
  const [tahapanList, setTahapanList] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [stats, setStats] = useState({ totalSurat: 0, totalPegawai: 0 });
  const [settings, setSettings] = useState({
    dashboard_title: 'Dashboard Setup',
    dashboard_subtitle: 'Sistem Informasi Manajemen Aktivitas'
  });
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showManageTahapanModal, setShowManageTahapanModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [newTahapan, setNewTahapan] = useState({ nama: '', color: '#3b82f6' });
  const [editingTahapan, setEditingTahapan] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state for logout confirm
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => { fetchTahapan(); fetchSettings(); }, []);
  useEffect(() => { if (Object.keys(columns).length > 0) fetchData(); }, [Object.keys(columns).length]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/'); // Redirect to Home first
    // Use timeout to allow navigation to complete before clearing auth state
    // This prevents ProtectedRoute from redirecting to /login
    setTimeout(() => {
      logout();
    }, 100);
  };

  const fetchTahapan = async () => {
    try {
      const response = await fetch(`${API_URL}/tahapan?all=true`);
      const tahapan = await response.json();
      setTahapanList(tahapan);
      const newColumns = {};
      tahapan.filter(t => t.aktif).forEach(t => {
        newColumns[t.nama.toLowerCase().replace(/\s+/g, '-')] = { id: t.id, title: t.nama, color: t.color, urutan: t.urutan, cards: [] };
      });
      setColumns(newColumns);
    } catch (error) {
      console.error('Error fetching tahapan:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      const data = await response.json();
      if (data) {
        setSettings(prev => ({
          ...prev,
          dashboard_title: data.dashboard_title || prev.dashboard_title,
          dashboard_subtitle: data.dashboard_subtitle || prev.dashboard_subtitle
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchData = async () => {
    try {
      const suratResponse = await fetch(`${API_URL}/surat`);
      const suratData = await suratResponse.json();
      const suratWithTracking = await Promise.all(suratData.map(async (surat) => {
        try {
          const trackingResponse = await fetch(`${API_URL}/tracking/surat/${surat.id}`);
          const tracking = await trackingResponse.json();
          let currentStage = Object.keys(columns)[0] || 'pendaftaran';
          if (tracking.length > 0) {
            const tahapLower = tracking[tracking.length - 1].tahap.toLowerCase();
            for (const [key, column] of Object.entries(columns)) {
              if (tahapLower.includes(column.title.toLowerCase())) {
                currentStage = key;
                break;
              }
            }
          }
          return { ...surat, currentStage, tracking };
        } catch {
          return { ...surat, currentStage: Object.keys(columns)[0] || 'pendaftaran', tracking: [] };
        }
      }));
      
      const newColumns = { ...columns };
      Object.keys(newColumns).forEach(key => { newColumns[key].cards = []; });
      suratWithTracking.forEach(surat => { 
        // Check if surat is completed and if it is "archived" (older than yesterday)
        // If archived, do NOT show in kanban board.
        // Logic: same as SuratSelesai.jsx but inverted. 
        // If status == 'selesai' AND Completion Date < Yesterday, then skip.
        
        let shouldShow = true;
        if (surat.status === 'selesai' || (surat.tracking && surat.tracking.length > 0 && surat.tracking[surat.tracking.length-1].status === 'selesai')) {
           const finishDateStr = surat.tanggal_selesai || surat.updated_at || surat.tanggal_surat;
           const finishDate = new Date(finishDateStr);
           const now = new Date();
           const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
           const yesterday = new Date(today);
           yesterday.setDate(yesterday.getDate() - 1);
           
           const finishDateOnly = new Date(finishDate.getFullYear(), finishDate.getMonth(), finishDate.getDate());
           
           // If finished date is BEFORE yesterday (e.g. 2 days ago), it is archived.
           // We only show if it is Yesterday or Today.
           if (finishDateOnly.getTime() < yesterday.getTime()) {
             shouldShow = false;
           }
        }

        if (shouldShow && newColumns[surat.currentStage]) {
            newColumns[surat.currentStage].cards.push(surat); 
        }
      });
      setColumns(newColumns);
      const statsResponse = await fetch(`${API_URL}/dashboard/stats`);
      setStats(await statsResponse.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDragStart = (event) => {
    setActiveCard(Object.values(columns).flatMap(col => col.cards).find(c => c.id === event.active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    const activeColumn = Object.keys(columns).find(key => columns[key].cards.some(card => card.id === active.id));
    let targetColumn = over.id;
    if (!Object.keys(columns).includes(over.id)) {
      targetColumn = Object.keys(columns).find(key => columns[key].cards.some(card => card.id === over.id));
    }
    if (!activeColumn || !targetColumn || activeColumn === targetColumn) return;
    const currentOrder = columns[activeColumn]?.urutan || 0;
    const targetOrder = columns[targetColumn]?.urutan || 0;
    if (targetOrder > currentOrder + 1) {
      const nextColumn = Object.values(columns).find(c => c.urutan === currentOrder + 1);
      alert(`Tidak bisa loncat tahap! Surat harus diproses secara berurutan.\nDari ${columns[activeColumn].title} hanya bisa ke ${nextColumn?.title || 'tahap berikutnya'}`);
      fetchData();
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isSelesai = targetOrder === Math.max(...Object.values(columns).map(c => c.urutan));
      const response = await fetch(`${API_URL}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          surat_id: active.id,
          tahap: `Tahap ${targetOrder} - ${columns[targetColumn].title}`,
          keterangan: `Dipindahkan ke ${columns[targetColumn].title}`,
          status: isSelesai ? 'selesai' : 'proses',
          admin_username: user.username || 'Admin'
        })
      });
      response.ok ? await fetchData() : (alert('Gagal memproses surat. Silakan coba lagi.'), fetchData());
    } catch (error) {
      console.error('Error updating tracking:', error);
      alert('Gagal memproses surat. Silakan coba lagi.');
      fetchData();
    }
  };

  const handleCardClick = async (card) => {
    setSelectedSurat(card);
    setShowDetailModal(true);
    try {
      const response = await fetch(`${API_URL}/surat/${card.id}/comments`);
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
        fetchData();
      }
    } catch (error) {
      console.error('Error uploading attachment:', error);
      alert('Gagal upload attachment');
    }
  };

  const handleAddTahapan = async (e) => {
    e.preventDefault();
    if (!newTahapan.nama.trim()) return;
    try {
      const response = await fetch(`${API_URL}/tahapan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(newTahapan)
      });
      if (response.ok) {
        alert('Tahapan berhasil ditambahkan');
        setNewTahapan({ nama: '', color: '#3b82f6' });
        await fetchTahapan();
        setTimeout(() => fetchData(), 500);
      }
    } catch (error) {
      console.error('Error adding tahapan:', error);
      alert('Gagal menambah tahapan');
    }
  };

  const handleToggleTahapan = async (tahapan) => {
    try {
      const response = await fetch(`${API_URL}/tahapan/${tahapan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ...tahapan, aktif: !tahapan.aktif })
      });
      if (response.ok) {
        // Update langsung di state tahapanList untuk tampilan di modal
        const updatedList = tahapanList.map(t =>
          t.id === tahapan.id ? { ...t, aktif: !t.aktif } : t
        );
        setTahapanList(updatedList);

        // Fetch ulang tahapan dan data untuk rebuild kanban board dengan benar
        await fetchTahapan();
      }
    } catch (error) {
      console.error('Error toggling tahapan:', error);
      alert('Gagal mengubah status tahapan');
    }
  };

  const handleEditTahapan = async (e) => {
    e.preventDefault();
    if (!editingTahapan.nama.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tahapan/${editingTahapan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(editingTahapan)
      });
      if (response.ok) {
        alert('Tahapan berhasil diupdate');
        setEditingTahapan(null);
        await fetchTahapan();
      }
    } catch (error) {
      console.error('Error updating tahapan:', error);
      alert('Gagal update tahapan');
    }
  };

  const handleDeleteTahapan = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus tahapan "${nama}"?\n\nTahapan yang dihapus akan dinonaktifkan.`)) return;

    try {
      const response = await fetch(`${API_URL}/tahapan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        alert('Tahapan berhasil dihapus');
        await fetchTahapan();
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menghapus tahapan');
      }
    } catch (error) {
      console.error('Error deleting tahapan:', error);
      alert('Gagal menghapus tahapan');
    }
  };

  const handleMoveUrutan = async (tahapan, direction) => {
    const currentIndex = tahapanList.findIndex(t => t.id === tahapan.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= tahapanList.length) return;

    const targetTahapan = tahapanList[targetIndex];

    try {
      const response = await fetch(`${API_URL}/tahapan/urutan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          tahapanOrder: [
            { id: tahapan.id, urutan: targetTahapan.urutan },
            { id: targetTahapan.id, urutan: tahapan.urutan }
          ]
        })
      });

      if (response.ok) {
        await fetchTahapan();
      }
    } catch (error) {
      console.error('Error updating urutan:', error);
      alert('Gagal mengubah urutan tahapan');
    }
  };


  return (
    <div className="admin-dashboard dashboard-container kanban-view">
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" className="header-logo" style={{ width: '64px' }} />
          <div>
            <h1 style={{ marginBottom: '0.25rem', fontSize: '2.25rem' }}>{settings.dashboard_title}</h1>
            <p className="dashboard-subtitle" style={{ margin: 0, fontSize: '1.1rem' }}>{settings.dashboard_subtitle}</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="stats-mini">
            <span className="stat-mini">📄 {stats.suratProses || 0} Surat Aktif</span>
            <span className="stat-mini">👥 {stats.totalPegawai || 0} Pegawai</span>
          </div>
          <button onClick={handleLogoutClick} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="quick-menu" style={{ gap: '1.5rem', paddingBottom: '1.5rem' }}>
        <Link to="/admin/surat" className="quick-btn">📄 Kelola Surat</Link>
        <Link to="/admin/pegawai" className="quick-btn">👥 Kelola Pegawai</Link>
        <Link to="/admin/template" className="quick-btn">📋 Template</Link>
        <Link to="/tracking" className="quick-btn">🔍 Tracking</Link>
        <Link to="/admin/surat-selesai" className="quick-btn">✅ Surat Selesai</Link>
        <Link to="/admin/arsip" className="quick-btn">📂 Arsip</Link>
        <button onClick={() => setShowManageTahapanModal(true)} className="quick-btn">⚙️ Kelola Tahapan</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="kanban-column">
              <div className="column-header" style={{ borderTopColor: column.color }}>
                <h3>{column.title}</h3>
                <span className="card-count">{column.cards.length}</span>
              </div>
              <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                <DroppableColumn id={columnId}>
                  {column.cards.length === 0 ? (
                    <div className="empty-column">Tidak ada surat</div>
                  ) : (
                    column.cards.map(card => <SortableCard key={card.id} card={card} onCardClick={handleCardClick} />)
                  )}
                </DroppableColumn>
              </SortableContext>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="kanban-card dragging">
              <div className="card-header-info">
                <span className="card-nomor">No. OPD: {activeCard.no_pdna || '-'}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    👤 {activeCard.created_by || 'system'}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <h4 className="card-perihal" style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: '700' }}>{activeCard.nama_pegawai || '-'}</h4>
                <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>OPD: {activeCard.kepala_opd || '-'}</div>
              </div>
              <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-date">📅 {new Date(activeCard.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                {(activeCard.status === 'selesai' || (activeCard.tracking && activeCard.tracking.length > 0 && activeCard.tracking[activeCard.tracking.length-1].status === 'selesai')) && (() => {
                     const lastTrack = activeCard.tracking && activeCard.tracking.length > 0 ? activeCard.tracking[activeCard.tracking.length - 1] : null;
                     const completeDate = lastTrack ? new Date(lastTrack.created_at || lastTrack.tanggal_proses) : new Date();
                     return (
                       <span className="card-date-completed" style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                         ✅ {completeDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                       </span>
                     );
                })()}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
                    title="Klik untuk lihat QR Code"
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#eff6ff';
                      e.target.style.color = '#2563eb';
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

      {showManageTahapanModal && (
        <div className="modal-overlay-surat" onClick={() => setShowManageTahapanModal(false)}>
          <div className="modal-content-surat" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-surat" onClick={() => setShowManageTahapanModal(false)}>✕</button>
            <div className="modal-header-surat"><h2>⚙️ Kelola Tahapan Proses</h2></div>
            <div className="modal-body-surat">
              <div className="detail-section">
                <h3>➕ Tambah Tahapan Baru</h3>
                <form onSubmit={handleAddTahapan} className="tahapan-form">
                  <input type="text" placeholder="Nama tahapan (contoh: Review Kepala)" value={newTahapan.nama} onChange={(e) => setNewTahapan({ ...newTahapan, nama: e.target.value })} />
                  <div className="color-picker-group">
                    <label>Warna:</label>
                    <input type="color" value={newTahapan.color} onChange={(e) => setNewTahapan({ ...newTahapan, color: e.target.value })} />
                    <span className="color-preview" style={{ backgroundColor: newTahapan.color }}></span>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={!newTahapan.nama.trim()}>Tambah Tahapan</button>
                </form>
              </div>
              <div className="detail-section">
                <h3>📋 Daftar Tahapan</h3>
                <div className="tahapan-list">
                  {tahapanList.map((tahapan, index) => (
                    editingTahapan?.id === tahapan.id ? (
                      <form key={tahapan.id} onSubmit={handleEditTahapan} className="tahapan-item editing" style={{ borderColor: tahapan.color }}>
                        <div className="tahapan-edit-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={editingTahapan.nama}
                            onChange={(e) => setEditingTahapan({ ...editingTahapan, nama: e.target.value })}
                            placeholder="Nama tahapan"
                          />
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={editingTahapan.color}
                              onChange={(e) => setEditingTahapan({ ...editingTahapan, color: e.target.value })}
                              style={{ width: '50px', height: '40px', padding: '0 0.2rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                              <button type="submit" className="btn-sm btn-primary" style={{ flex: 1 }}>💾 Simpan</button>
                              <button type="button" className="btn-sm btn-secondary" onClick={() => setEditingTahapan(null)}>Batal</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div key={tahapan.id} className={`tahapan-item ${!tahapan.aktif ? 'tahapan-nonaktif' : ''}`}>
                        {/* Dynamic colored border via inline style for pseudo-element simulation if needed, or direct border-left */}
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: tahapan.color }}></div>

                        <div className="tahapan-info">
                          <span className="tahapan-order">#{tahapan.urutan}</span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: '1.05rem' }}>{tahapan.nama}</strong>
                            {!tahapan.aktif && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>● Nonaktif</span>}
                          </div>
                        </div>

                        <div className="tahapan-actions">
                          <div style={{ marginRight: 'auto', display: 'flex', gap: '0.25rem' }}>
                            <button className="btn-sm btn-secondary" onClick={() => handleMoveUrutan(tahapan, 'up')} disabled={index === 0}>▲</button>
                            <button className="btn-sm btn-secondary" onClick={() => handleMoveUrutan(tahapan, 'down')} disabled={index === tahapanList.length - 1}>▼</button>
                          </div>

                          <button
                            className="btn-sm btn-edit"
                            onClick={() => setEditingTahapan(tahapan)}
                            title="Edit"
                            style={{ background: '#eff6ff', color: '#2563eb', border: 'none' }}
                          >
                            ✏️
                          </button>
                          <button
                            className={`btn-sm ${tahapan.aktif ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => handleToggleTahapan(tahapan)}
                            title={tahapan.aktif ? "Nonaktifkan" : "Aktifkan"}
                          >
                            {tahapan.aktif ? '✅' : '🚫'}
                          </button>
                          <button
                            className="btn-sm btn-delete"
                            onClick={() => handleDeleteTahapan(tahapan.id, tahapan.nama)}
                            title="Hapus"
                            style={{ background: '#fef2f2', color: '#ef4444', border: 'none' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                <p className="info-text">💡 Tahapan yang dinonaktifkan tidak akan muncul di kanban board</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        message="Apakah Anda yakin ingin keluar?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Logout"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}

export default AdminDashboard;
