import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { PageLoader } from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route - Only authenticated users can access
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Guest Route - Only non-authenticated users can access (login, register)
export function GuestRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}