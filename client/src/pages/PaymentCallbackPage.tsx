/**
 * FORME Living — Paystack Payment Callback & Verification Page
 * Handles return from Paystack hosted payment page, invokes backend
 * verification, and presents the confirmed architectural order dossier.
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowLeft, 
  ShoppingBag, 
  Printer, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import type { Order } from '../types';

export const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  // Paystack appends `?trxref=...&reference=...` to the callback URL
  const reference =
    searchParams.get('reference') ||
    searchParams.get('trxref') ||
    sessionStorage.getItem('forme_pending_payment_ref');

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setErrorMessage(
        'No transaction reference was provided by the payment gateway callback. If you completed payment, please contact atelier concierge.'
      );
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        // Backend queries Paystack directly — never trusts browser parameters
        const confirmedOrder = await paymentService.verifyPayment(reference!);

        if (!isMounted) return;

        setOrder(confirmedOrder);
        setStatus('success');

        // Only clear the cart once verified
        clearCart();
        sessionStorage.removeItem('forme_pending_payment_ref');
        sessionStorage.removeItem('forme_pending_order_id');
      } catch (err: any) {
        if (!isMounted) return;

        setStatus('failed');
        setErrorMessage(
          err?.response?.data?.message ||
            err?.message ||
            'Payment verification failed. Your transaction may have been cancelled or declined.'
        );
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [reference, clearCart]);

  /* ──────────────────────────────────────────────────────────────────────────
     1. VERIFYING STATE
     ────────────────────────────────────────────────────────────────────────── */
  if (status === 'verifying') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-5 bg-forme-ivory">
        <div className="w-16 h-16 rounded-full bg-forme-cream flex items-center justify-center text-forme-terracotta relative">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <div className="space-y-2 max-w-md">
          <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-semibold">
            Paystack Payment Gateway
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">
            Verifying Transaction
          </h1>
          <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans">
            Confirming authorization with Paystack servers and generating your commissioned order dossier. Please do not close this window.
          </p>
        </div>
        {reference && (
          <div className="text-[11px] font-mono text-forme-taupe bg-forme-cream/50 px-3 py-1 rounded-xs border border-forme-cream">
            Reference: {reference}
          </div>
        )}
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. FAILED / CANCELLED STATE
     ────────────────────────────────────────────────────────────────────────── */
  if (status === 'failed') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-6 bg-forme-ivory">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
          <XCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <span className="text-[10px] uppercase tracking-editorial text-rose-600 font-semibold">
            Payment Unsuccessful
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">
            Transaction Incomplete
          </h1>
          <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans">
            {errorMessage || 'The transaction was cancelled or declined by your card issuer.'}
          </p>
        </div>

        {reference && (
          <div className="text-[11px] font-mono text-forme-taupe bg-white px-3 py-1.5 rounded-xs border border-forme-cream">
            Gateway Reference: {reference}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/checkout"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors rounded-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Checkout</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-forme-cream bg-white text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream/50 transition-colors rounded-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Continue Browsing</span>
          </Link>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. VERIFIED SUCCESS DOSSIER
     ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-forme-ivory py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
        {/* Success Header */}
        <div className="bg-white p-8 sm:p-12 border border-forme-cream shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-forme-olive/10 text-forme-olive mx-auto flex items-center justify-center border border-forme-olive/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-editorial text-forme-olive font-semibold">
              Payment Confirmed & Verified
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">
              Order Commission Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans max-w-md mx-auto">
              Your architectural furniture pieces have entered production queue. A formal confirmation dossier and payment receipt have been dispatched to your email.
            </p>
          </div>

          {/* Dossier Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-forme-cream text-left">
            <div className="space-y-1 p-3 bg-forme-ivory/50 rounded-xs border border-forme-cream">
              <span className="text-[10px] uppercase tracking-editorial text-forme-taupe block">
                Order Number
              </span>
              <span className="font-mono text-xs font-semibold text-forme-charcoal block truncate">
                {order?.orderNumber || 'FL-ORDER'}
              </span>
            </div>

            <div className="space-y-1 p-3 bg-forme-ivory/50 rounded-xs border border-forme-cream">
              <span className="text-[10px] uppercase tracking-editorial text-forme-taupe block">
                Total Paid
              </span>
              <span className="font-mono text-xs font-semibold text-forme-charcoal block">
                {order ? formatPrice(order.total) : '₦0'}
              </span>
            </div>

            <div className="space-y-1 p-3 bg-forme-ivory/50 rounded-xs border border-forme-cream">
              <span className="text-[10px] uppercase tracking-editorial text-forme-taupe block">
                Payment Status
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Paid via Paystack</span>
              </span>
            </div>

            <div className="space-y-1 p-3 bg-forme-ivory/50 rounded-xs border border-forme-cream">
              <span className="text-[10px] uppercase tracking-editorial text-forme-taupe block">
                Fulfillment
              </span>
              <span className="text-xs font-semibold text-forme-charcoal capitalize">
                {order?.fulfillmentStatus || 'Processing'}
              </span>
            </div>
          </div>
        </div>

        {/* Commissioned Items List */}
        {order && order.items && order.items.length > 0 && (
          <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-4">
            <h2 className="font-serif text-lg text-forme-charcoal border-b border-forme-cream pb-3">
              Commissioned Atelier Pieces ({order.items.length})
            </h2>

            <div className="divide-y divide-forme-cream">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center space-x-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xs border border-forme-cream shrink-0 bg-forme-cream/20"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-forme-cream rounded-xs flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-forme-taupe" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm text-forme-charcoal font-medium truncate">
                      {item.name}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-forme-charcoal/60">{item.variantName}</p>
                    )}
                    <p className="text-xs font-mono text-forme-taupe mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <span className="font-mono text-xs font-semibold text-forme-charcoal">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Summary Breakdown */}
            <div className="pt-4 border-t border-forme-cream space-y-2 text-xs font-sans">
              <div className="flex justify-between text-forme-charcoal/70">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-forme-charcoal/70">
                <span>White-Glove Shipping</span>
                <span className="font-mono">
                  {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-forme-terracotta">
                  <span>Atelier Courtesy Discount</span>
                  <span className="font-mono">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-forme-charcoal pt-2 border-t border-forme-cream">
                <span>Total Settled</span>
                <span className="font-mono font-bold text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Destination Dossier */}
        {order?.shippingAddress && (
          <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-3">
            <h2 className="font-serif text-lg text-forme-charcoal border-b border-forme-cream pb-3">
              Delivery Destination & Recipient
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-editorial text-forme-taupe block mb-1">
                  Recipient
                </span>
                <p className="font-medium text-forme-charcoal">{order.shippingAddress.fullName}</p>
                <p className="text-forme-charcoal/70">{order.customer.email}</p>
                <p className="text-forme-charcoal/70">{order.shippingAddress.phoneNumber}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-editorial text-forme-taupe block mb-1">
                  Installation Address
                </span>
                <p className="text-forme-charcoal">
                  {order.shippingAddress.streetAddress}
                  {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
                </p>
                <p className="text-forme-charcoal/70">
                  {order.shippingAddress.city}, {order.shippingAddress.state},{' '}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Link
            to="/account"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial font-medium text-forme-charcoal hover:text-forme-terracotta transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View All Commissioned Orders</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 border border-forme-cream bg-white text-xs uppercase tracking-editorial font-medium text-forme-charcoal hover:bg-forme-cream/50 transition-colors rounded-sm inline-flex items-center space-x-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <Link
              to="/shop"
              className="px-6 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors rounded-sm inline-flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Gallery</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
