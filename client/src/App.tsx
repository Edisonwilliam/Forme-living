import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { MobileMenu } from './components/common/MobileMenu';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { Footer } from './components/common/Footer';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { StoryPage } from './pages/StoryPage';
import { JournalPage } from './pages/JournalPage';
import { PaymentCallbackPage } from './pages/PaymentCallbackPage';
import type { Product } from './types';
import { ArrowLeft, Sparkles } from 'lucide-react';

function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-4 bg-forme-ivory">
      <div className="w-12 h-12 rounded-full bg-forme-cream flex items-center justify-center text-forme-terracotta">
        <Sparkles className="w-6 h-6" />
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">{title}</h1>
      <p className="text-xs sm:text-sm text-forme-charcoal/70 max-w-md font-sans">{subtitle}</p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors rounded-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <Router>
      {/* AuthProvider wraps everything so hooks work in all children */}
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-forme-ivory text-forme-charcoal flex flex-col selection:bg-forme-terracotta selection:text-white">
              {/* Announcement Top Bar */}
              <AnnouncementBar />

              {/* Sticky Navigation */}
              <Navbar
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              />

              {/* Main Application Body */}
              <main className="flex-1">
                <Routes>
                  {/* ── Public Routes ─────────────────────────────────────────── */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/collections" element={<ShopPage />} />
                  <Route path="/rooms" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/story" element={<StoryPage />} />
                  <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                  <Route path="/journal" element={<JournalPage />} />

                  {/* ── Account (handles both guest login & authenticated view) ── */}
                  <Route path="/account" element={<AccountPage />} />

                  {/* ── Customer-Protected Routes ──────────────────────────────── */}
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Admin-Only Route ───────────────────────────────────────── */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    }
                  />

                  {/* ── 404 Fallback ───────────────────────────────────────────── */}
                  <Route
                    path="*"
                    element={
                      <PlaceholderPage
                        title="Page Not Found"
                        subtitle="The requested architectural piece or page does not exist."
                      />
                    }
                  />
                </Routes>
              </main>

              {/* Luxury Footer */}
              <Footer />

              {/* Drawers & Interactive Modals */}
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onOpenSearch={() => setIsSearchOpen(true)}
              />

              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={(product) => setSelectedProduct(product)}
              />

              <CartDrawer />

              <QuickViewModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
