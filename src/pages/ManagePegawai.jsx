import { useState, useEffect } from 'react';
import { getAllPegawai, createPegawai, updatePegawai, deletePegawai } from '../services/api';

const GOLONGAN_OPTIONS = [
  'I/a', 'I/b', 'I/c', 'I/d',
  'II/a', 'II/b', 'II/c', 'II/d',
  'III/a', 'III/b', 'III/c', 'III/d',
  'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e'
];

function ManagePegawai() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPegawai, setCurrentPegawai] = useState({
    nama: '', nip: '', pangkat: '', golongan: '', 
    jabatan: '', unit_kerja: '', instansi: '', tanggal_lahir: '', status: 'aktif'
  });

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    try {
      const data = await getAllPegawai();
      setPegawaiList(data);
    } catch (error) {
      console.error('Error fetching pegawai:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updatePegawai(currentPegawai.id, currentPegawai);
      } else {
        await createPegawai(currentPegawai);
      }
      fetchPegawai();
      resetForm();
    } catch (error) {
      console.error('Error saving pegawai:', error);
    }
  };

  const handleEdit = (pegawai) => {
    setCurrentPegawai(pegawai);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pegawai ini?')) {
      try {
        await deletePegawai(id);
        fetchPegawai();
      } catch (error) {
        console.error('Error deleting pegawai:', error);
      }
    }
  };

  const resetForm = () => {
    setCurrentPegawai({
      nama: '', nip: '', pangkat: '', golongan: '', 
      jabatan: '', unit_kerja: '', instansi: '', tanggal_lahir: '', status: 'aktif'
    });
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="manage-container">
      <h1>Kelola Data Pegawai</h1>
      
      <button 
        className="btn btn-primary" 
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Tutup Form' : '+ Tambah Pegawai'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>{editMode ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={currentPegawai.nama}
                onChange={(e) => setCurrentPegawai({...currentPegawai, nama: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>NIP</label>
              <input
                type="text"
                value={currentPegawai.nip}
                onChange={(e) => setCurrentPegawai({...currentPegawai, nip: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Pangkat</label>
              <input
                type="text"
                value={currentPegawai.pangkat}
                onChange={(e) => setCurrentPegawai({...currentPegawai, pangkat: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Golongan</label>
              <select
                value={currentPegawai.golongan}
                onChange={(e) => setCurrentPegawai({...currentPegawai, golongan: e.target.value})}
                required
              >
                <option value="">Pilih Golongan</option>
                {GOLONGAN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Jabatan</label>
              <input
                type="text"
                value={currentPegawai.jabatan}
                onChange={(e) => setCurrentPegawai({...currentPegawai, jabatan: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit Kerja</label>
              <input
                type="text"
                value={currentPegawai.unit_kerja}
                onChange={(e) => setCurrentPegawai({...currentPegawai, unit_kerja: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Instansi</label>
              <input
                type="text"
                value={currentPegawai.instansi}
                onChange={(e) => setCurrentPegawai({...currentPegawai, instansi: e.target.value})}
                required
                placeholder="Contoh: Pemerintah Provinsi Jawa Tengah"
              />
            </div>

            <div className="form-group">
              <label>Tanggal Lahir</label>
              <input
                type="date"
                value={currentPegawai.tanggal_lahir}
                onChange={(e) => setCurrentPegawai({...currentPegawai, tanggal_lahir: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={currentPegawai.status}
                onChange={(e) => setCurrentPegawai({...currentPegawai, status: e.target.value})}
                required
              >
                <option value="aktif">Aktif</option>
                <option value="pensiun">Pensiun</option>
                <option value="cuti">Cuti</option>
                <option value="keluar">Keluar</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editMode ? 'Update' : 'Simpan'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="col-nama">Nama</th>
              <th>NIP</th>
              <th>Pangkat</th>
              <th>Golongan</th>
              <th>Jabatan</th>
              <th>Unit Kerja</th>
              <th>Instansi</th>
              <th>Status</th>
              <th>Usia</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pegawaiList.map((pegawai) => (
              <tr key={pegawai.id}>
                <td className="col-nama">{pegawai.nama}</td>
                <td>{pegawai.nip}</td>
                <td>{pegawai.pangkat}</td>
                <td>{pegawai.golongan}</td>
                <td>{pegawai.jabatan}</td>
                <td>{pegawai.unit_kerja}</td>
                <td>{pegawai.instansi}</td>
                <td>
                  <span className={`status-badge status-${pegawai.status}`}>
                    {pegawai.status}
                  </span>
                </td>
                <td>{pegawai.usia} tahun</td>
                <td>
                  <button onClick={() => handleEdit(pegawai)} className="btn-sm btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pegawai.id)} className="btn-sm btn-delete">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePegawai;
