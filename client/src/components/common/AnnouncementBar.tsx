import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-forme-charcoal text-forme-ivory py-2 px-4 text-xs font-medium tracking-editorial uppercase transition-all duration-300 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-forme-terracotta shrink-0" />
          <span>Complimentary White-Glove Interior Delivery in Lagos & Abuja on Orders Over ₦1,500,000</span>
          <Link 
            to="/shop" 
            className="hidden md:inline-flex items-center space-x-1 text-forme-terracotta hover:text-forme-ivory transition-colors underline ml-2 normal-case tracking-normal"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement bar"
          className="text-forme-taupe hover:text-forme-ivory transition-colors p-1 -mr-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
