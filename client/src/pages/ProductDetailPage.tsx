import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Star, 
  CheckCircle2 
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { formatPrice, formatDimensions } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { productService } from '../services/productService';
import type { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Find initial fallback product
  const initialProduct = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  const [product, setProduct] = useState<Product>(initialProduct);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'materials' | 'delivery' | 'care'>('specs');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [quickViewPairing, setQuickViewPairing] = useState<Product | null>(null);

  // Scroll to top and fetch product on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageIndex(0);

    const fallback = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
    setProduct(fallback);
    setSelectedVariantId(fallback.variants[0]?.id);

    if (slug) {
      productService
        .getBySlug(slug)
        .then((fetched) => {
          if (fetched) {
            setProduct(fetched);
            setSelectedVariantId(fetched.variants[0]?.id);
          }
        })
        .catch(() => {
          // Keep fallback gracefully
        });
    }
  }, [slug]);

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const activePrice = currentVariant?.price || product.price;
  const isFavorited = isInWishlist(product._id);

  // Related products
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p._id !== product._id && (p.category === product.category || p.collections.some((c) => product.collections.includes(c)))
  ).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariantId);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1200);
  };

  return (
    <div className="bg-forme-ivory min-h-screen">
      {/* Breadcrumb Bar */}
      <div className="border-b border-forme-cream bg-forme-cream/30 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs uppercase tracking-editorial text-forme-taupe font-medium">
          <Link to="/" className="hover:text-forme-charcoal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-forme-charcoal transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-forme-charcoal transition-colors">
            {product.categoryLabel || product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-forme-charcoal truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Gallery (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary High-Resolution Image Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-sm overflow-hidden bg-white border border-forme-cream shadow-forme-subtle">
              <img
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                alt={product.images[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
              />

              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-forme-olive text-white text-[10px] uppercase tracking-editorial px-2.5 py-1 rounded-xs font-medium">
                  Bestseller Signature
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      selectedImageIndex === idx
                        ? 'border-forme-charcoal ring-1 ring-forme-charcoal'
                        : 'border-forme-cream opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Purchase Details (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category, Rating, Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-editorial text-forme-terracotta font-semibold">
                  <span>{product.categoryLabel || product.category}</span>
                  <div className="flex items-center space-x-1.5 text-forme-charcoal font-medium">
                    <Star className="w-3.5 h-3.5 fill-forme-terracotta text-forme-terracotta" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-forme-taupe">({product.reviewCount} Reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl text-forme-charcoal leading-tight font-medium">
                  {product.name}
                </h1>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline space-x-4 border-b border-forme-cream pb-6">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-forme-charcoal">
                  {formatPrice(activePrice)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > activePrice && (
                  <span className="text-sm sm:text-base line-through text-forme-taupe font-sans">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs text-forme-olive font-medium bg-forme-cream px-2 py-0.5 rounded-xs">
                  Tax Inclusive
                </span>
              </div>

              {/* Editorial Description */}
              <p className="text-xs sm:text-sm text-forme-charcoal/80 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="uppercase tracking-editorial text-forme-taupe font-semibold">
                      Finish / Variant
                    </span>
                    <span className="text-forme-charcoal font-medium">
                      {currentVariant?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3.5 py-2 text-xs rounded-sm border transition-all flex items-center space-x-2.5 ${
                          selectedVariantId === v.id
                            ? 'border-forme-charcoal bg-forme-charcoal text-white shadow-xs'
                            : 'border-forme-cream bg-white text-forme-charcoal hover:border-forme-taupe'
                        }`}
                      >
                        {v.colorHex && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <span>{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Availability */}
              <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 p-3 rounded-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>In Stock — Ready for White-Glove Dispatch in Lagos & Abuja</span>
              </div>

              {/* Quantity & Add to Cart Controls */}
              <div className="space-y-3 pt-4 border-t border-forme-cream">
                <div className="flex items-center space-x-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-forme-cream bg-white rounded-sm h-12 px-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 text-base text-forme-charcoal hover:text-forme-terracotta transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-2.5 text-base text-forme-charcoal hover:text-forme-terracotta transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddedFeedback}
                    className={`flex-1 h-12 text-xs uppercase tracking-editorial font-medium rounded-sm transition-all flex items-center justify-center space-x-2 shadow-forme-elevated ${
                      isAddedFeedback
                        ? 'bg-emerald-700 text-white'
                        : 'bg-forme-charcoal hover:bg-forme-olive text-white'
                    }`}
                  >
                    {isAddedFeedback ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Shopping Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Shopping Bag — {formatPrice(activePrice * quantity)}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Toggle Button */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    aria-label="Wishlist toggle"
                    className={`h-12 w-12 rounded-sm border flex items-center justify-center transition-colors ${
                      isFavorited
                        ? 'border-forme-terracotta text-forme-terracotta bg-forme-terracotta/10'
                        : 'border-forme-cream bg-white text-forme-charcoal hover:border-forme-taupe'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Snapshot */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-forme-cream text-xs text-forme-charcoal/80">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-forme-terracotta shrink-0" />
                <span>White-glove assembly</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-forme-terracotta shrink-0" />
                <span>10-year frame warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications & Architectural Accordion / Tabs */}
      <section className="border-t border-forme-cream bg-forme-cream/30 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Tab Buttons */}
          <div className="flex border-b border-forme-cream overflow-x-auto space-x-6 text-xs uppercase tracking-editorial font-medium">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'specs' ? 'text-forme-terracotta font-semibold' : 'text-forme-taupe hover:text-forme-charcoal'
              }`}
            >
              <span>Dimensions & Specifications</span>
              {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forme-terracotta" />}
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'materials' ? 'text-forme-terracotta font-semibold' : 'text-forme-taupe hover:text-forme-charcoal'
              }`}
            >
              <span>Materiality & Provenance</span>
              {activeTab === 'materials' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forme-terracotta" />}
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'delivery' ? 'text-forme-terracotta font-semibold' : 'text-forme-taupe hover:text-forme-charcoal'
              }`}
            >
              <span>White-Glove Delivery</span>
              {activeTab === 'delivery' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forme-terracotta" />}
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'care' ? 'text-forme-terracotta font-semibold' : 'text-forme-taupe hover:text-forme-charcoal'
              }`}
            >
              <span>Warranty & Care</span>
              {activeTab === 'care' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forme-terracotta" />}
            </button>
          </div>

          {/* Tab Content Areas */}
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-forme-cream">
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-forme-ivory rounded-sm flex justify-between border border-forme-cream">
                    <span className="text-forme-taupe">Dimensions</span>
                    <span className="font-semibold text-forme-charcoal">{formatDimensions(product.dimensions)}</span>
                  </div>
                  <div className="p-3 bg-forme-ivory rounded-sm flex justify-between border border-forme-cream">
                    <span className="text-forme-taupe">Primary Material</span>
                    <span className="font-semibold text-forme-charcoal">{product.material}</span>
                  </div>
                  <div className="p-3 bg-forme-ivory rounded-sm flex justify-between border border-forme-cream">
                    <span className="text-forme-taupe">SKU Identifier</span>
                    <span className="font-mono text-forme-charcoal">{product.sku}</span>
                  </div>
                  <div className="p-3 bg-forme-ivory rounded-sm flex justify-between border border-forme-cream">
                    <span className="text-forme-taupe">Frame Build</span>
                    <span className="font-semibold text-forme-charcoal">FSC Kiln-Dried European Hardwood</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase tracking-editorial text-forme-terracotta font-semibold block">
                    Architectural Details
                  </span>
                  <ul className="space-y-1.5 text-xs text-forme-charcoal/80">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-forme-terracotta">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4 text-xs sm:text-sm text-forme-charcoal/80 leading-relaxed font-sans">
                <h4 className="font-serif text-xl text-forme-charcoal font-medium">Sustainable Hardwoods & Natural Stone</h4>
                <p>
                  Every piece in the FORME Living collection is crafted from solid materials rather than engineered veneers. Our European white oak and American walnut are kiln-dried to equilibrium moisture content, ensuring dimensional stability across varied climate zones.
                </p>
                <p>
                  Natural stones such as our Italian Romano travertine retain their natural micro-pores and organic veining, celebrating geological history.
                </p>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 text-xs sm:text-sm text-forme-charcoal/80 leading-relaxed font-sans">
                <h4 className="font-serif text-xl text-forme-charcoal font-medium">In-Room White Glove Placement</h4>
                <p>
                  {product.deliveryEstimate}
                </p>
                <div className="bg-forme-ivory p-4 rounded-sm border border-forme-cream space-y-2">
                  <span className="text-xs font-semibold text-forme-charcoal block">Our Delivery Protocol:</span>
                  <ul className="space-y-1 text-xs text-forme-taupe">
                    <li>• Scheduled 2-hour delivery window with prior day call confirmation</li>
                    <li>• Protective floor runners laid before furniture is brought inside</li>
                    <li>• Full assembly by trained studio joiners</li>
                    <li>• Complete packaging removal and recycling</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 text-xs text-forme-charcoal/80">
                <h4 className="font-serif text-xl text-forme-charcoal font-medium">Warranty & Care Guidelines</h4>
                <p className="font-semibold text-forme-olive">{product.warrantyInfo}</p>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-editorial text-forme-taupe font-semibold block">
                    Recommended Maintenance:
                  </span>
                  <ul className="space-y-1.5">
                    {product.careInstructions.map((instruction, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-forme-olive">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-forme-cream pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold">
              Client Feedback
            </span>
            <h3 className="font-serif text-3xl text-forme-charcoal">
              Customer Reviews ({product.reviewCount})
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex text-forme-terracotta">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i} className="text-lg">{star}</span>
              ))}
            </div>
            <span className="text-sm font-semibold text-forme-charcoal">{product.rating.toFixed(1)} out of 5.0</span>
          </div>
        </div>

        {/* Sample Verified Reviews */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-sm border border-forme-cream space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif text-base font-medium text-forme-charcoal block">
                  "Exceeded every expectation in craftsmanship and proportion."
                </span>
                <span className="text-xs text-forme-taupe">Dr. Amina B. — Lagos, Nigeria</span>
              </div>
              <span className="text-[10px] uppercase tracking-editorial bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-xs font-semibold">
                Verified Owner
              </span>
            </div>
            <p className="text-xs text-forme-charcoal/80 leading-relaxed font-sans">
              The tactile finish of the joinery is remarkable. The white-glove team arrived precisely on schedule in Ikoyi, assembled the piece without a whisper of dust, and placed it with care.
            </p>
          </div>

          <div className="p-6 bg-white rounded-sm border border-forme-cream space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif text-base font-medium text-forme-charcoal block">
                  "True architectural presence without visual clutter."
                </span>
                <span className="text-xs text-forme-taupe">Tunde O. — Abuja, Nigeria</span>
              </div>
              <span className="text-[10px] uppercase tracking-editorial bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-xs font-semibold">
                Verified Owner
              </span>
            </div>
            <p className="text-xs text-forme-charcoal/80 leading-relaxed font-sans">
              A solid, heirloom investment. The natural travertine slab has wonderful organic veining that looks even richer under evening ambient lighting.
            </p>
          </div>
        </div>
      </section>

      {/* Harmonious Pairings (Related Products) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-forme-cream bg-forme-cream/20 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex justify-between items-end border-b border-forme-cream pb-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold">
                  Curated Pairings
                </span>
                <h3 className="font-serif text-3xl text-forme-charcoal">
                  Pieces Often Paired Together
                </h3>
              </div>
              <Link to="/shop" className="text-xs uppercase tracking-editorial font-medium text-forme-charcoal hover:text-forme-terracotta transition-colors">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onQuickView={(item) => setQuickViewPairing(item)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Pairing Modal */}
      <QuickViewModal
        product={quickViewPairing}
        isOpen={!!quickViewPairing}
        onClose={() => setQuickViewPairing(null)}
      />

      {/* Mobile Sticky Purchase Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-forme-cream p-3 sm:hidden z-30 flex items-center justify-between shadow-forme-modal">
        <div className="flex items-center space-x-3 overflow-hidden">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-10 h-10 object-cover rounded-xs border border-forme-cream shrink-0"
          />
          <div className="truncate">
            <h4 className="font-serif text-sm font-medium text-forme-charcoal truncate">
              {product.name}
            </h4>
            <span className="font-sans text-xs font-semibold text-forme-charcoal">
              {formatPrice(activePrice)}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="px-4 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium rounded-sm shrink-0 ml-3"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};
