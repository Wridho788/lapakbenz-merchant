// Authentication Types & Interfaces

export interface LoginCredentials {
  username: string;
  password: string;
  device: "";
}

export interface RegisterData {
  name: string;
  type: string;
  cp: string;
  npwp: string;
  address: string;
  shipping_province: string;
  shipping_city: string;
  shipping_district: string;
  zip: string;
  phone1: string;
  phone2: string;
  email: string;
  password: string;
  acc_name: string;
  acc_no: string;
  acc_bank: string;
}

export interface ForgotPasswordData {
  username: string;
  new_password: string;
  otp: string;
}

export interface RequestOtpData {
  username: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface VerifyOtpParams {
  userid: string;
  otp: string;
}

export interface AuthResponse {
  error?: string;
  status?: number;
  content?: {
    token?: string;
    log?: number;
    status?: number;
    userid?: number | string;
    username?: string;
    phone?: string;
    verified?: number;
    id?: number;
  };
  token?: string;
  data?: any;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DecodedToken {
  userid: string;
  username: string;
  name: string;
  phone?: string;
  log?: number;
}

export interface AuthState {
  token: string | null;
  user: Supplier | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
