import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// Gunakan import.meta.env.VITE_API_URL untuk URL backend jika ada di api helper atau definisikan langsung
// Karena user menggunakan axios instance 'api' di kode asli, saya asumsikan ada di ../services/api
// Jika tidak, saya akan gunakan fetch biasa untuk keamanan.
// Update: User snippet menggunakan `import api from '../api';` tapi struktur project saya `src/services/api.js`
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f4f5f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.h1`
  color: #172b4d;
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid #dfe1e6;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #4caf50;
  }
`;

const Button = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 0 2rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #43a047;
  }
`;

const EmployeeCard = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: #4caf50;
  color: white;
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

const CardBody = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
`;

const BackLink = styled(Link)`
  margin-top: 2rem;
  color: #5e6c84;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const EmployeeSearchPage = () => {
  const [nip, setNip] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!nip) return;
    try {
      setError('');
      setEmployee(null);
      // Menggunakan axios langsung ke endpoint baru
      const response = await axios.get(`${API_URL}/pegawai/nip/${nip}`);
      setEmployee(response.data);
    } catch (err) {
      setError('Pegawai tidak ditemukan. Periksa NIP kembali.');
    }
  };

  return (
    <PageContainer>
      <Header>Cari Data Pegawai</Header>
      <SearchBox>
        <Input
          placeholder="Masukkan NIP (Contoh: 19850615...)"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Cari</Button>
      </SearchBox>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {employee && (
        <EmployeeCard>
          <CardHeader>{employee.nama}</CardHeader>
          <CardBody>
            <Field><Label>NIP</Label><Value>{employee.nip}</Value></Field>
            <Field><Label>Pangkat</Label><Value>{employee.pangkat}</Value></Field>
            <Field><Label>Golongan</Label><Value>{employee.golongan}</Value></Field>
            <Field><Label>Jabatan</Label><Value>{employee.jabatan}</Value></Field>
            <Field><Label>Unit Kerja</Label><Value>{employee.unit_kerja}</Value></Field>
            <Field><Label>Usia</Label><Value>{employee.usia} Tahun</Value></Field>
            <Field><Label>Status</Label><Value>{employee.is_retired ? 'Pensiun' : 'Aktif'}</Value></Field>
          </CardBody>
        </EmployeeCard>
      )}

      <BackLink to="/">Kembali ke Beranda</BackLink>
    </PageContainer>
  );
};

export default EmployeeSearchPage;
