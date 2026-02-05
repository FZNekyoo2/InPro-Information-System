import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
     const role = user?.role || '';
     if (role.toLowerCase() === 'superadmin' || user?.username?.toLowerCase() === 'superadmin') {
        return <Navigate to="/superadmin" replace />;
     } else {
        return <Navigate to="/admin" replace />;
     }
  }

  return <Outlet />;
};

export default PublicRoute;
