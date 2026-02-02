import { useState, useEffect, useRef } from 'react';
import { getAllSurat, createSurat, updateSurat, deleteSurat } from '../services/suratService';
import { getAllPegawai } from '../services/api';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { id } from 'date-fns/locale';

registerLocale('id', id);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

function ManageSurat() {
  const [suratList, setSuratList] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentSurat, setCurrentSurat] = useState({
    nomor_surat: '',
    jenis_surat: 'Surat Pidana',
    pengirim: '-',
    penerima: '-',
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

  const handleSelectPegawai = (pegawai) => {
    setSearchTerm(`${pegawai.nip} - ${pegawai.nama}`);
    const golValid = pegawai.golongan && pegawai.golongan !== 'undefined' && pegawai.golongan !== '-';
    const pangkatFormatted = golValid 
      ? `${pegawai.pangkat} / (${pegawai.golongan})`
      : pegawai.pangkat;

    setCurrentSurat(prev => ({
      ...prev,
      nip: pegawai.nip,
      nama_pegawai: pegawai.nama,
      pangkat: pangkatFormatted,
      jabatan: pegawai.jabatan,
      opd_new: pegawai.instansi || pegawai.opd_new
    }));
    setShowDropdown(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (existing helper functions)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Format date to YYYY-MM-DD
      const formattedSurat = {
        ...currentSurat,
        tanggal_surat: currentSurat.tanggal_surat ? new Date(currentSurat.tanggal_surat).toISOString().split('T')[0] : ''
      };

      let response;
      if (currentSurat.id) {
        response = await updateSurat(currentSurat.id, formattedSurat);
      } else {
        response = await createSurat(formattedSurat);
        
        if (response && response.file_path) {
            const downloadUrl = `${BASE_URL}${response.file_path}`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', '');
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
      const errorMsg = error.response?.data?.message || error.message || 'Gagal menyimpan surat';
      alert(`Gagal menyimpan surat: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
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
    setSearchTerm(`${surat.nip} - ${surat.nama_pegawai || ''}`);
    setShowForm(true);
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
      pengirim: '-',
      penerima: '-',
      tanggal_surat: '',
      kepala_opd: '',
      no_pdna: '',
      nama_pegawai: '',
      nip: '',
      pangkat: '',
      jabatan: '',
      opd_new: ''
    });
    setSearchTerm('');
    setShowDropdown(false);
    setShowForm(false);
  };

  // Calculate filtered results outside JSX for easier access
  const filteredPegawai = pegawaiList.filter(p => 
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.nip.includes(searchTerm)
  );

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef(null);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Auto-scroll to highlighted item
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredPegawai.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredPegawai.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredPegawai[highlightedIndex]) {
        handleSelectPegawai(filteredPegawai[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
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
              <label>Tanggal OPD</label>
              <DatePicker
                selected={currentSurat.tanggal_surat ? new Date(currentSurat.tanggal_surat) : null}
                onChange={(date) => {
                  if (date) {
                     const year = date.getFullYear();
                     const month = String(date.getMonth() + 1).padStart(2, '0');
                     const day = String(date.getDate()).padStart(2, '0');
                     setCurrentSurat({ ...currentSurat, tanggal_surat: `${year}-${month}-${day}` });
                  } else {
                     setCurrentSurat({ ...currentSurat, tanggal_surat: '' });
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
                yearDropdownItemNumber={10}
                todayButton="Hari Ini"
                locale="id"
              />
            </div>
          </div>

            {/* 2 Columns Row - Removed Nama Pegawai */}
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
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
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', borderTop: '1px dashed #e5e7eb', paddingTop: '1rem' }}>
            Data Pegawai
          </h3>

          <div className="form-group">
            <label>Cari NIP / Nama Pegawai</label>
            <div className="search-container" style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value === '') {
                    setShowDropdown(false);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ketik NIP atau Nama..."
                className="form-control"
              />
              
              {showDropdown && searchTerm && (
                <ul 
                  ref={listRef}
                  className="dropdown-results" 
                  style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  zIndex: 1000,
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {filteredPegawai.map((p, index) => (
                      <li 
                        key={p.id}
                        onClick={() => handleSelectPegawai(p)}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6',
                          background: index === highlightedIndex ? '#eff6ff' : 'white',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f9fafb';
                          setHighlightedIndex(index);
                        }}
                        onMouseLeave={(e) => {
                          if (index !== highlightedIndex) e.target.style.background = 'white';
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{p.nama}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          NIP: {p.nip} | {p.pangkat} {p.golongan && p.golongan !== 'undefined' ? `/ (${p.golongan})` : ''}
                        </div>
                      </li>
                    ))
                  }
                  {filteredPegawai.length === 0 && (
                     <li style={{ padding: '10px', color: '#9ca3af', fontStyle: 'italic' }}>Tidak ditemukan</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Read-Only Details Auto-filled */}
          {currentSurat.nama_pegawai && (
              <div className="form-grid" style={{ marginTop: '1rem', background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                   <div className="form-group">
                      <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Nama Pegawai</label>
                      <div style={{ fontWeight: 500 }}>{currentSurat.nama_pegawai || '-'}</div>
                  </div>
                  <div className="form-group">
                      <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Pangkat</label>
                      <div>{currentSurat.pangkat || '-'}</div>
                  </div>
                   <div className="form-group">
                      <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Jabatan</label>
                      <div>{currentSurat.jabatan || '-'}</div>
                  </div>
                   <div className="form-group">
                      <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Instansi</label>
                      <div>{currentSurat.opd_new || '-'}</div>
                  </div>
              </div>
          )}

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
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
              <th>Nama Pegawai</th>
              <th>NIP</th>
              <th>Kode Unik</th>
              <th>Jenis</th>
              <th>Tanggal Surat Masuk</th>
              <th>Status</th>
              <th>QR Code</th>
              <th>Dokumen</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suratList.map((surat) => (
              <tr key={surat.id}>
                <td>{surat.nomor_surat}</td>
                <td>{surat.nama_pegawai || '-'}</td>
                <td>{surat.nip || '-'}</td>
                <td><strong style={{ color: '#2563eb' }}>{surat.kode_unik}</strong></td>
                <td>{surat.jenis_surat}</td>
                <td>{surat.created_at ? new Date(surat.created_at).toLocaleDateString('id-ID') : '-'}</td>
                <td><span className="badge">{surat.status}</span></td>
                <td>
                  {surat.qr_code && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                      <a href={`${BASE_URL}${surat.qr_code}`} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={`${BASE_URL}${surat.qr_code}`} 
                          alt="QR Card" 
                          style={{ 
                            height: '120px', 
                            width: 'auto', 
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} 
                        />
                      </a>
                      <a href={`${BASE_URL}${surat.qr_code}`} download className="btn-link" style={{ fontSize: '0.8rem' }}>
                        Unduh Kartu
                      </a>
                    </div>
                  )}
                </td>
                <td>
                   {surat.file_path ? (
                      <a href={`${BASE_URL}${surat.file_path}`} download className="btn-download" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 10px', borderRadius: '4px', border: '1px solid #bae6fd', fontSize: '0.85rem' }}>
                         📄 Word
                      </a>
                   ) : (
                      <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.8rem' }}>-</span>
                   )}
                </td>
                <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => handleEdit(surat)} className="btn-sm btn-edit" style={{ backgroundColor: '#eab308', color: 'white', border: 'none' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(surat.id)} className="btn-sm btn-delete">
                        Hapus
                      </button>
                    </div>
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
