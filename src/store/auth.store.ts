import { create } from 'zustand';
import type { Supplier, DecodedToken } from '../types/auth.types';
import { TOKEN_KEY, API_ENDPOINTS } from '../lib/constants';
import apiClient from '../lib/api-client';

interface AuthState {
  token: string | null;
  user: Supplier | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: Supplier | null) => void;
  setLoading: (loading: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

// Zustand Store - Single Source of Truth for Auth State
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token });
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  login: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      // Decode Token Guard: Only called once on app load
      // If it fails → logout + no retry
      const response = await apiClient.get<{ content: DecodedToken }>(
        API_ENDPOINTS.DECODE_TOKEN,
        {
          headers: {
            'X-auth-token': token
          }
        }
      );

      const decodedUser = response.data.content;
      
      set({
        token,
        user: {
          id: decodedUser.userid,
          name: decodedUser.name,
          email: decodedUser.username,
          phone: decodedUser.phone || '',
          verified: true,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token is invalid/expired → force logout (no retry)
      console.warn('Token validation failed on app load. Logging out...', error);
      console.error('Token validation error details:', error);
      localStorage.removeItem(TOKEN_KEY);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
