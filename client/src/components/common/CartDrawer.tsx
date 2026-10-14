import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Free shipping threshold: ₦1,500,000 in kobo = 150000000
  const FREE_SHIPPING_THRESHOLD = 150000000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-forme-charcoal/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-forme-ivory shadow-2xl flex flex-col border-l border-forme-cream">
          {/* Header */}
          <div className="p-6 border-b border-forme-cream flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-forme-charcoal" />
              <h3 className="font-serif text-2xl text-forme-charcoal">Shopping Bag</h3>
              <span className="text-xs font-mono font-medium bg-forme-cream px-2 py-0.5 rounded-full text-forme-olive">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close Shopping Bag"
              className="text-forme-taupe hover:text-forme-charcoal p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Delivery Progress Banner */}
          <div className="bg-forme-cream/60 px-6 py-3.5 border-b border-forme-cream text-xs space-y-1.5">
            <div className="flex justify-between font-medium text-forme-charcoal">
              <span>
                {isFreeShipping 
                  ? '🎉 Qualified for Complimentary White-Glove Delivery' 
                  : `Add ${formatPrice(shippingRemaining)} for Complimentary Delivery`}
              </span>
              <span>{shippingPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-forme-cream rounded-full overflow-hidden">
              <div 
                className="h-full bg-forme-terracotta transition-all duration-500 ease-out"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-forme-cream flex items-center justify-center text-forme-taupe">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl text-forme-charcoal">Your bag is empty</h4>
                  <p className="text-xs text-forme-charcoal/70 max-w-xs font-sans">
                    Discover sculptural seating, solid timber joinery, and architectural lighting.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="divide-y divide-forme-cream">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variantId || 'default'}`} className="py-4 flex space-x-4">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-sm bg-forme-cream shrink-0 border border-forme-cream"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-base text-forme-charcoal font-medium leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="text-forme-taupe hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variantName && (
                          <p className="text-[11px] text-forme-olive font-medium">
                            Variant: {item.variantName}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-forme-charcoal">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 pt-2">
                        <div className="flex items-center border border-forme-cream bg-white rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-forme-cream text-forme-charcoal transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-medium text-forme-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-forme-cream text-forme-charcoal transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-forme-taupe">
                          Total: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-forme-cream bg-white space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-forme-charcoal">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-forme-taupe">
                  <span>White-Glove Delivery</span>
                  <span>{isFreeShipping ? 'Complimentary' : 'Calculated at checkout'}</span>
                </div>
                <div className="border-t border-forme-cream pt-2 flex justify-between text-base font-serif text-forme-charcoal font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2 text-center"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full py-2.5 border border-forme-cream text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream/50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-forme-taupe">
                <ShieldCheck className="w-3.5 h-3.5 text-forme-olive" />
                <span>Verified Paystack SSL 256-Bit Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
