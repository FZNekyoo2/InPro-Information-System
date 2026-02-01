import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TrackingSurat from './pages/TrackingSurat';
import ManagePegawai from './pages/ManagePegawai';
import ManageSurat from './pages/ManageSurat';
import SuratSelesai from './pages/SuratSelesai';
import ManageTemplate from './pages/ManageTemplate';
import EmployeeSearchPage from './pages/EmployeeSearchPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tracking" element={<TrackingSurat />} />
          <Route path="/search-pegawai" element={<EmployeeSearchPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pegawai" element={<ManagePegawai />} />
          <Route path="/admin/surat" element={<ManageSurat />} />
          <Route path="/admin/surat-selesai" element={<SuratSelesai />} />
          <Route path="/admin/template" element={<ManageTemplate />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
