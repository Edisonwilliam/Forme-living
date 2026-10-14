import React from 'react';
import { X, Search, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAVIGATION_LINKS, ROOMS, BRAND_NAME } from '../../lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenSearch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-forme-charcoal/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-forme-ivory shadow-2xl flex flex-col border-r border-forme-cream z-10">
        {/* Header */}
        <div className="p-6 border-b border-forme-cream flex items-center justify-between bg-white">
          <span className="font-serif text-2xl text-forme-charcoal font-semibold">
            {BRAND_NAME}
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-forme-taupe hover:text-forme-charcoal p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Button */}
        <div className="p-4 border-b border-forme-cream bg-forme-cream/30">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full py-2.5 px-4 bg-white border border-forme-cream rounded-sm text-xs text-forme-taupe flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-forme-olive" />
              <span>Search furniture...</span>
            </span>
            <span className="text-[10px] uppercase tracking-editorial font-mono">Tap</span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-editorial text-forme-taupe font-semibold block">
              Navigation
            </span>
            <nav className="flex flex-col space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className="font-serif text-xl text-forme-charcoal hover:text-forme-terracotta py-1 flex items-center justify-between transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-forme-taupe/60" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Shop By Room Quick Links */}
          <div className="space-y-3 pt-4 border-t border-forme-cream">
            <span className="text-[10px] uppercase tracking-editorial text-forme-taupe font-semibold block">
              Discover by Room
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ROOMS.map((room) => (
                <Link
                  key={room.id}
                  to={room.href}
                  onClick={onClose}
                  className="p-3 bg-forme-cream/50 hover:bg-forme-cream rounded-sm text-xs font-medium text-forme-charcoal transition-colors block text-center"
                >
                  {room.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Concierge Support */}
          <div className="space-y-2 pt-4 border-t border-forme-cream text-xs text-forme-charcoal/80">
            <span className="text-[10px] uppercase tracking-editorial text-forme-taupe font-semibold block mb-2">
              Client Concierge
            </span>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-forme-olive" />
              <span>+234 (01) 888-FORME</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-forme-olive" />
              <span>concierge@formeliving.com</span>
            </p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-forme-olive" />
              <span>Victoria Island, Lagos, Nigeria</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-forme-cream bg-white text-center text-[11px] text-forme-taupe">
          <span>Currency: NGN (Nigerian Naira ₦)</span>
        </div>
      </div>
    </div>
  );
};
