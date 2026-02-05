import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(credentials);
      // Update global auth state
      authLogin(response.user);
      
      // Save to local storage (redundant if service does it, but safer to keep for now)
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('Login Response:', response);
      // Check role (case-insensitive) OR if username is 'superadmin'
      const role = response.user.role || '';
      if (role.toLowerCase() === 'superadmin' || response.user.username.toLowerCase() === 'superadmin') {
        navigate('/superadmin');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || `Login gagal: ${err.message} (${err.response?.status || 'No Status'})`);
      alert(`Debug Error: ${JSON.stringify(err.response?.data || err.message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/" title="Kembali ke Beranda">
          <img
            src="/Logo_Kota_Medan_(Seal_of_Medan).svg"
            alt="Logo Kota Medan"
            className="login-logo"
          />
        </Link>
        <h2>Admin Portal</h2>
        <p>Masuk untuk mengelola surat dan pegawai</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username anda"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                disabled={loading}
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
                }}
                title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
