import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { formatPrice } from '../../lib/utils';
import type { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const trendingTerms = ['Bouclé Sofa', 'Solid Oak Bed', 'Travertine Table', 'Executive Desk', 'Alabaster Lighting'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-forme-charcoal/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-2xl bg-forme-ivory rounded-sm shadow-forme-modal border border-forme-cream overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Search Catalog"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-forme-cream flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-forme-olive shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by furniture piece, material, room, or collection..."
            className="w-full bg-transparent border-none text-base sm:text-lg text-forme-charcoal placeholder:text-forme-taupe focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-forme-taupe hover:text-forme-charcoal p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-editorial font-medium text-forme-taupe hover:text-forme-charcoal px-2.5 py-1 rounded border border-forme-cream transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-editorial text-forme-taupe font-medium block">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3.5 py-1.5 bg-forme-cream hover:bg-forme-stone text-forme-charcoal rounded-full transition-colors flex items-center space-x-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-forme-olive" />
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-editorial text-forme-taupe font-medium block">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'} Found
              </span>
              <div className="divide-y divide-forme-cream">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(product);
                      onClose();
                    }}
                    className="py-3 flex items-center justify-between group cursor-pointer hover:bg-forme-cream/30 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-sm bg-forme-cream shrink-0 border border-forme-cream"
                      />
                      <div>
                        <h4 className="font-serif text-base text-forme-charcoal group-hover:text-forme-terracotta transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-forme-charcoal/60 mt-0.5 font-sans">
                          {product.material}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-sm font-semibold text-forme-charcoal">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <p className="font-serif text-xl text-forme-charcoal">No architectural pieces found</p>
              <p className="text-xs text-forme-charcoal/70">
                Try searching for broader terms like "Sofa", "Table", "Oak", or "Lighting".
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-forme-cream/50 border-t border-forme-cream text-center text-xs text-forme-taupe flex items-center justify-center space-x-2">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-forme-taupe/30 rounded font-mono">
            ESC
          </kbd>
          <span>to dismiss</span>
        </div>
      </div>
    </div>
  );
};
