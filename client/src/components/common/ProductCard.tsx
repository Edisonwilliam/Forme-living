import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const primaryImage = product.images[0]?.url;
  const secondaryImage = product.images[1]?.url || primaryImage;

  return (
    <div 
      className="group flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Framing */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-forme-cream/50 border border-forme-cream/60">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-forme-charcoal text-forme-ivory text-[10px] tracking-editorial uppercase px-2 py-0.5 rounded-sm font-medium">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-forme-olive text-forme-ivory text-[10px] tracking-editorial uppercase px-2 py-0.5 rounded-sm font-medium">
              Bestseller
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="bg-forme-terracotta text-white text-[10px] tracking-editorial uppercase px-2 py-0.5 rounded-sm font-medium">
              Curated Offer
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-forme-terracotta text-white shadow-sm'
              : 'bg-white/80 backdrop-blur-md text-forme-charcoal hover:bg-white hover:text-forme-terracotta'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Quick Add Drawer overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2 z-10">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="flex-1 py-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-forme-charcoal text-[11px] uppercase tracking-editorial font-medium shadow-sm transition-colors flex items-center justify-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className="p-2.5 bg-forme-charcoal hover:bg-forme-olive text-white shadow-sm transition-colors"
            title="Quick Add to Bag"
            aria-label="Quick Add to Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-4 flex flex-col space-y-1.5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-editorial text-forme-taupe font-medium">
          <span>{product.categoryLabel || product.category}</span>
          {product.rating > 0 && (
            <span className="text-forme-charcoal flex items-center space-x-1">
              <span>★</span>
              <span>{product.rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        <Link to={`/product/${product.slug}`} className="group-hover:text-forme-terracotta transition-colors">
          <h3 className="font-serif text-lg text-forme-charcoal leading-snug font-medium line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-forme-charcoal/70 line-clamp-1 font-sans">
          {product.material}
        </p>

        {/* Price & Variant swatches */}
        <div className="pt-1 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-sans text-sm font-semibold text-forme-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs line-through text-forme-taupe font-sans">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Color Indicators */}
          {product.variants.length > 1 && (
            <div className="flex items-center -space-x-1">
              {product.variants.slice(0, 3).map((v) => (
                <span
                  key={v.id}
                  className="w-3 h-3 rounded-full border border-white shadow-xs inline-block"
                  style={{ backgroundColor: v.colorHex || '#B6AA9A' }}
                  title={v.name}
                />
              ))}
              {product.variants.length > 3 && (
                <span className="text-[10px] text-forme-taupe pl-1.5 font-mono">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
