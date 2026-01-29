import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

function ManageTemplate() {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    nama_template: '',
    jenis_surat: 'Surat Pidana',
    deskripsi: '',
    file: null
  });

  // const jenisSuratOptions = [
  //   'Surat Keputusan',
  //   'Surat Tugas',
  //   'Surat Perintah',
  //   'Surat Edaran',
  //   'Surat Keterangan',
  //   'Surat Undangan',
  //   'Surat Pemberitahuan'
  // ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/template`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nama_template', formData.nama_template);
      formDataToSend.append('jenis_surat', formData.jenis_surat);
      formDataToSend.append('deskripsi', formData.deskripsi);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const url = editingTemplate
        ? `${API_URL}/template/${editingTemplate.id}`
        : `${API_URL}/template`;

      const method = editingTemplate ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingTemplate ? 'Template berhasil diupdate' : 'Template berhasil ditambahkan');
        setShowModal(false);
        setEditingTemplate(null);
        setFormData({ nama_template: '', jenis_surat: 'Surat Pidana', deskripsi: '', file: null });
        fetchTemplates();
      } else {
        alert('Gagal menyimpan template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      nama_template: template.nama_template,
      jenis_surat: template.jenis_surat,
      deskripsi: template.deskripsi,
      file: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/template/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Template berhasil dihapus');
        fetchTemplates();
      } else {
        alert('Gagal menghapus template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Terjadi kesalahan');
    }
  };

  const openModal = () => {
    setEditingTemplate(null);
    setFormData({ nama_template: '', jenis_surat: 'Surat Pidana', deskripsi: '', file: null });
    setShowModal(true);
  };

  return (
    <div className="manage-container">
      <div className="dashboard-header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <div>
          <Link to="/admin" className="back-link" style={{ color: 'var(--gray-600)', background: 'none', padding: 0 }}>← Dashboard</Link>
          <h1 style={{ marginTop: '0.5rem' }}>📝 Manage Template Surat</h1>
          <p>Kelola template dokumen surat</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          ➕ Tambah Template
        </button>
      </div>

      <div className="manage-content">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Template</th>
                <th>Jenis Surat</th>
                <th>Deskripsi</th>
                <th>File</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Belum ada template
                  </td>
                </tr>
              ) : (
                templates.map((template, index) => (
                  <tr key={template.id}>
                    <td>{index + 1}</td>
                    <td>{template.nama_template}</td>
                    <td><span className="badge badge-info">{template.jenis_surat}</span></td>
                    <td>{template.deskripsi}</td>
                    <td>
                      {template.file_path && (
                        <a
                          href={`${BASE_URL}${template.file_path}`}
                          download
                          className="btn-link"
                        >
                          📥 Download
                        </a>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(template)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(template.id)}
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay-surat" onClick={() => setShowModal(false)}>
          <div className="modal-content-surat" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-surat">
              <h2>{editingTemplate ? '✏️ Edit Template' : '➕ Tambah Template Baru'}</h2>
              <button className="close-btn-surat" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Template *</label>
                <input
                  type="text"
                  value={formData.nama_template}
                  onChange={(e) => setFormData({ ...formData, nama_template: e.target.value })}
                  required
                  placeholder="Template Surat Keputusan Pegawai"
                />
              </div>

              <div className="form-group">
                <label>Jenis Surat</label>
                <input
                  type="text"
                  value="Surat Pidana"
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows="3"
                  placeholder="Deskripsi singkat tentang template ini"
                />
              </div>

              <div className="form-group">
                <label>Upload File Template {editingTemplate ? '(Kosongkan jika tidak ingin mengubah file)' : '*'}</label>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  required={!editingTemplate}
                />
                <small>Format: .doc, .docx, .pdf (Max 5MB)</small>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : (editingTemplate ? 'Update' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTemplate;
