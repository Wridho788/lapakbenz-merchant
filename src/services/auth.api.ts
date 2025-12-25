import apiClient from "../lib/api-client";
import { API_ENDPOINTS, TOKEN_KEY } from "../lib/constants";
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  RequestOtpData,
  ChangePasswordData,
  VerifyOtpParams,
  AuthResponse,
  Supplier,
  DecodedToken,
} from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";

// Auth API Service - Single Responsibility
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    // Store token if login successful
    if (response.data.content && response.data.content.token) {
      localStorage.setItem(TOKEN_KEY, response.data.content.token);
    }

    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Convert to URL-encoded format
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, value);
    });

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  },

  // Forgot Password

  forgotPassword: async (data: ForgotPasswordData): Promise<AuthResponse> => {
    const token = useAuthStore.getState().token;

    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.FORGOT_PASSWORD,
        data,
        {
          headers: {
            "X-auth-token": token || "",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("forgotPassword API error:", error);

      // Extract error message dari berbagai kemungkinan struktur response
      let errorMessage = "Terjadi kesalahan saat mengubah kata sandi";

      if (error.response?.data?.error) {
        const errorText = error.response.data.error;

        // Translate error messages ke Bahasa Indonesia
        if (errorText.includes("Can't use previous password")) {
          errorMessage =
            "Tidak dapat menggunakan kata sandi sebelumnya. Silakan gunakan kata sandi yang berbeda.";
        } else if (
          errorText.includes("Invalid OTP") ||
          errorText.toLowerCase().includes("otp")
        ) {
          errorMessage = "Kode OTP tidak valid atau sudah kadaluarsa";
        } else if (errorText.includes("User not found")) {
          errorMessage = "Pengguna tidak ditemukan";
        } else if (errorText.includes("expired")) {
          errorMessage = "Kode OTP sudah kadaluarsa";
        } else {
          errorMessage = errorText;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Normalize error structure - PERBAIKI message field
      const normalizedError = {
        status: error.response?.status || 500,
        error: error.response?.data?.error || error.message,
        message: errorMessage, // ✅ Ini sudah benar sekarang
        success: false,
      };

      console.log("Throwing normalized error:", normalizedError);

      throw normalizedError;
    }
  },

  // Request OTP
  requestOtp: async (data: RequestOtpData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REQUEST_OTP,
      data
    );
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (params: VerifyOtpParams): Promise<AuthResponse> => {
    const url = `${API_ENDPOINTS.VERIFY_OTP}/${params.userid}/${params.otp}`;
    const response = await apiClient.get<AuthResponse>(url);
    return response.data;
  },

  // Change Password
  changePassword: async (data: ChangePasswordData): Promise<AuthResponse> => {
    const token = useAuthStore.getState().token;
    
    // Convert to URL-encoded format
    const params = new URLSearchParams();
    params.append("old_pass", data.old_password);
    params.append("new_pass", data.new_password);
    
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      params.toString(),
      {
        headers: {
          "X-auth-token": token || "",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<Supplier> => {
    const token = useAuthStore.getState().token;
    const response = await apiClient.get<{ success: boolean; data: Supplier }>(
      API_ENDPOINTS.GET_PROFILE,
      {
        headers: {
          "X-auth-token": token || "",
        },
      }
    );
    return response.data.data;
  },

  // Decode Token
  decodeToken: async (): Promise<DecodedToken> => {
    const token = useAuthStore.getState().token;
    const response = await apiClient.get<{ content: DecodedToken }>(
      API_ENDPOINTS.DECODE_TOKEN,
      {
        headers: {
          "X-auth-token": token || "",
        },
      }
    );
    return response.data.content;
  },

  // Logout
  logout: async (): Promise<AuthResponse> => {
    const token = useAuthStore.getState().token;

    try {
      const response = await apiClient.get<AuthResponse>(API_ENDPOINTS.LOGOUT, {
        headers: {
          "X-auth-token": token || "",
        },
      });
      // Clear token regardless of response
      localStorage.removeItem(TOKEN_KEY);
      return response.data;
    } catch (error) {
      // Always clear token even if request fails
      localStorage.removeItem(TOKEN_KEY);
      throw error;
    }
  },

  // Get stored token
  getToken: (): string | null => {
    return useAuthStore.getState().token;
  },

  // Clear token
  clearToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
