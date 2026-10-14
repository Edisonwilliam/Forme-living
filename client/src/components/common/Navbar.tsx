import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND_NAME, NAVIGATION_LINKS } from '../../lib/constants';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-forme-ivory/95 backdrop-blur-md shadow-forme-subtle py-3 border-b border-forme-cream'
          : 'bg-forme-ivory py-5 border-b border-forme-cream/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-forme-charcoal hover:text-forme-terracotta transition-colors -ml-2"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-baseline space-x-2 group">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-forme-charcoal font-semibold group-hover:text-forme-olive transition-colors">
              {BRAND_NAME}
            </span>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-editorial text-forme-terracotta font-medium bg-forme-cream/80 px-1.5 py-0.5 rounded-xs">
              Studio
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium uppercase tracking-editorial text-forme-charcoal">
          {NAVIGATION_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`py-1 relative transition-colors hover:text-forme-terracotta ${
                  isActive ? 'text-forme-terracotta font-semibold' : 'text-forme-charcoal/90'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-forme-terracotta rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Utilities */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-forme-charcoal">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 hover:text-forme-terracotta transition-colors flex items-center space-x-1.5"
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-xs uppercase tracking-editorial font-medium">Search</span>
          </button>

          {/* Admin quick-link (admin users only) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-forme-charcoal text-white text-[10px] uppercase tracking-editorial font-medium rounded-sm hover:bg-forme-olive transition-colors"
              aria-label="Admin dashboard"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          )}

          {/* Account: show user initial when logged in */}
          <Link
            to="/account"
            className="p-2 hover:text-forme-terracotta transition-colors hidden sm:flex items-center"
            aria-label={isAuthenticated ? `Account — ${user?.name}` : 'Sign in'}
          >
            {isAuthenticated && user ? (
              <span className="w-7 h-7 rounded-full bg-forme-terracotta text-white text-xs font-semibold flex items-center justify-center uppercase select-none">
                {user.name.charAt(0)}
              </span>
            ) : (
              <User className="w-4 h-4" />
            )}
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="p-2 hover:text-forme-terracotta transition-colors relative"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-forme-terracotta text-white text-[10px] font-mono font-medium flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Drawer Trigger */}
          <button
            onClick={openCart}
            className="p-2 hover:text-forme-terracotta transition-colors relative flex items-center space-x-1.5"
            aria-label={`Shopping bag with ${totalItems} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-forme-charcoal text-white text-[10px] font-mono font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-xs uppercase tracking-editorial font-medium">
              Bag
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
