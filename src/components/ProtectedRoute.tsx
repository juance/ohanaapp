import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';  // Updated import

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, checkUserPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!checkUserPermission(allowedRoles)) {
    // If user's role isn't in the allowed roles list
    // Redirect clients to their user tickets page
    if (user.role === 'client') {
      return <Navigate to="/user-tickets" replace />;
    }
    
    // Redirect others to auth page
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
