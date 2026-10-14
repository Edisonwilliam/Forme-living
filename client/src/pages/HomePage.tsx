import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { BestsellersSection } from '../components/home/BestsellersSection';
import { ShopByRoom } from '../components/home/ShopByRoom';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { EditorialInspiration } from '../components/home/EditorialInspiration';
import { TrustSection } from '../components/home/TrustSection';
import { QuickViewModal } from '../components/common/QuickViewModal';
import type { Product } from '../types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="bg-forme-ivory">
      {/* 1. Hero Spread */}
      <HeroSection />

      {/* 2. Featured Ensembles */}
      <FeaturedCollections />

      {/* 3. Acclaimed Bestsellers */}
      <BestsellersSection onQuickView={(p) => setQuickViewProduct(p)} />

      {/* 4. Curate by Room */}
      <ShopByRoom />

      {/* 5. Brand Philosophy & Craftsmanship */}
      <BrandStorySection />

      {/* 6. Journal & Editorial Articles */}
      <EditorialInspiration />

      {/* 7. Guarantees & White-Glove Support */}
      <TrustSection />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
