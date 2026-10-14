/**
 * FORME Living — Paystack Payment Gateway Service
 * Integrates with Paystack's official REST API for transaction
 * initialization, real-time verification, and webhook signature validation.
 */

import crypto from 'crypto';
import { env } from '../config/environment';
import { AppError } from '../utils/AppError';

export interface InitializePaystackParams {
  email: string;
  amount: number; // in kobo (NGN 1 = 100 kobo)
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  status: 'success' | 'failed' | 'abandoned' | 'pending';
  reference: string;
  amount: number; // in kobo
  currency: string;
  paidAt?: string;
  channel?: string;
  customer?: {
    email: string;
  };
  metadata?: Record<string, unknown>;
}

export const paystackService = {
  /**
   * Initializes a Paystack transaction and returns the hosted authorization URL.
   */
  async initializeTransaction(params: InitializePaystackParams): Promise<PaystackInitResponse> {
    const secretKey = env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || secretKey === 'sk_test_placeholder') {
      throw new AppError(
        'Paystack payment gateway is not properly configured. Missing PAYSTACK_SECRET_KEY.',
        500
      );
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          amount: params.amount,
          currency: 'NGN',
          reference: params.reference,
          callback_url: params.callbackUrl,
          metadata: params.metadata,
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok || !data.status) {
        throw new AppError(
          `Paystack initialization failed: ${data.message || 'Unknown error from payment gateway'}`,
          400
        );
      }

      return {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(`Paystack network error: ${err.message}`, 502);
    }
  },

  /**
   * Verifies transaction directly with Paystack's official verification API.
   * Never trusts status sent from client.
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    const secretKey = env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new AppError('Paystack secret key is missing.', 500);
    }

    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = (await response.json()) as any;

      if (!response.ok || !data.status) {
        throw new AppError(
          `Paystack verification failed: ${data.message || 'Unable to verify reference'}`,
          400
        );
      }

      return {
        status: data.data.status,
        reference: data.data.reference,
        amount: data.data.amount,
        currency: data.data.currency,
        paidAt: data.data.paid_at,
        channel: data.data.channel,
        customer: data.data.customer,
        metadata: data.data.metadata,
      };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(`Paystack verification network error: ${err.message}`, 502);
    }
  },

  /**
   * Validates Paystack Webhook HMAC SHA512 signature.
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    const secretKey = env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || !signature) return false;

    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(rawBody)
      .digest('hex');

    return hash === signature;
  },
};
