import { Navigate, useLocation } from 'react-router-dom';
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

// Verification Route - Only users from registration can access
export function VerificationRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const state = location.state as { phone?: string; userId?: string } | null;

  // Check if user came from registration with necessary data
  if (!state || !state.phone || !state.userId) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}

// Reset Password Route - Only users who requested OTP can access
export function ResetPasswordRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const state = location.state as { phone?: string } | null;

  // Check if user came from forgot password with phone
  if (!state || !state.phone) {
    return <Navigate to="/forgot-password" replace />;
  }

  return <>{children}</>;
}