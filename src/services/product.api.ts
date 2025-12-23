import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/constants';
import type {
  Product,
  ProductListResponse,
} from '../types/product.types';

// Product API Service
export const productApi = {
  // get all product
  getProducts: async (payload = {}) => {
    const defaultPayload = {
      limit: 30,
      offset: 0,
      orderby: '',
      order: 'asc',
      category: '',
      location: '',
      condition: '',
      ...payload
    };

    try {
      const response = await apiClient.post(API_ENDPOINTS.CREATE_PRODUCT, defaultPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  // Get Product by ID
  getById: async (productId: string) => {
    const url = `${API_ENDPOINTS.GET_PRODUCT}/${productId}`;
    const response = await apiClient.get<{ success: boolean; data: Product }>(url);
    return response.data;
  },

  // Search Products - Returns ProductListResponse with pagination
  search: async (searchPayload = {}): Promise<ProductListResponse> => {
    const response = await apiClient.post<ProductListResponse>(API_ENDPOINTS.SEARCH_PRODUCTS, searchPayload,{
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  product_city: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_CITY, { headers: { 'Content-Type': 'application/json' } });
    return response.data;
  },

  product_categories: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_CATEGORIES, { headers: { 'Content-Type': 'application/json' } });
    return response.data;
  },

  // Create Product
  createProduct: async (productData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_PRODUCT, productData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }
};
