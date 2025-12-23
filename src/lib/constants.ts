// API Configuration & Constants

export const API_BASE_URL = 'https://mbapi.dswip.com/';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: 'supplier/login',
  REGISTER: 'supplier/add',
  FORGOT_PASSWORD: 'supplier/forgot',
  REQUEST_OTP: 'supplier/req_otp',
  CHANGE_PASSWORD: 'supplier/change_password',
  GET_PROFILE: 'supplier/get',
  VERIFY_OTP: 'supplier/verify', // /:userId/:otpCode
  LOGOUT: 'supplier/logout',
  DECODE_TOKEN: 'supplier/decode_token',
  
  // Product endpoints
  CREATE_PRODUCT: 'product/',
  GET_PRODUCT: 'product/get', // /:productId
  SEARCH_PRODUCTS: 'product/search',
  PRODUCT_CATEGORIES: 'product/category',
  PRODUCT_CITY: 'product/city_product',
} as const;

export const TOKEN_KEY = 'lapakbenz_supplier_token';
