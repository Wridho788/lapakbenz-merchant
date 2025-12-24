import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { productApi } from "../services/product.api";
import { productKeys } from "../utils/query-keys";

// Product API Hooks
interface UseProductsPayload {
  limit?: number;
  offset?: number;
  orderby?: string;
  order?: "asc" | "desc";
  category?: string;
  location?: string;
  condition?: string;
}

export function useProducts(
  payload: UseProductsPayload = {}
): UseQueryResult<any, Error> {
  const defaultPayload = {
    limit: 12,
    offset: 0,
    orderby: "",
    order: "asc" as const,
    category: "",
    location: "",
    condition: "",
    ...payload,
  };

  return useQuery({
    queryKey: ["products", JSON.stringify(defaultPayload)],
    queryFn: () => productApi.getProducts(defaultPayload),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
// Get Product by ID Hook - Performance optimized
export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productApi.getById(productId),
    enabled: !!productId,
    staleTime: 30 * 1000, // 30 seconds - Sprint 2 requirement
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
  });
};
interface UseProductSearchPayload {
  filter: string;
}
// Search Products Hook - Performance optimized with keepPreviousData behavior
export function useSearchProducts(): UseMutationResult<
  any,
  Error,
  UseProductSearchPayload
> {
  return useMutation({
    mutationFn: async (payload: UseProductSearchPayload) => {
      try {
        return await productApi.search(payload);
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useProductCategories(): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["productCategories"],
    queryFn: async () => {
      try {
        return await productApi.product_categories();
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (categories don't change often)
    retry: 2,
  });
}

export function useProductCities(): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["productCities"],
    queryFn: () => productApi.product_city(),
    staleTime: 1000 * 60 * 10, // 10 minutes (cities don't change often)
    retry: 2,
    enabled: true, // Always fetch since no token is required
  });
}

// Create Product Hook
export function useCreateProduct(): UseMutationResult<any, Error, any> {
  return useMutation({
    mutationFn: async (productData: any) => {
      try {
        return await productApi.createProduct(productData);
      } catch (error) {
        throw error;
      }
    },
  });
}

// add product
export function useAddProduct(): UseMutationResult<any, Error, any> {
  return useMutation({
    mutationFn: async (productData: any) => {
      try {
        return await productApi.addProduct(productData);
      } catch (error) {
        throw error;
      }
    },
  });
}

// update product
export function useUpdateProduct(): UseMutationResult<
  any,
  Error,
  { productId: string; data: FormData }
> {
  return useMutation({
    mutationFn: async ({ productId, data }) => {
      try {
        return await productApi.updateProduct(productId, data);
      } catch (error) {
        throw error;
      }
    },
  });
}

// publish product
export function usePublishProduct(): UseMutationResult<
  any,
  Error,
  string
> {
  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        return await productApi.publishProduct(productId);
      } catch (error) {
        throw error;
      }
    },
  });
}

// Add Product Image Hook
export function useAddProductImage(): UseMutationResult<
  any,
  Error,
  { productId: string; imageData: any }
> {
  return useMutation({
    mutationFn: async ({ productId, imageData }) => {
      try {
        return await productApi.addProductImage(productId, imageData);
      } catch (error) {
        throw error;
      }
    },
  });
}
