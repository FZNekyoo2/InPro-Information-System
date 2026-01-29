import { useState, useEffect } from 'react';
import { getAllSurat, createSurat, updateSurat, deleteSurat } from '../services/suratService';
import { getAllPegawai } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

function ManageSurat() {
  const [suratList, setSuratList] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentSurat, setCurrentSurat] = useState({
    nomor_surat: '',
    jenis_surat: 'Surat Pidana',
    pengirim: '',
    penerima: '',
    tanggal_surat: '',
    kepala_opd: '',
    no_pdna: '',
    nama_pegawai: '',
    nip: '',
    pangkat: '',
    jabatan: '',
    opd_new: ''
  });

  useEffect(() => {
    fetchSurat();
    fetchPegawai();
  }, []);

  const fetchSurat = async () => {
    try {
      const data = await getAllSurat();
      setSuratList(data);
    } catch (error) {
      console.error('Error fetching surat:', error);
    }
  };

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
      let response;
      if (currentSurat.id) {
        response = await updateSurat(currentSurat.id, currentSurat);
        // Note: Update logic might need similar handling if we add regeneration there
      } else {
        response = await createSurat(currentSurat);
        
        // Check if file_path is returned and download it
        if (response && response.file_path) {
            const downloadUrl = `${BASE_URL}${response.file_path}`;
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', ''); // Force download
            document.body.appendChild(link);
            link.click();
            link.remove();
            alert('Surat berhasil dibuat dan dokumen sedang diunduh!');
        } else {
            alert('Surat berhasil dibuat!');
        }
      }
      
      fetchSurat();
      resetForm();
    } catch (error) {
      console.error('Error saving surat:', error);
      alert('Gagal menyimpan surat');
    }
  };

  const handleEdit = (surat) => {
    setCurrentSurat({
      ...surat,
      kepala_opd: surat.kepala_opd || '',
      no_pdna: surat.no_pdna || '',
      nama_pegawai: surat.nama_pegawai || '',
      nip: surat.nip || '',
      pangkat: surat.pangkat || '',
      jabatan: surat.jabatan || '',
      opd_new: surat.opd_new || ''
    });
    setShowForm(true);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus surat ini?')) {
      try {
        await deleteSurat(id);
        fetchSurat();
      } catch (error) {
        console.error('Error deleting surat:', error);
      }
    }
  };

  const resetForm = () => {
    setCurrentSurat({
      nomor_surat: '',
      jenis_surat: 'Surat Pidana',
      pengirim: '',
      penerima: '',
      tanggal_surat: '',
      kepala_opd: '',
      no_pdna: '',
      nama_pegawai: '',
      nip: '',
      pangkat: '',
      jabatan: '',
      opd_new: ''
    });
    setShowForm(false);
  };

  return (
    <div className="manage-container">
      <h1>Kelola Surat</h1>

      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Tutup Form' : '+ Tambah Surat'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>{currentSurat.id ? 'Edit Surat' : 'Tambah Surat Baru'}</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Nomor Surat</label>
              <input
                type="text"
                value={currentSurat.nomor_surat}
                onChange={(e) => setCurrentSurat({ ...currentSurat, nomor_surat: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Jenis Surat</label>
              <input
                type="text"
                value="Surat Pidana"
                disabled
                className="bg-gray-100" // Optional styling if using tailwind or similar, otherwise just disabled is enough
              />
            </div>

            <div className="form-group">
              <label>Pengirim</label>
              <input
                type="text"
                value={currentSurat.pengirim}
                onChange={(e) => setCurrentSurat({ ...currentSurat, pengirim: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Penerima</label>
              <input
                type="text"
                value={currentSurat.penerima}
                onChange={(e) => setCurrentSurat({ ...currentSurat, penerima: e.target.value })}
                required
              />
            </div>



            <div className="form-group">
              <label>Tanggal Surat</label>
              <input
                type="date"
                value={currentSurat.tanggal_surat}
                onChange={(e) => setCurrentSurat({ ...currentSurat, tanggal_surat: e.target.value })}
                required
              />
            </div>
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', borderTop: '1px dashed #e5e7eb', paddingTop: '1rem' }}>
            Detail Penanda Tangan
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Kepala OPD</label>
              <input
                type="text"
                placeholder="Contoh: KEPALA BADAN..."
                value={currentSurat.kepala_opd}
                onChange={(e) => setCurrentSurat({ ...currentSurat, kepala_opd: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>No. PDNA</label>
              <input
                type="text"
                value={currentSurat.no_pdna}
                onChange={(e) => setCurrentSurat({ ...currentSurat, no_pdna: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Nama Pegawai</label>
              <input
                type="text"
                value={currentSurat.nama_pegawai}
                onChange={(e) => setCurrentSurat({ ...currentSurat, nama_pegawai: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>NIP</label>
              <input
                type="text"
                value={currentSurat.nip}
                onChange={(e) => setCurrentSurat({ ...currentSurat, nip: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Pangkat</label>
              <input
                type="text"
                value={currentSurat.pangkat}
                onChange={(e) => setCurrentSurat({ ...currentSurat, pangkat: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Jabatan</label>
              <input
                type="text"
                value={currentSurat.jabatan}
                onChange={(e) => setCurrentSurat({ ...currentSurat, jabatan: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>OPD New</label>
              <input
                type="text"
                value={currentSurat.opd_new}
                onChange={(e) => setCurrentSurat({ ...currentSurat, opd_new: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Simpan
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
              <th>Nomor Surat</th>
              <th>Kode Unik</th>
              <th>Jenis</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>QR Code</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suratList.map((surat) => (
              <tr key={surat.id}>
                <td>{surat.nomor_surat}</td>
                <td><strong style={{ color: '#2563eb' }}>{surat.kode_unik}</strong></td>
                <td>{surat.jenis_surat}</td>
                <td>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</td>
                <td><span className="badge">{surat.status}</span></td>
                <td>
                  {surat.qr_code && (
                    <a href={`${BASE_URL}${surat.qr_code}`} target="_blank" rel="noopener noreferrer">
                      <img src={`${BASE_URL}${surat.qr_code}`} alt="QR" width="50" />
                    </a>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(surat)} className="btn-sm btn-edit" style={{ marginRight: '0.5rem', backgroundColor: '#eab308' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(surat.id)} className="btn-sm btn-delete">
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

export default ManageSurat;
