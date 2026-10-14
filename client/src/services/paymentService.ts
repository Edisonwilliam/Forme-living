/**
 * FORME Living — Payment Service
 * Connects frontend checkout to backend Paystack transaction endpoints.
 */

import { apiClient } from '../lib/apiClient';
import type { Order } from '../types';

export interface CheckoutPayload {
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
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    phoneNumber: string;
  };
  couponCode?: string;
}

export interface CheckoutInitResponse {
  orderId: string;
  orderNumber: string;
  reference: string;
  authorizationUrl: string;
  total: number;
  currency: string;
}

export const paymentService = {
  /**
   * Initializes a checkout order on the backend and obtains
   * the official Paystack hosted payment page authorization URL.
   */
  async initializeCheckout(payload: CheckoutPayload): Promise<CheckoutInitResponse> {
    const res = await apiClient.post<{ success: boolean; data: CheckoutInitResponse }>(
      '/payments/initialize',
      payload
    );
    return res.data.data;
  },

  /**
   * Verifies the transaction reference against the backend, which
   * queries Paystack's official verification API before confirming the order.
   */
  async verifyPayment(reference: string): Promise<Order> {
    const res = await apiClient.get<{ success: boolean; data: Order }>(
      `/payments/verify/${encodeURIComponent(reference)}`
    );
    return res.data.data;
  },
};
