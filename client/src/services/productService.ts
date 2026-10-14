/**
 * Product API service — typed wrappers around /api/products
 */

import { apiClient } from '../lib/apiClient';
import type { Product } from '../types';

export interface ProductFilters {
  category?: string;
  collection?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productService = {
  async getAll(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    }
    const res = await apiClient.get<{ success: boolean; data: Product[]; meta: ProductsResponse['meta'] }>(
      `/products?${params.toString()}`
    );
    return { data: res.data.data, meta: res.data.meta };
  },

  async getBySlug(slug: string): Promise<Product> {
    const res = await apiClient.get<{ success: boolean; data: Product }>(`/products/${slug}`);
    return res.data.data;
  },

  async getFeatured(): Promise<Product[]> {
    const res = await productService.getAll({ isFeatured: true, limit: 8 });
    return res.data;
  },

  async getBestsellers(): Promise<Product[]> {
    const res = await productService.getAll({ isBestseller: true, limit: 8 });
    return res.data;
  },

  async getNewArrivals(): Promise<Product[]> {
    const res = await productService.getAll({ isNewArrival: true, limit: 8 });
    return res.data;
  },
};
