import React from 'react';
import { X, Search, ChevronRight, Phone, Mail, MapPin, User, LogIn, LogOut, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAVIGATION_LINKS, ROOMS, BRAND_NAME } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch {
      // ignore
    }
  };

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
        <div className="p-5 border-b border-forme-cream flex items-center justify-between bg-white">
          <Link to="/" onClick={onClose} className="font-serif text-2xl text-forme-charcoal font-semibold">
            {BRAND_NAME}
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-forme-taupe hover:text-forme-charcoal p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth / Account Banner for Mobile */}
        <div className="p-4 border-b border-forme-cream bg-white/80">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="w-9 h-9 rounded-full bg-forme-terracotta text-white text-sm font-semibold flex items-center justify-center uppercase select-none shadow-xs">
                  {user.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-semibold text-forme-charcoal truncate">{user.name}</p>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 bg-forme-charcoal text-white text-[9px] uppercase tracking-editorial rounded-xs">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-forme-taupe truncate">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <Link
                  to="/account"
                  onClick={onClose}
                  className="px-3 py-2 bg-forme-cream/70 hover:bg-forme-cream rounded-sm text-forme-charcoal font-medium flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-forme-olive" />
                  <span>My Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-forme-cream/40 hover:bg-rose-50 text-forme-taupe hover:text-rose-600 rounded-sm font-medium flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-forme-taupe uppercase tracking-editorial font-semibold">
                  Member Access
                </span>
              </div>
              <Link
                to="/account"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-forme-charcoal hover:bg-forme-olive text-white rounded-sm text-xs font-medium tracking-editorial uppercase flex items-center justify-center space-x-2 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-forme-terracotta" />
                <span>Sign In / Create Account</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Search Button */}
        <div className="p-3 border-b border-forme-cream bg-forme-cream/30">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full py-2 px-3 bg-white border border-forme-cream rounded-sm text-xs text-forme-taupe flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-forme-olive" />
              <span>Search furniture...</span>
            </span>
            <span className="text-[10px] uppercase tracking-editorial font-mono">Tap</span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase tracking-editorial text-forme-taupe font-semibold block">
              Navigation
            </span>
            <nav className="flex flex-col space-y-1">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className="font-serif text-lg text-forme-charcoal hover:text-forme-terracotta py-1 flex items-center justify-between transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-forme-taupe/60" />
                </Link>
              ))}

              {/* Account Quick Links in Drawer */}
              <Link
                to="/account"
                onClick={onClose}
                className="font-serif text-lg text-forme-charcoal hover:text-forme-terracotta py-1 flex items-center justify-between transition-colors border-t border-forme-cream/60 pt-2"
              >
                <span className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-forme-terracotta" />
                  <span>{isAuthenticated ? 'Orders & Account' : 'Sign In / Register'}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-forme-taupe/60" />
              </Link>

              <Link
                to="/wishlist"
                onClick={onClose}
                className="font-serif text-lg text-forme-charcoal hover:text-forme-terracotta py-1 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-forme-terracotta" />
                  <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-forme-taupe/60" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="font-serif text-lg text-forme-charcoal hover:text-forme-terracotta py-1 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-forme-olive" />
                    <span>Admin Dashboard</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-forme-taupe/60" />
                </Link>
              )}
            </nav>
          </div>

          {/* Shop By Room Quick Links */}
          <div className="space-y-3 pt-3 border-t border-forme-cream">
            <span className="text-[10px] uppercase tracking-editorial text-forme-taupe font-semibold block">
              Discover by Room
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ROOMS.map((room) => (
                <Link
                  key={room.id}
                  to={room.href}
                  onClick={onClose}
                  className="p-2.5 bg-forme-cream/50 hover:bg-forme-cream rounded-sm text-xs font-medium text-forme-charcoal transition-colors block text-center"
                >
                  {room.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Concierge Support */}
          <div className="space-y-2 pt-3 border-t border-forme-cream text-xs text-forme-charcoal/80">
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
        <div className="p-3 border-t border-forme-cream bg-white text-center text-[11px] text-forme-taupe">
          <span>Currency: NGN (Nigerian Naira ₦)</span>
        </div>
      </div>
    </div>
  );
};

