import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../common/ProductCard';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import type { Product } from '../../types';

interface BestsellersSectionProps {
  onQuickView: (product: Product) => void;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({ onQuickView }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Bestsellers' },
    { id: 'sofas', label: 'Living' },
    { id: 'beds', label: 'Bedroom' },
    { id: 'dining', label: 'Dining' },
    { id: 'workspace', label: 'Workspace' },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (activeFilter === 'all') return product.isBestseller || product.isFeatured;
    return product.category === activeFilter;
  });

  return (
    <section className="py-20 lg:py-28 bg-forme-cream/30 border-y border-forme-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header + Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-forme-cream pb-6 gap-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-editorial font-semibold text-forme-terracotta">
              Permanent Signatures
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forme-charcoal">
              Acclaimed Bestsellers
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-editorial font-medium rounded-sm transition-all ${
                  activeFilter === tab.id
                    ? 'bg-forme-charcoal text-white shadow-xs'
                    : 'bg-white border border-forme-cream text-forme-charcoal hover:border-forme-taupe'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom Catalog Link */}
        <div className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3.5 border border-forme-charcoal text-forme-charcoal hover:bg-forme-charcoal hover:text-white text-xs uppercase tracking-editorial font-medium rounded-sm transition-all"
          >
            <span>View Complete Furniture Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
