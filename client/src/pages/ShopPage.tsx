import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { productService } from '../services/productService';
import { CATEGORIES, FEATURED_COLLECTIONS } from '../lib/constants';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    productService
      .getAll()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => {
        // Retain fallback seamlessly
      });
  }, []);

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'all';
  const collectionParam = searchParams.get('collection') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const materialParam = searchParams.get('material') || 'all';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 300000000;
  const inStockOnly = searchParams.get('inStock') === 'true';

  // Material filters list
  const materials = ['all', 'Bouclé', 'Oak', 'Walnut', 'Travertine', 'Ash', 'Alabaster', 'Leather'];

  // Sorting options
  const sortOptions = [
    { id: 'featured', label: 'Featured Signatures' },
    { id: 'newest', label: 'Newest Arrivals' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
    { id: 'rating', label: 'Customer Rating' },
  ];

  // Helper to update specific param while keeping others
  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (categoryParam !== 'all' && product.category !== categoryParam) {
        return false;
      }

      // Collection filter
      if (collectionParam !== 'all' && !product.collections.includes(collectionParam)) {
        return false;
      }

      // Material filter
      if (materialParam !== 'all') {
        const hasMaterial = product.material.toLowerCase().includes(materialParam.toLowerCase());
        if (!hasMaterial) return false;
      }

      // Price range
      if (product.price < minPriceParam || product.price > maxPriceParam) {
        return false;
      }

      // In stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortParam === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortParam === 'price_asc') return a.price - b.price;
      if (sortParam === 'price_desc') return b.price - a.price;
      if (sortParam === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [categoryParam, collectionParam, sortParam, materialParam, minPriceParam, maxPriceParam, inStockOnly]);

  // Active filter count
  const activeFiltersCount = [
    categoryParam !== 'all',
    collectionParam !== 'all',
    materialParam !== 'all',
    minPriceParam > 0 || maxPriceParam < 300000000,
    inStockOnly,
  ].filter(Boolean).length;

  // Title calculation
  const currentCategory = CATEGORIES.find((c) => c.id === categoryParam);
  const currentCollection = FEATURED_COLLECTIONS.find((c) => c.id === collectionParam);
  const pageTitle = currentCollection?.name || currentCategory?.name || 'All Furniture & Objects';
  const pageDescription = currentCollection?.description || currentCategory?.description || 'Architectural silhouettes, natural Italian stone, and solid European timber.';

  return (
    <div className="bg-forme-ivory min-h-screen">
      {/* Editorial Header Banner */}
      <section className="bg-forme-cream/50 border-b border-forme-cream py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-editorial text-forme-terracotta font-medium">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Catalog</span>
            {categoryParam !== 'all' && (
              <>
                <span>/</span>
                <span className="text-forme-charcoal">{currentCategory?.name}</span>
              </>
            )}
            {collectionParam !== 'all' && (
              <>
                <span>/</span>
                <span className="text-forme-charcoal">{currentCollection?.name}</span>
              </>
            )}
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forme-charcoal font-medium">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans leading-relaxed">
              {pageDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Controls Bar: Results Count, Mobile Filter Trigger, Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-forme-cream">
          {/* Left: Mobile trigger & Count */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-white border border-forme-cream rounded-sm text-xs uppercase tracking-editorial font-medium flex items-center space-x-2 text-forme-charcoal hover:border-forme-taupe transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-forme-olive" />
              <span>Filter Catalog</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-forme-terracotta text-white text-[10px] font-mono flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs text-forme-taupe font-medium">
              Showing <span className="text-forme-charcoal font-semibold">{filteredProducts.length}</span> of {MOCK_PRODUCTS.length} pieces
            </span>
          </div>

          {/* Right: Sorting Select */}
          <div className="flex items-center space-x-2 justify-end">
            <span className="text-xs uppercase tracking-editorial text-forme-taupe font-medium hidden sm:inline">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none bg-white border border-forme-cream rounded-sm px-4 py-2 pr-8 text-xs font-medium text-forme-charcoal focus:outline-none focus:border-forme-charcoal cursor-pointer uppercase tracking-editorial"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-forme-taupe absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4 border-b border-forme-cream">
            <span className="text-xs text-forme-taupe mr-1">Active Filters:</span>

            {categoryParam !== 'all' && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-forme-cream text-xs rounded-full text-forme-charcoal">
                <span>Category: {currentCategory?.name}</span>
                <button onClick={() => updateParam('category', null)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {collectionParam !== 'all' && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-forme-cream text-xs rounded-full text-forme-charcoal">
                <span>Collection: {currentCollection?.name}</span>
                <button onClick={() => updateParam('collection', null)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {materialParam !== 'all' && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-forme-cream text-xs rounded-full text-forme-charcoal">
                <span>Material: {materialParam}</span>
                <button onClick={() => updateParam('material', null)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-forme-cream text-xs rounded-full text-forme-charcoal">
                <span>In Stock Only</span>
                <button onClick={() => updateParam('inStock', null)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPriceParam > 0 || maxPriceParam < 300000000) && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-forme-cream text-xs rounded-full text-forme-charcoal">
                <span>Price: {formatPrice(minPriceParam)} – {formatPrice(maxPriceParam)}</span>
                <button 
                  onClick={() => {
                    updateParam('minPrice', null);
                    updateParam('maxPrice', null);
                  }} 
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs uppercase tracking-editorial font-medium text-forme-terracotta hover:text-forme-charcoal underline ml-2 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Content Layout: Filter Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                Categories
              </span>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => updateParam('category', null)}
                  className={`w-full text-left py-1.5 px-2 rounded-xs transition-colors flex justify-between ${
                    categoryParam === 'all'
                      ? 'bg-forme-cream font-semibold text-forme-charcoal'
                      : 'text-forme-charcoal/80 hover:bg-forme-cream/50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-forme-taupe font-mono">{MOCK_PRODUCTS.length}</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = MOCK_PRODUCTS.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.id)}
                      className={`w-full text-left py-1.5 px-2 rounded-xs transition-colors flex justify-between ${
                        categoryParam === cat.id
                          ? 'bg-forme-cream font-semibold text-forme-charcoal'
                          : 'text-forme-charcoal/80 hover:bg-forme-cream/50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-forme-taupe font-mono">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collection Filter */}
            <div className="space-y-3 pt-6 border-t border-forme-cream">
              <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                Ensembles & Collections
              </span>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => updateParam('collection', null)}
                  className={`w-full text-left py-1.5 px-2 rounded-xs transition-colors flex justify-between ${
                    collectionParam === 'all'
                      ? 'bg-forme-cream font-semibold text-forme-charcoal'
                      : 'text-forme-charcoal/80 hover:bg-forme-cream/50'
                  }`}
                >
                  <span>All Ensembles</span>
                </button>

                {FEATURED_COLLECTIONS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => updateParam('collection', col.id)}
                    className={`w-full text-left py-1.5 px-2 rounded-xs transition-colors flex justify-between ${
                      collectionParam === col.id
                        ? 'bg-forme-cream font-semibold text-forme-charcoal'
                        : 'text-forme-charcoal/80 hover:bg-forme-cream/50'
                    }`}
                  >
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div className="space-y-3 pt-6 border-t border-forme-cream">
              <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                Primary Material
              </span>
              <div className="flex flex-wrap gap-1.5">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => updateParam('material', mat)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      materialParam === mat
                        ? 'bg-forme-charcoal text-white border-forme-charcoal'
                        : 'bg-white text-forme-charcoal border-forme-cream hover:border-forme-taupe'
                    }`}
                  >
                    {mat === 'all' ? 'Any Material' : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-6 border-t border-forme-cream">
              <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                Price Ceiling
              </span>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-forme-charcoal">
                  <span>Under ₦3,000,000</span>
                  <span className="font-semibold">{formatPrice(maxPriceParam)}</span>
                </div>
                <input
                  type="range"
                  min={30000000}
                  max={300000000}
                  step={10000000}
                  value={maxPriceParam}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-full accent-forme-charcoal cursor-pointer"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="pt-6 border-t border-forme-cream">
              <label className="flex items-center space-x-2 text-xs text-forme-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                  className="rounded border-forme-cream text-forme-charcoal focus:ring-0"
                />
                <span>In-Stock Ready to Dispatch Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-16 border border-forme-cream rounded-sm bg-forme-cream/20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-forme-cream flex items-center justify-center text-forme-taupe mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl text-forme-charcoal">No matching furniture pieces</h3>
                  <p className="text-xs text-forme-charcoal/70 max-w-sm mx-auto font-sans">
                    No items match your active filter combination. Try resetting your price or material filters to see all available pieces.
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors rounded-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-forme-charcoal/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-forme-ivory shadow-2xl flex flex-col border-l border-forme-cream">
              <div className="p-4 border-b border-forme-cream flex items-center justify-between bg-white">
                <span className="font-serif text-xl text-forme-charcoal">Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-forme-taupe" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Mobile Categories */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                    Category
                  </span>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => updateParam('category', null)}
                      className={`w-full text-left py-1.5 px-2 rounded-xs ${
                        categoryParam === 'all' ? 'bg-forme-cream font-semibold' : ''
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateParam('category', cat.id)}
                        className={`w-full text-left py-1.5 px-2 rounded-xs ${
                          categoryParam === cat.id ? 'bg-forme-cream font-semibold' : ''
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Materials */}
                <div className="space-y-2 pt-4 border-t border-forme-cream">
                  <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                    Material
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {materials.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => updateParam('material', mat)}
                        className={`px-3 py-1 text-xs rounded-full border ${
                          materialParam === mat
                            ? 'bg-forme-charcoal text-white'
                            : 'bg-white border-forme-cream'
                        }`}
                      >
                        {mat === 'all' ? 'Any' : mat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-forme-cream bg-white space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-xs uppercase tracking-editorial text-forme-taupe"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
