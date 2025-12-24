import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import { useAuthStore } from '../store/auth.store';
import { authKeys } from '../utils/query-keys';
import { normalizeError } from '../utils/error-normalizer';

// Login Hook with error normalization
export const useLogin = () => {
  const { login: setLogin, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data: any) => {
      // Response structure: { content: { token, status, userid, log } }
      if (data.content && data.content.status === 1 && data.content.token) {
        setLogin(data.content.token);
        
        // Fetch user profile after login
        try {
          const response = await authApi.decodeToken();
          // Response structure: { content: { userid, name, username, phone, log } }
          if (response && response.content) {
            const decodedUser = response.content;
            setUser({
              id: decodedUser.userid,
              name: decodedUser.name,
              email: decodedUser.username,
              phone: decodedUser.phone || '',
              verified: true,
            });
          } else {
            console.error('Failed to decode token: Invalid response structure', response);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
    onError: (error) => {
      const normalized = normalizeError(error);
      console.error('Login failed:', normalized);
      return normalized;
    },
  });
};

// Register Hook with error normalization
export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onError: (error) => {
      const normalized = normalizeError(error);
      console.error('Registration failed:', normalized);
      return normalized;
    },
  });
};

// Forgot Password Hook with error normalization
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    retry: false, // Jangan retry pada error
    onError: (error) => {
      console.error('Forgot password failed:', error);
      // Remove return statement - tidak berguna
    },
  });
};

// Request OTP Hook with error normalization
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: authApi.requestOtp,
    onError: (error) => {
      const normalized = normalizeError(error);
      console.error('Request OTP failed:', normalized);
      return normalized;
    },
  });
};

// Verify OTP Hook with error normalization
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onError: (error) => {
      const normalized = normalizeError(error);
      console.error('Verify OTP failed:', normalized);
      return normalized;
    },
  });
};

// Change Password Hook with error normalization
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onError: (error) => {
      const normalized = normalizeError(error);
      console.error('Change password failed:', normalized);
      return normalized;
    },
  });
};

// Get Profile Hook
export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Decode Token Hook
export const useDecodeToken = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: authKeys.decode(),
    queryFn: authApi.decodeToken,
    enabled: !!token,
    staleTime: Infinity,
    retry: false,
  });
};

// Logout Hook
export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};
