import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TrackingSurat from './pages/TrackingSurat';
import ManagePegawai from './pages/ManagePegawai';
import ManageSurat from './pages/ManageSurat';
import SuratSelesai from './pages/SuratSelesai';
import Arsip from './pages/Arsip';
import ManageTemplate from './pages/ManageTemplate';
import EmployeeSearchPage from './pages/EmployeeSearchPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import IdleTimer from './components/IdleTimer';
import './App.css';

function App() {
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.website_title) {
          document.title = data.website_title;
        }
      })
      .catch(err => console.error('Error fetching settings for title:', err));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <IdleTimer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tracking" element={<TrackingSurat />} />
          <Route path="/search-pegawai" element={<EmployeeSearchPage />} />

          {/* Guest Route (Login) - Prevents access if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes (Admin) - Requires Login */}
          <Route element={<ProtectedRoute />}>
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/pegawai" element={<ManagePegawai />} />
             <Route path="/admin/surat" element={<ManageSurat />} />
             <Route path="/admin/surat-selesai" element={<SuratSelesai />} />
             <Route path="/admin/arsip" element={<Arsip />} />
             <Route path="/admin/template" element={<ManageTemplate />} />
             <Route path="/superadmin" element={<SuperAdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
