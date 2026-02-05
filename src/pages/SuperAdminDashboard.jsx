
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/superadmin/UserManagement';
import ActivityLog from '../components/superadmin/ActivityLog';
import SettingsManagement from '../components/superadmin/SettingsManagement';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="branding">
           <img src="/Logo_Kota_Medan_(Seal_of_Medan).svg" alt="Logo" style={{height: '40px'}} />
           <div>
             <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Superadmin Portal</h1>
             <p style={{ margin: 0, fontSize: '0.85rem' }}>Selamat datang, {user?.username}</p>
           </div>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      <div className="quick-menu">
        <button 
          className={`quick-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' } : {}}
        >
          👥 Manajemen Admin
        </button>
        <button 
          className={`quick-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
          style={activeTab === 'logs' ? { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' } : {}}
        >
          📜 Log Aktivitas
        </button>
        <button 
          className={`quick-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          style={activeTab === 'settings' ? { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' } : {}}
        >
          ⚙️ Konfigurasi Website
        </button>
         <button 
          className="quick-btn"
          onClick={() => navigate('/admin')}
        >
          📊 Dashboard Biasa
        </button>
      </div>

      <div className="content-area">
        {activeTab === 'users' ? <UserManagement /> : 
         activeTab === 'logs' ? <ActivityLog /> : 
         <SettingsManagement />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
