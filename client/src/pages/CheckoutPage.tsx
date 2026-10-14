import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Lock, 
  ShoppingBag, 
  Printer, 
  ChevronRight, 
  Tag 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { formatPrice } from '../lib/utils';
import type { Order } from '../types';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number; // in kobo
  estimatedDays: string;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'white_glove',
    name: 'White-Glove Lagos Delivery & Room-of-Choice Installation',
    description: 'Specialist furniture handling, precision unboxing, debris removal & room positioning.',
    price: 3500000, // ₦35,000
    estimatedDays: '3–5 Business Days',
  },
  {
    id: 'express_white_glove',
    name: 'Priority Atelier Express Delivery',
    description: 'Expedited dedicated vehicle delivery with priority installation scheduling.',
    price: 6500000, // ₦65,000
    estimatedDays: '1–2 Business Days',
  },
  {
    id: 'nationwide_freight',
    name: 'Nationwide Specialized Freight (Abuja, PH, Regional)',
    description: 'Custom wooden crated logistics with regional delivery partner handling.',
    price: 9500000, // ₦95,000
    estimatedDays: '5–8 Business Days',
  },
];

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Multi-step state: 1 = Shipping, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    phoneNumber: '+234 ',
    streetAddress: '',
    apartment: '',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '101233',
    country: 'Nigeria',
    deliveryNotes: '',
  });

  // Shipping Selection
  const [selectedShippingId, setSelectedShippingId] = useState<string>(SHIPPING_METHODS[0].id);

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank_transfer'>('paystack');

  // Completed Order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Free shipping threshold: ₦1,500,000
  const isFreeShippingEligible = subtotal >= 150000000;
  const activeShippingMethod = SHIPPING_METHODS.find((m) => m.id === selectedShippingId) || SHIPPING_METHODS[0];
  const shippingFee = isFreeShippingEligible && selectedShippingId === 'white_glove' ? 0 : activeShippingMethod.price;

  // Discount calculation
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Pre-fill user data if auth status changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email,
        firstName: prev.firstName || user.name.split(' ')[0],
        lastName: prev.lastName || user.name.split(' ').slice(1).join(' '),
      }));
    }
  }, [user]);

  // If cart is empty and not on confirmation step, allow redirect or prompt
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-4 bg-forme-ivory">
        <div className="w-16 h-16 rounded-full bg-forme-cream flex items-center justify-center text-forme-taupe">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-forme-charcoal">Your bag is currently empty</h2>
        <p className="text-sm text-forme-charcoal/70 max-w-md font-sans">
          Select timeless architectural furniture from our catalog before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-8 py-3 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Furniture Collection</span>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCodeInput.trim().toUpperCase();

    if (!code) return;

    if (code === 'WELCOME10' || code === 'FORME10') {
      setAppliedPromo({ code, discountPercent: 10 });
    } else if (code === 'ARCHITECT15') {
      setAppliedPromo({ code, discountPercent: 15 });
    } else {
      setPromoError('Invalid promotion code. Try "WELCOME10" for 10% atelier discount.');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.streetAddress) {
      setErrorMessage('Please fill in all required delivery fields.');
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const checkoutPayload = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        },
        items: cart.map((c) => ({
          productId: c.productId,
          variantId: c.variantId,
          variantName: c.variantName,
          quantity: c.quantity,
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          streetAddress: formData.streetAddress,
          apartment: formData.apartment || undefined,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode || undefined,
          phoneNumber: formData.phoneNumber,
        },
        couponCode: appliedPromo?.code,
      };

      if (paymentMethod === 'paystack') {
        // 1. Initialize transaction via official Paystack endpoint on backend
        const initData = await paymentService.initializeCheckout(checkoutPayload);

        // 2. Persist reference in sessionStorage for redundancy/recovery
        sessionStorage.setItem('forme_pending_payment_ref', initData.reference);
        sessionStorage.setItem('forme_pending_order_id', initData.orderId);

        // 3. Redirect customer directly to Paystack's hosted payment page
        window.location.href = initData.authorizationUrl;
        return;
      }

      // Bank Transfer fallback option
      const placedOrder = await orderService.create({
        customer: checkoutPayload.customer,
        items: orderService.cartToOrderItems(cart),
        shippingAddress: checkoutPayload.shippingAddress,
        couponCode: checkoutPayload.couponCode,
      });

      setCompletedOrder(placedOrder);
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          'Payment initiation failed. Please verify your connection and try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-forme-ivory">
      {/* Distraction-Free Header */}
      <header className="bg-white border-b border-forme-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="group flex flex-col items-start">
            <span className="font-serif text-2xl tracking-widest text-forme-charcoal group-hover:text-forme-terracotta transition-colors">
              FORME
            </span>
            <span className="text-[9px] uppercase tracking-editorial text-forme-taupe -mt-1 font-sans">
              LIVING ATELIER
            </span>
          </Link>

          {/* Stepper Indicator */}
          <div className="hidden sm:flex items-center space-x-6 text-xs uppercase tracking-editorial font-medium">
            <span className={step >= 1 ? 'text-forme-charcoal font-semibold' : 'text-forme-taupe'}>
              1. Delivery
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-forme-cream" />
            <span className={step >= 2 ? 'text-forme-charcoal font-semibold' : 'text-forme-taupe'}>
              2. Payment
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-forme-cream" />
            <span className={step === 3 ? 'text-forme-olive font-semibold' : 'text-forme-taupe'}>
              3. Confirmation
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-forme-taupe">
            <Lock className="w-3.5 h-3.5 text-forme-olive" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {step === 3 && completedOrder ? (
          /* ── STEP 3: ORDER CONFIRMATION & RECEIPT SCREEN ─────────────────── */
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border border-forme-cream shadow-sm space-y-8 animate-fade-in">
            <div className="text-center space-y-3 pb-6 border-b border-forme-cream">
              <div className="w-16 h-16 rounded-full bg-forme-olive/10 text-forme-olive mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-[11px] uppercase tracking-editorial text-forme-olive font-semibold">
                Payment Authorized & Verified
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">
                Thank You for Your Commission
              </h1>
              <p className="text-sm text-forme-charcoal/70 max-w-lg mx-auto font-sans">
                Your order is confirmed. Our Lagos master craftsmen and white-glove team are preparing your bespoke architectural furniture pieces.
              </p>
              <div className="inline-block bg-forme-cream/50 px-4 py-2 rounded-sm border border-forme-cream font-mono text-xs text-forme-charcoal font-semibold">
                Order Reference: {completedOrder.orderNumber}
              </div>
            </div>

            {/* Estimated Delivery Status Bar */}
            <div className="bg-forme-ivory p-6 rounded-sm border border-forme-cream space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif text-base text-forme-charcoal font-medium">Estimated Arrival</span>
                <span className="font-semibold text-forme-olive">{activeShippingMethod.estimatedDays}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-forme-taupe font-sans">
                <div className="bg-white p-2.5 rounded-sm border border-forme-cream font-medium text-forme-olive">
                  ✓ Order Placed
                </div>
                <div className="bg-white p-2.5 rounded-sm border border-forme-cream font-medium text-forme-charcoal">
                  Atelier QC & Crating
                </div>
                <div className="bg-white p-2.5 rounded-sm border border-forme-cream">
                  White-Glove Installation
                </div>
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-forme-charcoal border-b border-forme-cream pb-2">
                Purchased Pieces ({completedOrder.items.length})
              </h3>
              <div className="divide-y divide-forme-cream">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-sm border border-forme-cream"
                        />
                      )}
                      <div>
                        <p className="font-medium text-forme-charcoal">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-forme-taupe">Finish: {item.variantName}</p>
                        )}
                        <p className="text-xs text-forme-taupe">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-forme-charcoal">
                      {formatPrice(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-forme-cream/30 p-6 rounded-sm space-y-2 text-sm text-forme-charcoal">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(completedOrder.subtotal)}</span>
              </div>
              {completedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-forme-olive">
                  <span>Atelier Courtesy Discount</span>
                  <span>-{formatPrice(completedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Delivery</span>
                <span>{completedOrder.shippingFee === 0 ? 'Complimentary' : formatPrice(completedOrder.shippingFee)}</span>
              </div>
              <div className="border-t border-forme-cream pt-3 flex justify-between font-serif text-lg font-semibold text-forme-charcoal">
                <span>Total Paid</span>
                <span>{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-forme-charcoal bg-white p-4 border border-forme-cream">
              <div>
                <span className="text-forme-taupe block mb-1 uppercase tracking-editorial font-medium">
                  Delivery Destination
                </span>
                <p className="font-semibold">{completedOrder.shippingAddress.fullName}</p>
                <p>{completedOrder.shippingAddress.streetAddress}</p>
                {completedOrder.shippingAddress.apartment && <p>{completedOrder.shippingAddress.apartment}</p>}
                <p>
                  {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
                </p>
                <p className="text-forme-taupe mt-1">{completedOrder.shippingAddress.phoneNumber}</p>
              </div>
              <div>
                <span className="text-forme-taupe block mb-1 uppercase tracking-editorial font-medium">
                  Recipient Confirmation
                </span>
                <p className="font-semibold">{completedOrder.customer.email}</p>
                <p className="text-forme-taupe mt-2">
                  A comprehensive delivery dossier and VAT invoice have been dispatched to your email address.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 border border-forme-charcoal text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
              <Link
                to="/shop"
                className="flex-1 py-3 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <span>Continue Architectural Journey</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ── STEP 1 & 2: CHECKOUT FORMS WITH SUMMARY SIDEBAR ─────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Columns: Checkout Details Form */}
            <div className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-sm">
                  {errorMessage}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleProceedToPayment} className="space-y-8">
                  {/* Contact Information */}
                  <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-5">
                    <div className="flex justify-between items-center border-b border-forme-cream pb-3">
                      <h2 className="font-serif text-xl text-forme-charcoal">1. Client Contact</h2>
                      {!isAuthenticated && (
                        <Link
                          to="/account"
                          className="text-xs text-forme-terracotta hover:underline font-sans"
                        >
                          Have an account? Sign in
                        </Link>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                        Email Address for Delivery Dossier *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="client@archstudio.com"
                        className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal focus:ring-1 focus:ring-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                      />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-5">
                    <h2 className="font-serif text-xl text-forme-charcoal border-b border-forme-cream pb-3">
                      2. Delivery Address & Residence
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                        Phone Number (for Courier & White-Glove Coordination) *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+234 801 234 5678"
                        className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        required
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="14 Alexander Avenue, Ikoyi"
                        className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                          Apartment / Suite / Penthouse (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Penthouse B"
                          className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                          City / District *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Ikoyi / Victoria Island"
                          className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-white"
                        >
                          <option value="Lagos">Lagos State</option>
                          <option value="Abuja FCT">Federal Capital Territory (Abuja)</option>
                          <option value="Rivers">Rivers State (Port Harcourt)</option>
                          <option value="Ogun">Ogun State</option>
                          <option value="Oyo">Oyo State (Ibadan)</option>
                          <option value="Edo">Edo State</option>
                          <option value="Delta">Delta State</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-editorial text-forme-charcoal mb-1.5">
                          Postal Code / Landmark
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="101233"
                          className="w-full px-3.5 py-2.5 border border-forme-cream focus:border-forme-charcoal outline-none text-sm bg-forme-ivory/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method Options */}
                  <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-4">
                    <h2 className="font-serif text-xl text-forme-charcoal border-b border-forme-cream pb-3">
                      3. Installation & Logistics Tier
                    </h2>

                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((method) => {
                        const isMethodFree = isFreeShippingEligible && method.id === 'white_glove';
                        const isSelected = selectedShippingId === method.id;

                        return (
                          <label
                            key={method.id}
                            className={`flex items-start p-4 border rounded-sm cursor-pointer transition-all ${
                              isSelected
                                ? 'border-forme-charcoal bg-forme-cream/20 shadow-sm'
                                : 'border-forme-cream hover:border-forme-taupe'
                            }`}
                          >
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={method.id}
                              checked={isSelected}
                              onChange={() => setSelectedShippingId(method.id)}
                              className="mt-1 text-forme-charcoal focus:ring-forme-charcoal"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-serif text-base text-forme-charcoal font-medium">
                                  {method.name}
                                </span>
                                <span className="text-sm font-semibold text-forme-charcoal ml-2">
                                  {isMethodFree ? (
                                    <span className="text-forme-olive">Complimentary</span>
                                  ) : (
                                    formatPrice(method.price)
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-forme-charcoal/70 mt-1 font-sans">
                                {method.description}
                              </p>
                              <span className="inline-block mt-2 text-[11px] font-mono text-forme-olive font-medium">
                                Estimated: {method.estimatedDays}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  {/* Summary of shipping entered */}
                  <div className="bg-white p-6 border border-forme-cream text-xs space-y-2">
                    <div className="flex justify-between items-center border-b border-forme-cream pb-2">
                      <span className="text-forme-taupe uppercase tracking-editorial font-medium">
                        Delivery Destination
                      </span>
                      <button
                        onClick={() => setStep(1)}
                        className="text-forme-terracotta hover:underline font-medium"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-forme-charcoal font-semibold">
                      {formData.firstName} {formData.lastName} ({formData.phoneNumber})
                    </p>
                    <p className="text-forme-charcoal/80">
                      {formData.streetAddress}, {formData.city}, {formData.state}
                    </p>
                    <p className="text-forme-olive font-medium pt-1">
                      Tier: {activeShippingMethod.name} ({activeShippingMethod.estimatedDays})
                    </p>
                  </div>

                  {/* Payment Gateway Box */}
                  <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-forme-cream pb-3">
                      <h2 className="font-serif text-xl text-forme-charcoal">Secure Atelier Payment</h2>
                      <div className="flex items-center space-x-1.5 text-xs text-forme-olive font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Paystack Direct Gateway</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`flex items-start p-4 border rounded-sm cursor-pointer transition-all ${
                          paymentMethod === 'paystack'
                            ? 'border-forme-charcoal bg-forme-cream/20 shadow-sm'
                            : 'border-forme-cream hover:border-forme-taupe'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentOption"
                          value="paystack"
                          checked={paymentMethod === 'paystack'}
                          onChange={() => setPaymentMethod('paystack')}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-base text-forme-charcoal font-medium">
                              Paystack Instant Checkout (Cards, USSD, Apple Pay)
                            </span>
                            <CreditCard className="w-5 h-5 text-forme-charcoal" />
                          </div>
                          <p className="text-xs text-forme-charcoal/70 mt-1">
                            Pay with Mastercard, Visa, Verve, USSD or Bank Transfer. Fully tokenized and secure.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-start p-4 border rounded-sm cursor-pointer transition-all ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-forme-charcoal bg-forme-cream/20 shadow-sm'
                            : 'border-forme-cream hover:border-forme-taupe'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentOption"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-base text-forme-charcoal font-medium">
                              Architectural Account Wire / Private Client Transfer
                            </span>
                            <Building2 className="w-5 h-5 text-forme-charcoal" />
                          </div>
                          <p className="text-xs text-forme-charcoal/70 mt-1">
                            Instant automated virtual invoice account with real-time payment reconciliation.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Paystack Gateway Security Notice */}
                    <div className="p-4 bg-forme-ivory rounded-sm border border-forme-cream text-xs space-y-1">
                      <p className="font-semibold text-forme-charcoal flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-forme-terracotta" />
                        <span>Secured by Paystack Payment Gateway</span>
                      </p>
                      <p className="text-forme-charcoal/70">
                        {paymentMethod === 'paystack'
                          ? 'You will be securely redirected to Paystack to complete your card, USSD, or bank transfer payment. Once completed, you will be returned here for automatic verification.'
                          : 'Your order will be logged as pending transfer with bank account details provided upon placement.'}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-3 px-6 border border-forme-cream text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream/50 transition-colors"
                      >
                        Back to Delivery
                      </button>

                      <button
                        type="button"
                        onClick={handleCompleteOrder}
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>
                            {paymentMethod === 'paystack'
                              ? 'Connecting to Paystack Secure Checkout...'
                              : 'Authorizing Transaction...'}
                          </span>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>
                              {paymentMethod === 'paystack'
                                ? `Proceed to Paystack — ${formatPrice(grandTotal)}`
                                : `Confirm Order — ${formatPrice(grandTotal)}`}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Sticky Order Summary & Promo */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm sticky top-24 space-y-6">
                <div className="flex items-center justify-between border-b border-forme-cream pb-3">
                  <h3 className="font-serif text-xl text-forme-charcoal">Commission Summary</h3>
                  <span className="text-xs font-mono font-medium bg-forme-cream px-2 py-0.5 rounded-full text-forme-olive">
                    {totalItems} Pieces
                  </span>
                </div>

                {/* Items Mini List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-forme-cream pr-1 space-y-1">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || 'default'}`}
                      className="py-3 flex items-center space-x-3.5"
                    >
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-sm border border-forme-cream shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm text-forme-charcoal truncate font-medium">
                          {item.product.name}
                        </h4>
                        {item.variantName && (
                          <p className="text-[11px] text-forme-olive truncate">
                            Variant: {item.variantName}
                          </p>
                        )}
                        <p className="text-xs text-forme-taupe">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-forme-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-forme-cream">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WELCOME10)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-forme-cream text-xs uppercase tracking-wider outline-none focus:border-forme-charcoal"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-forme-cream hover:bg-forme-charcoal hover:text-white transition-colors text-xs uppercase tracking-editorial font-medium text-forme-charcoal"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="text-xs text-forme-olive flex items-center space-x-1 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Applied '{appliedPromo.code}' ({appliedPromo.discountPercent}% Discount)</span>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-xs text-rose-600">{promoError}</p>
                  )}
                </form>

                {/* Pricing Breakdown */}
                <div className="border-t border-forme-cream pt-4 space-y-2 text-sm text-forme-charcoal">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-forme-olive">
                      <span>Atelier Promo ({appliedPromo.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-forme-taupe">
                    <span>Logistics Tier</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-forme-olive font-semibold">Complimentary</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-forme-cream pt-3 flex justify-between font-serif text-lg font-semibold text-forme-charcoal">
                    <span>Grand Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Value assurance badge */}
                <div className="p-3 bg-forme-cream/40 rounded-sm text-[11px] text-forme-taupe space-y-1">
                  <div className="flex items-center space-x-1.5 font-medium text-forme-charcoal">
                    <Truck className="w-3.5 h-3.5 text-forme-terracotta" />
                    <span>White-Glove Assembly Included</span>
                  </div>
                  <p>
                    All items unboxed, positioned in your designated chamber, and fully inspected by our Lagos atelier artisans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
