/**
 * 4.3.2 Query Key Standard
 * Centralized query keys prevent cache bugs and naming inconsistencies
 * 
 * Pattern: ['resource', 'operation', ...params]
 * Bad: 'products', 'product-123', 'get-products'
 * Good: ['products', 'list', { page: 1 }], ['products', 'detail', '123']
 */

// Auth Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  decode: () => [...authKeys.all, 'decode'] as const,
};

// Product Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: { query?: string; page?: number; limit?: number }) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Add more resource keys as needed (orders, inventory, etc.)
