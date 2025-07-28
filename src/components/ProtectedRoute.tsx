import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LoginRequired from './LoginRequired';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true = require login, false = require logout
  showLoginRequired?: boolean; // Show LoginRequired component instead of redirecting
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/',
  requireAuth = true,
  showLoginRequired = false
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated && !showLoginRequired) {
        // User needs to be logged in but isn't - redirect to login
        toast.info('Vui lòng đăng nhập để tiếp tục');
        navigate('/login');
      } else if (!requireAuth && isAuthenticated) {
        // User needs to be logged out but is logged in (e.g., login/register pages)
        toast.success('Bạn đã đăng nhập thành công!');
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, requireAuth, showLoginRequired]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Don't render if user should be redirected
  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requireAuth && !isAuthenticated) {
    if (showLoginRequired) {
      return <LoginRequired redirectPath={redirectTo} />;
    }
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
