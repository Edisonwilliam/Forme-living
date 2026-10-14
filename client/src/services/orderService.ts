/**
 * Order API service — typed wrappers around /api/orders
 */

import { apiClient } from '../lib/apiClient';
import type { Order, Address, CartItem } from '../types';

export interface CreateOrderPayload {
  customer: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  items: {
    productId: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
  }[];
  shippingAddress: Omit<Address, '_id' | 'isDefault'>;
  couponCode?: string;
}

export const orderService = {
  /**
   * Build order items array from the cart
   */
  cartToOrderItems(cart: CartItem[]) {
    return cart.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      variantName: item.variantName,
      quantity: item.quantity,
    }));
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const res = await apiClient.post<{ success: boolean; data: Order }>('/orders', payload);
    return res.data.data;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order> {
    const res = await apiClient.get<{ success: boolean; data: Order }>(`/orders/${orderNumber}`);
    return res.data.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await apiClient.get<{ success: boolean; data: Order[] }>('/orders/my');
    return res.data.data;
  },
};
