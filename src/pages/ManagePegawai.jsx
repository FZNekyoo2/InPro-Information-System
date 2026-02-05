import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPegawai, createPegawai, updatePegawai, deletePegawai } from '../services/api';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { id } from 'date-fns/locale';
import AlertModal from '../components/AlertModal';

registerLocale('id', id);

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
  const [alertData, setAlertData] = useState({ message: '', type: 'success' });

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
      setAlertData({ message: 'Data Berhasil Diubah', type: 'success' });
    } catch (error) {
      console.error('Error saving pegawai:', error);
      setAlertData({ message: 'Gagal menyimpan data pegawai', type: 'error' });
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
        setAlertData({ message: 'Data Berhasil Dihapus', type: 'success' });
      } catch (error) {
        console.error('Error deleting pegawai:', error);
        setAlertData({ message: 'Gagal menghapus data pegawai', type: 'error' });
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
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filter Pegawai List
  const filteredPegawaiList = pegawaiList.filter(pegawai => 
    pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pegawai.nip.includes(searchTerm)
  );

  return (
    <div className="manage-container">
      <AlertModal 
        message={alertData.message} 
        type={alertData.type} 
        onClose={() => setAlertData({ message: '', type: 'success' })} 
      />
      
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" className="header-logo" style={{ width: '56px' }} />
          <div>
            <h1 style={{ marginBottom: '0.25rem', fontSize: '1.8rem' }}>Kelola Data Pegawai</h1>
            <p className="dashboard-subtitle" style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Manajemen data kepegawaian dan status</p>
          </div>
        </div>
        <div className="header-actions">
           <Link to="/admin" className="btn btn-secondary">← Kembali ke Dashboard</Link>
        </div>
      </header>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Tutup Form' : '+ Tambah Pegawai'}
        </button>

        <input
          type="text"
          placeholder="🔍 Cari Nama Pegawai / NIP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ maxWidth: '300px', margin: 0 }}
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          {/* ... existing form content ... */}
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
              <DatePicker
                selected={currentPegawai.tanggal_lahir ? new Date(currentPegawai.tanggal_lahir) : null}
                onChange={(date) => {
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    setCurrentPegawai({...currentPegawai, tanggal_lahir: `${year}-${month}-${day}`});
                  } else {
                    setCurrentPegawai({...currentPegawai, tanggal_lahir: ''});
                  }
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className="form-control"
                required
                wrapperClassName="date-picker-wrapper"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                todayButton="Hari Ini"
                locale="id"
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
            {filteredPegawaiList.length === 0 ? (
               <tr><td colSpan="10" className="no-data" style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>Tidak ada data pegawai ditemukan</td></tr>
            ) : (
              filteredPegawaiList.map((pegawai) => (
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
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePegawai;
