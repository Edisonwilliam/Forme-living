import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  LogOut, 
  Sparkles, 
  Clock, 
  Plus, 
  Eye, 
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../lib/utils';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import type { Order, Address } from '../types';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, login, register, googleLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/account';

  // Auth Mode when not logged in
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Authenticated Tabs: 'orders' | 'addresses' | 'concierge' | 'profile'
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'concierge' | 'profile'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      _id: 'addr_1',
      fullName: user?.name || 'Alexander Wright',
      streetAddress: '14 Queen Amina Way, Ikoyi',
      apartment: 'Penthouse East',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '101233',
      phoneNumber: '+234 803 555 0192',
      isDefault: true,
    },
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, '_id'>>({
    fullName: '',
    streetAddress: '',
    apartment: '',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    postalCode: '',
    phoneNumber: '+234 ',
    isDefault: false,
  });

  // Load orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingOrders(true);
      orderService
        .getMyOrders()
        .then((data) => {
          if (data && data.length > 0) {
            setOrders(data);
          } else {
            // Provide realistic initial showcase order for preview
            setOrders([
              {
                _id: 'ord_demo_1',
                orderNumber: 'FL-2025-0849A',
                customer: {
                  name: user?.name || 'Alexander Wright',
                  email: user?.email || 'client@forme.com',
                  phoneNumber: '+234 803 555 0192',
                },
                items: [
                  {
                    productId: '660e1d2b8b9a1c001f3e0001',
                    name: 'Kanso Curvilinear 3-Piece Bouclé Sofa',
                    slug: 'kanso-curvilinear-boucle-sofa',
                    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
                    variantName: 'Oatmeal Bouclé / Smoked Ash',
                    quantity: 1,
                    price: 245000000,
                    total: 245000000,
                  },
                ],
                subtotal: 245000000,
                shippingFee: 0,
                discountAmount: 0,
                total: 245000000,
                currency: 'NGN',
                paymentStatus: 'paid',
                fulfillmentStatus: 'processing',
                shippingAddress: {
                  fullName: user?.name || 'Alexander Wright',
                  streetAddress: '14 Queen Amina Way, Ikoyi',
                  apartment: 'Penthouse East',
                  city: 'Lagos',
                  state: 'Lagos',
                  country: 'Nigeria',
                  phoneNumber: '+234 803 555 0192',
                },
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ]);
          }
        })
        .catch(() => {
          // If offline or error, gracefully keep demo order
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [isAuthenticated, user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      await login(signInEmail, signInPassword);
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      await register(signUpName, signUpEmail, signUpPassword);
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || 'Account registration failed. Please try again.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      await googleLogin(credential);
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      setAuthError(
        err?.response?.data?.message || 'Google authentication failed. Please try again.'
      );
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleDemoLogin = (role: 'client' | 'admin') => {
    setAuthError(null);
    setIsSubmittingAuth(true);

    const email = role === 'admin' ? 'admin@formeliving.com' : 'client@formeliving.com';
    const password = role === 'admin' ? 'Admin@1234' : 'Client@1234';

    login(email, password)
      .then(() => navigate(role === 'admin' ? '/admin' : returnTo, { replace: true }))
      .catch((err: any) => {
        setAuthError(err?.response?.data?.message || 'Demo login failed — ensure the server is running.');
      })
      .finally(() => setIsSubmittingAuth(false));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      ...newAddress,
      _id: 'addr_' + Date.now(),
    };
    setAddresses((prev) => [...prev, created]);
    setShowAddressModal(false);
    setNewAddress({
      fullName: '',
      streetAddress: '',
      apartment: '',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '',
      phoneNumber: '+234 ',
      isDefault: false,
    });
  };

  /* ──────────────────────────────────────────────────────────────────────────
     UNAUTHENTICATED CLIENT SCREEN
     ────────────────────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forme-ivory py-16 sm:py-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 border border-forme-cream shadow-sm space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-semibold">
              FORME Atelier Portal
            </span>
            <h1 className="font-serif text-3xl text-forme-charcoal">
              {authMode === 'signin' ? 'Client Sign In' : 'Private Membership'}
            </h1>
            <p className="text-xs text-forme-charcoal/70 font-sans">
              Access your commissioned orders, saved spatial plans, and bespoke white-glove logistics.
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 border-b border-forme-cream text-center text-xs uppercase tracking-editorial font-medium">
            <button
              onClick={() => { setAuthMode('signin'); setAuthError(null); }}
              className={`pb-3 transition-colors ${
                authMode === 'signin'
                  ? 'border-b-2 border-forme-charcoal text-forme-charcoal font-semibold'
                  : 'text-forme-taupe hover:text-forme-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setAuthError(null); }}
              className={`pb-3 transition-colors ${
                authMode === 'signup'
                  ? 'border-b-2 border-forme-charcoal text-forme-charcoal font-semibold'
                  : 'text-forme-taupe hover:text-forme-charcoal'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-sm">
              {authError}
            </div>
          )}

          {/* Google Sign-In / Registration */}
          <div className="space-y-4">
            <GoogleSignInButton
              buttonText={authMode === 'signin' ? 'signin_with' : 'signup_with'}
              onSuccess={handleGoogleSuccess}
              onError={(err) => setAuthError(err)}
              disabled={isSubmittingAuth}
            />

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-forme-cream"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-editorial text-forme-taupe font-mono">
                Or with Email & Password
              </span>
              <div className="flex-grow border-t border-forme-cream"></div>
            </div>
          </div>

          {/* Forms */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="client@forme.com"
                  className="w-full px-3.5 py-2.5 border border-forme-cream text-sm focus:border-forme-charcoal outline-none bg-forme-ivory/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs uppercase tracking-editorial text-forme-charcoal font-medium">
                    Password
                  </label>
                  <span className="text-[11px] text-forme-taupe hover:text-forme-charcoal cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 border border-forme-cream text-sm focus:border-forme-charcoal outline-none bg-forme-ivory/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmittingAuth ? 'Verifying Credentials...' : 'Sign In to Atelier'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Full Name / Architectural Practice
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Alexander Wright Architecture"
                  className="w-full px-3.5 py-2.5 border border-forme-cream text-sm focus:border-forme-charcoal outline-none bg-forme-ivory/20"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="client@archstudio.com"
                  className="w-full px-3.5 py-2.5 border border-forme-cream text-sm focus:border-forme-charcoal outline-none bg-forme-ivory/20"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Create Secure Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 border border-forme-cream text-sm focus:border-forme-charcoal outline-none bg-forme-ivory/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmittingAuth ? 'Creating Portfolio...' : 'Establish Atelier Account'}
              </button>
            </form>
          )}

          {/* Quick Demo Access Buttons */}
          <div className="pt-4 border-t border-forme-cream space-y-3">
            <span className="block text-center text-[10px] uppercase tracking-editorial text-forme-taupe font-mono">
              Quick Portfolio Showcase Access
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('client')}
                className="py-2.5 px-3 border border-forme-cream hover:border-forme-charcoal text-[11px] font-medium text-forme-charcoal transition-colors bg-forme-ivory/50 rounded-sm"
              >
                Demo VIP Client
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-2.5 px-3 border border-forme-cream hover:border-forme-charcoal text-[11px] font-medium text-forme-charcoal transition-colors bg-forme-ivory/50 rounded-sm"
              >
                Demo Atelier Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     AUTHENTICATED VIP CLIENT DASHBOARD
     ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-forme-ivory py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* VIP Profile Banner */}
        <div className="bg-white p-6 sm:p-10 border border-forme-cream shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-full bg-forme-charcoal text-forme-ivory flex items-center justify-center font-serif text-2xl border-2 border-forme-terracotta shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl sm:text-3xl text-forme-charcoal font-medium">
                  {user?.name || 'Alexander Wright'}
                </h1>
                <span className="bg-forme-cream text-forme-olive text-[10px] uppercase tracking-editorial font-semibold px-2 py-0.5 rounded-full font-mono">
                  {user?.role === 'admin' ? 'Atelier Director' : 'Private Client'}
                </span>
              </div>
              <p className="text-xs text-forme-taupe font-sans">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 border border-forme-cream text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-forme-cream space-x-8 text-xs uppercase tracking-editorial font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Commissions & Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Residences ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('concierge')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'concierge'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Atelier Concierge & Swatches</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'profile'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Security & Details</span>
          </button>
        </div>

        {/* ── TAB 1: COMMISSIONS & ORDERS ─────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="bg-white p-12 text-center border border-forme-cream text-xs text-forme-taupe">
                Retrieving your commissions and delivery tracking...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-forme-cream space-y-4">
                <Package className="w-10 h-10 text-forme-taupe mx-auto" />
                <h3 className="font-serif text-xl text-forme-charcoal">No past commissions recorded</h3>
                <p className="text-xs text-forme-charcoal/70 font-sans max-w-sm mx-auto">
                  You have not commissioned any furniture pieces yet. Browse our signature collections to begin.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id || order.id || order.orderNumber}
                    className="bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-forme-cream pb-4 gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-editorial text-forme-taupe font-mono">
                          Order Number
                        </span>
                        <p className="font-serif text-lg text-forme-charcoal font-semibold">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-forme-taupe">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {order.fulfillmentStatus === 'processing' ? 'Atelier QC & Crating' : order.fulfillmentStatus}
                        </span>
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="px-4 py-1.5 border border-forme-cream text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream/50 transition-colors flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-forme-cream">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-sm border border-forme-cream"
                              />
                            )}
                            <div>
                              <p className="font-serif text-base text-forme-charcoal font-medium">
                                {item.name}
                              </p>
                              {item.variantName && (
                                <p className="text-xs text-forme-olive">Specification: {item.variantName}</p>
                              )}
                              <p className="text-xs text-forme-taupe">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-sm text-forme-charcoal">
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="border-t border-forme-cream pt-4 flex justify-between items-center text-xs text-forme-charcoal">
                      <span>Delivery: {order.shippingAddress.streetAddress}, {order.shippingAddress.city}</span>
                      <span className="font-serif text-base font-semibold">Total Paid: {formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: SAVED RESIDENCES / ADDRESSES ───────────────────────────── */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-forme-charcoal">Saved Delivery Residences</h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Residence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr._id} className="bg-white p-6 border border-forme-cream shadow-sm space-y-3 relative">
                  {addr.isDefault && (
                    <span className="inline-block bg-forme-cream text-forme-olive text-[10px] uppercase tracking-editorial font-semibold px-2 py-0.5 rounded-full font-mono">
                      Primary Delivery Residence
                    </span>
                  )}
                  <h3 className="font-serif text-base text-forme-charcoal font-semibold">{addr.fullName}</h3>
                  <div className="text-xs text-forme-charcoal/80 space-y-1 font-sans">
                    <p>{addr.streetAddress}</p>
                    {addr.apartment && <p>{addr.apartment}</p>}
                    <p>{addr.city}, {addr.state}, {addr.country}</p>
                    <p className="text-forme-taupe pt-1">{addr.phoneNumber}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forme-charcoal/60 backdrop-blur-sm">
                <div className="bg-white p-8 max-w-lg w-full border border-forme-cream shadow-2xl space-y-5 animate-fade-in">
                  <h3 className="font-serif text-xl text-forme-charcoal">Add Delivery Residence</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-editorial text-forme-charcoal mb-1">
                        Full Name / Resident
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-editorial text-forme-charcoal mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.streetAddress}
                        onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-editorial text-forme-charcoal mb-1">
                          Apartment / Suite
                        </label>
                        <input
                          type="text"
                          value={newAddress.apartment}
                          onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                          className="w-full px-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-editorial text-forme-charcoal mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-editorial text-forme-charcoal mb-1">
                          State
                        </label>
                        <select
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal bg-white"
                        >
                          <option value="Lagos">Lagos State</option>
                          <option value="Abuja FCT">Abuja FCT</option>
                          <option value="Rivers">Rivers State</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-editorial text-forme-charcoal mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phoneNumber}
                          onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="flex-1 py-2.5 border border-forme-cream text-xs uppercase tracking-editorial"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial hover:bg-forme-olive"
                      >
                        Save Residence
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CONCIERGE & SWATCHES ─────────────────────────────────── */}
        {activeTab === 'concierge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-forme-cream space-y-4">
              <Sparkles className="w-8 h-8 text-forme-terracotta" />
              <h3 className="font-serif text-2xl text-forme-charcoal">
                Complimentary Material Swatch Box
              </h3>
              <p className="text-xs text-forme-charcoal/70 font-sans">
                Request physical samples of Belgian ivory bouclé, Italian cognac leather, honed Roman travertine, and quarter-sawn smoked ash delivered to your studio.
              </p>
              <button
                onClick={() => alert('Material Swatch Box requested! Our Lagos studio will dispatch via DHL within 24 hours.')}
                className="px-6 py-3 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors"
              >
                Dispatch Swatch Dossier
              </button>
            </div>

            <div className="bg-white p-8 border border-forme-cream space-y-4">
              <Clock className="w-8 h-8 text-forme-olive" />
              <h3 className="font-serif text-2xl text-forme-charcoal">
                Architectural Living Dialogue
              </h3>
              <p className="text-xs text-forme-charcoal/70 font-sans">
                Schedule a private 45-minute spatial consultation with our Victoria Island creative director to plan floor layouts and custom dimension specifications.
              </p>
              <button
                onClick={() => alert('Appointment request submitted. Our senior design architect will contact you shortly.')}
                className="px-6 py-3 border border-forme-charcoal text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream transition-colors"
              >
                Book Atelier Consultation
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 4: PROFILE & SECURITY ────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white p-8 border border-forme-cream space-y-6">
            <h3 className="font-serif text-xl text-forme-charcoal">Client Security & Details</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name}
                  className="w-full px-3 py-2 border border-forme-cream bg-forme-ivory/40 outline-none"
                />
              </div>
              <div>
                <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email}
                  className="w-full px-3 py-2 border border-forme-cream bg-forme-ivory/40 outline-none"
                />
              </div>
              <div>
                <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                  Account Tier
                </label>
                <p className="font-mono text-forme-olive font-semibold">
                  {user?.role === 'admin' ? 'Administrator & Lead Curator' : 'Verified Private Client (Atelier Circle)'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Receipt Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forme-charcoal/60 backdrop-blur-sm">
            <div className="bg-white p-8 max-w-2xl w-full border border-forme-cream shadow-2xl space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-forme-cream pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-forme-charcoal">Official Commission Invoice</h3>
                  <p className="text-xs font-mono text-forme-taupe">Reference: {viewingOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="text-forme-taupe hover:text-forme-charcoal text-xs uppercase tracking-editorial font-medium"
                >
                  Close [✕]
                </button>
              </div>

              <div className="space-y-3">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-2 border-b border-forme-cream/50">
                    <div>
                      <p className="font-medium text-forme-charcoal">{item.name}</p>
                      {item.variantName && <p className="text-xs text-forme-taupe">{item.variantName}</p>}
                      <p className="text-xs text-forme-taupe">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-forme-charcoal">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-forme-cream/30 p-4 rounded-sm space-y-1.5 text-xs text-forme-charcoal">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(viewingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Delivery</span>
                  <span>{viewingOrder.shippingFee === 0 ? 'Complimentary' : formatPrice(viewingOrder.shippingFee)}</span>
                </div>
                <div className="border-t border-forme-cream pt-2 flex justify-between font-serif text-base font-semibold">
                  <span>Total Commission</span>
                  <span>{formatPrice(viewingOrder.total)}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
