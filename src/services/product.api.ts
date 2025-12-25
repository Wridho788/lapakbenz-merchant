import apiClient from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/constants";
import { useAuthStore } from "../store/auth.store";
import type { Product, ProductListResponse } from "../types/product.types";

// Product API Service
export const productApi = {
  // get all product
  getProducts: async (payload = {}) => {
    const token = useAuthStore.getState().token;

    const defaultPayload = {
      limit: 30,
      offset: 0,
      orderby: "",
      order: "asc",
      category: "",
      location: "",
      condition: "",
      ...payload,
    };

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CREATE_PRODUCT,
        defaultPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-auth-token": token || "",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  // Get Product by ID
  getById: async (productId: string) => {
    const token = useAuthStore.getState().token;

    const url = `${API_ENDPOINTS.GET_PRODUCT}${productId}`;
    const response = await apiClient.get<{ success: boolean; content: Product }>(
      url,
      {
        headers: {
          "X-auth-token": token || "",
        },
      }
    );
    return response.data;
  },

  // Search Products - Returns ProductListResponse with pagination
  search: async (searchPayload = {}): Promise<ProductListResponse> => {
    const response = await apiClient.post<ProductListResponse>(
      API_ENDPOINTS.SEARCH_PRODUCTS,
      searchPayload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  },

  product_city: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_CITY, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  product_categories: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_CATEGORIES, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  // Create Product
  createProduct: async (productData: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.CREATE_PRODUCT,
      productData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  },
  // add product
  addProduct: async (productData: FormData) => {
    const token = useAuthStore.getState().token;

    const response = await apiClient.post(
      API_ENDPOINTS.ADD_PRODUCT,
      productData,
      {
        headers: {
          "X-auth-token": token || "",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
  // update product
  updateProduct: async ({
    productId,
    data,
  }: {
    productId: string;
    data: FormData;
  }) => {
    const token = useAuthStore.getState().token;

    const response = await apiClient.post(
      `${API_ENDPOINTS.UPDATE_PRODUCT}/${productId}`,
      data,
      {
        headers: {
          "X-auth-token": token || "",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // add product image
  addProductImage: async (productId: string, imageData: any) => {
    const token = useAuthStore.getState().token;
    const url = `${API_ENDPOINTS.ADD_PRODUCT_IMAGE}${productId}`;
    const response = await apiClient.post(url, imageData, {
      headers: {
        "X-auth-token": token || "",
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  // publish product
  publishProduct: async (productId: string) => {
    const token = useAuthStore.getState().token;
    const url = `${API_ENDPOINTS.PUBLISH_PRODUCT}${productId}`;
    const response = await apiClient.get(url, {
      headers: {
        "X-auth-token": token || "",
      },
    });
    return response.data;
  },

  // get product category
  getProductCategory: async () => {
    const url = `${API_ENDPOINTS.PRODUCT_CATEGORY}`;
    const response = await apiClient.get<{ success: boolean; data: any }>(url);
    return response.data;
  },
};
