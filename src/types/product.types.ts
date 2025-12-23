// Product Types & Interfaces

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
  supplier_id: string;
  created_at?: string;
  updated_at?: string;
  // Additional properties used in ProductDetailPage
  image?: string;
  url1?: string;
  url2?: string;
  url3?: string;
  url4?: string;
  url5?: string;
  url6?: string;
  sku?: string;
  rating?: number;
  status?: number;
  shortdesc?: string;
  weight?: number;
  restricted?: string;
  period?: string;
}


export interface ProductSearchParams {
  query?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'price' | 'stock' | 'created_at';
  order?: 'asc' | 'desc';
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}