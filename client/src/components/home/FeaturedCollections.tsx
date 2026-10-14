import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEATURED_COLLECTIONS } from '../../lib/constants';

export const FeaturedCollections: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-forme-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-forme-cream pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-editorial font-semibold text-forme-terracotta">
              Curated Ensembles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forme-charcoal">
              Featured Collections
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs uppercase tracking-editorial font-medium text-forme-charcoal hover:text-forme-terracotta transition-colors flex items-center space-x-1.5"
          >
            <span>View All Ensembles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_COLLECTIONS.map((col, idx) => (
            <Link
              key={col.id}
              to={`/shop?collection=${col.id}`}
              className="group relative aspect-[16/10] sm:aspect-[16/11] rounded-sm overflow-hidden bg-forme-cream border border-forme-cream block shadow-forme-subtle"
            >
              {/* Background Imagery */}
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Editorial Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-forme-charcoal/90 via-forme-charcoal/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-mono uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xs tracking-wider">
                    {col.itemCount}
                  </span>
                  <span className="text-xs uppercase tracking-editorial text-forme-cream/80 font-medium">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="text-xs uppercase tracking-editorial text-forme-terracotta font-medium">
                    {col.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white">
                    {col.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-forme-cream/80 max-w-md font-sans line-clamp-2">
                    {col.description}
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-xs uppercase tracking-editorial text-forme-ivory font-medium group-hover:text-forme-terracotta transition-colors">
                    <span>Discover Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
