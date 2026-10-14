import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice, formatDimensions } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants[0]?.id
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const activePrice = currentVariant?.price || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariantId);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-forme-charcoal/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div 
        className="relative bg-forme-ivory w-full max-w-4xl rounded-sm shadow-forme-modal border border-forme-cream overflow-hidden z-10 my-8 flex flex-col md:flex-row max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-forme-charcoal/60 hover:text-forme-charcoal bg-white/80 p-2 rounded-full backdrop-blur-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="w-full md:w-1/2 bg-forme-cream/40 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-forme-cream">
          <div className="aspect-[4/3] md:aspect-square w-full rounded-sm overflow-hidden bg-white border border-forme-cream">
            <img
              src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
              alt={product.images[selectedImageIndex]?.alt || product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.url}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-forme-charcoal' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold">
                {product.categoryLabel || product.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-forme-charcoal leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="font-sans text-xl sm:text-2xl font-bold text-forme-charcoal">
                {formatPrice(activePrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm line-through text-forme-taupe">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-forme-charcoal/80 leading-relaxed font-sans">
              {product.shortDescription || product.description}
            </p>

            {/* Material & Dimension Specs */}
            <div className="bg-forme-cream/50 p-3.5 rounded-sm border border-forme-cream text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-forme-taupe">Material:</span>
                <span className="font-medium text-forme-charcoal">{product.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forme-taupe">Dimensions:</span>
                <span className="font-medium text-forme-charcoal">{formatDimensions(product.dimensions)}</span>
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-editorial text-forme-taupe font-semibold block">
                  Select Finish / Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3 py-1.5 text-xs rounded-sm border transition-all flex items-center space-x-2 ${
                        selectedVariantId === v.id
                          ? 'border-forme-charcoal bg-forme-charcoal text-white'
                          : 'border-forme-cream bg-white text-forme-charcoal hover:border-forme-taupe'
                      }`}
                    >
                      {v.colorHex && (
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-3 pt-2">
              <span className="text-xs uppercase tracking-editorial text-forme-taupe font-semibold">Qty</span>
              <div className="flex items-center border border-forme-cream bg-white rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm hover:bg-forme-cream transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-1 text-sm hover:bg-forme-cream transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-forme-cream">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddedFeedback}
                className={`flex-1 py-3 text-xs uppercase tracking-editorial font-medium transition-all flex items-center justify-center space-x-2 ${
                  isAddedFeedback
                    ? 'bg-emerald-700 text-white'
                    : 'bg-forme-charcoal text-white hover:bg-forme-olive'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                aria-label="Wishlist"
                className={`px-3.5 py-3 border rounded-sm transition-colors ${
                  isInWishlist(product._id)
                    ? 'border-forme-terracotta text-forme-terracotta bg-forme-terracotta/10'
                    : 'border-forme-cream text-forme-charcoal hover:border-forme-taupe bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="text-xs text-forme-olive hover:text-forme-charcoal flex items-center justify-center space-x-1.5 py-1 transition-colors underline"
            >
              <span>View Full Architectural Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
