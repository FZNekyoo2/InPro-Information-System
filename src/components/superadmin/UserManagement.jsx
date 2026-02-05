
import React, { useState, useEffect } from 'react';
import { getAdmins, createAdmin, deleteAdmin } from '../../services/adminService';

const UserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handeDelete = async (id, username) => {
    if (!window.confirm(`Yakin ingin menghapus admin ${username}?`)) return;
    try {
      await deleteAdmin(id);
      setAdmins(admins.filter(a => a.id !== id));
      setSuccess(`Admin ${username} berhasil dihapus.`);
    } catch (err) {
      alert('Gagal menghapus admin');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await createAdmin(formData);
      setSuccess('Admin berhasil ditambahkan!');
      setFormData({ username: '', email: '', password: '' });
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat admin');
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👥 Manajemen Admin</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Tambah Admin</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat Pada</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td style={{ fontWeight: 500 }}>{admin.username}</td>
                <td>{admin.email}</td>
                <td><span className={`badge ${admin.role === 'superadmin' ? 'badge-primary' : 'badge-info'}`}>{admin.role}</span></td>
                <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                <td>
                  {admin.role !== 'superadmin' && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handeDelete(admin.id, admin.username)}
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div className="modal-overlay-surat" onClick={(e) => {
            if(e.target === e.currentTarget) setShowModal(false);
        }}>
          <div className="modal-content-surat" style={{ maxWidth: '500px' }}>
            <div className="modal-header-surat">
              <h2>Tambah Admin Baru</h2>
              <button className="close-btn-surat" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body-surat">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
