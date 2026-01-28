import { useState, useEffect } from 'react';
import { getAllSurat, createSurat, updateSurat, deleteSurat } from '../services/suratService';
import { getAllPegawai } from '../services/api';

function ManageSurat() {
  const [suratList, setSuratList] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentSurat, setCurrentSurat] = useState({
    nomor_surat: '',
    jenis_surat: '',
    pengirim: '',
    penerima: '',
    perihal: '',
    tanggal_surat: ''
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
      await createSurat(currentSurat);
      fetchSurat();
      resetForm();
    } catch (error) {
      console.error('Error creating surat:', error);
    }
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
      jenis_surat: '',
      pengirim: '',
      penerima: '',
      perihal: '',
      tanggal_surat: ''
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
          <h3>Tambah Surat Baru</h3>

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
              <select
                value={currentSurat.jenis_surat}
                onChange={(e) => setCurrentSurat({ ...currentSurat, jenis_surat: e.target.value })}
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="Surat Masuk">Surat Masuk</option>
                <option value="Surat Keluar">Surat Keluar</option>
                <option value="Surat Keputusan">Surat Keputusan</option>
                <option value="Surat Tugas">Surat Tugas</option>
              </select>
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

            <div className="form-group full-width">
              <label>Perihal</label>
              <textarea
                value={currentSurat.perihal}
                onChange={(e) => setCurrentSurat({ ...currentSurat, perihal: e.target.value })}
                required
                rows="3"
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
              <th>Perihal</th>
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
                <td>{surat.perihal}</td>
                <td>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</td>
                <td><span className="badge">{surat.status}</span></td>
                <td>
                  {surat.qr_code && (
                    <a href={`http://localhost:3001${surat.qr_code}`} target="_blank" rel="noopener noreferrer">
                      <img src={`http://localhost:3001${surat.qr_code}`} alt="QR" width="50" />
                    </a>
                  )}
                </td>
                <td>
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
