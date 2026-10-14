import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Share2, 
  ArrowRight, 
  Sparkles,
  Check
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import type { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter items in the wishlist
  const wishlistProducts = MOCK_PRODUCTS.filter((product) => wishlist.includes(product._id));

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="min-h-screen bg-forme-ivory py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-forme-cream pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-editorial text-forme-terracotta font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Client Portfolio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-forme-charcoal">
              Curated Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-forme-charcoal/70 max-w-xl font-sans">
              Archived signatures, bespoke materials, and architectural living elements saved for your residential and commercial commissions.
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShareWishlist}
                className="px-4 py-2.5 border border-forme-cream bg-white text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream/50 transition-colors flex items-center space-x-2"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-forme-olive" />
                    <span className="text-forme-olive">Portfolio Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-forme-taupe" />
                    <span>Share Wishlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleMoveAllToBag}
                className="px-5 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center space-x-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-forme-cream flex items-center justify-center text-forme-taupe mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-forme-charcoal">
                Your portfolio is currently empty
              </h3>
              <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans">
                Save iconic bouclé seating, travertine tables, and solid walnut bedroom pieces as you explore our collection.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs text-forme-taupe font-mono">
              <span>{wishlistProducts.length} Saved Architectural Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlistProducts.map((product) => (
                <div key={product._id} className="relative group">
                  <ProductCard
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 text-forme-charcoal shadow-sm flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors z-20"
                    title="Remove from saved portfolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  );
};
