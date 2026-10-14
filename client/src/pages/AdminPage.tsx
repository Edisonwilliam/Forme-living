import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Trash2, 
  Truck, 
  Eye, 
  Search, 
  ArrowUpRight, 
  ShieldAlert, 
  ArrowLeft, 
  X, 
  Sparkles, 
  DollarSign 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { formatPrice } from '../lib/utils';
import type { Product, Order } from '../types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [isAdminDemoUnlocked, setIsAdminDemoUnlocked] = useState(false);

  // Active Navigation Tab: 'overview' | 'catalog' | 'orders' | 'clients'
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'orders' | 'clients'>('overview');

  // Product Catalog State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    category: 'sofas',
    categoryLabel: 'Sofas & Lounges',
    price: 185000000, // ₦1,850,000 in kobo
    compareAtPrice: 220000000,
    material: 'Belgian Bouclé & Smoked Oak',
    color: 'Ivory / Charcoal',
    stock: 8,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    description: 'Sculptural architectural furniture handcrafted with precision joinery and tactile materiality.',
    width: 220,
    depth: 95,
    height: 78,
    unit: 'cm',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      _id: 'ord_101',
      orderNumber: 'FL-2025-0849A',
      customer: {
        name: 'Olumide Adeleke Architecture',
        email: 'olumide@adeleke-arch.ng',
        phoneNumber: '+234 802 334 9912',
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
      discountAmount: 24500000,
      couponCode: 'WELCOME10',
      total: 220500000,
      currency: 'NGN',
      paymentStatus: 'paid',
      fulfillmentStatus: 'processing',
      shippingAddress: {
        fullName: 'Olumide Adeleke Architecture',
        streetAddress: '14 Alexander Avenue, Ikoyi',
        apartment: 'Penthouse B',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        phoneNumber: '+234 802 334 9912',
      },
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'ord_102',
      orderNumber: 'FL-2025-0848B',
      customer: {
        name: 'Lady Zainab Danjuma',
        email: 'zainab.d@danjumagroup.com',
        phoneNumber: '+234 803 112 4455',
      },
      items: [
        {
          productId: '660e1d2b8b9a1c001f3e0003',
          name: 'Nara Solid Travertine Plinth Coffee Table',
          slug: 'nara-travertine-plinth-coffee-table',
          image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&q=80&w=1000',
          variantName: 'Honed Roman Travertine',
          quantity: 2,
          price: 135000000,
          total: 270000000,
        },
      ],
      subtotal: 270000000,
      shippingFee: 0,
      discountAmount: 0,
      total: 270000000,
      currency: 'NGN',
      paymentStatus: 'paid',
      fulfillmentStatus: 'shipped',
      shippingAddress: {
        fullName: 'Lady Zainab Danjuma',
        streetAddress: '7 Queen Amina Way, Maitama',
        city: 'Abuja',
        state: 'Abuja FCT',
        country: 'Nigeria',
        phoneNumber: '+234 803 112 4455',
      },
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'ord_103',
      orderNumber: 'FL-2025-0845C',
      customer: {
        name: 'Studio Kanso Interiors',
        email: 'procurement@kanso-studio.com',
        phoneNumber: '+234 811 500 7821',
      },
      items: [
        {
          productId: '660e1d2b8b9a1c001f3e0002',
          name: 'Kyoto Minimalist Solid White Oak Dining Table',
          slug: 'kyoto-solid-oak-dining-table',
          image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1000',
          variantName: 'Natural White Oak',
          quantity: 1,
          price: 185000000,
          total: 185000000,
        },
      ],
      subtotal: 185000000,
      shippingFee: 3500000,
      discountAmount: 0,
      total: 188500000,
      currency: 'NGN',
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered',
      shippingAddress: {
        fullName: 'Studio Kanso Interiors',
        streetAddress: '23 Adeola Odeku, Victoria Island',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        phoneNumber: '+234 811 500 7821',
      },
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // VIP Clients Directory
  const clients = [
    {
      id: 'c_1',
      name: 'Olumide Adeleke Architecture',
      email: 'olumide@adeleke-arch.ng',
      phone: '+234 802 334 9912',
      tier: 'Private Architectural Partner',
      ordersCount: 4,
      totalSpent: 845000000,
      lastOrder: 'Today, 04:12 PM',
    },
    {
      id: 'c_2',
      name: 'Lady Zainab Danjuma',
      email: 'zainab.d@danjumagroup.com',
      phone: '+234 803 112 4455',
      tier: 'Private Collector Circle',
      ordersCount: 3,
      totalSpent: 620000000,
      lastOrder: 'Yesterday',
    },
    {
      id: 'c_3',
      name: 'Studio Kanso Interiors',
      email: 'procurement@kanso-studio.com',
      phone: '+234 811 500 7821',
      tier: 'Design Studio Partner',
      ordersCount: 6,
      totalSpent: 1250000000,
      lastOrder: '3 days ago',
    },
    {
      id: 'c_4',
      name: 'Tunde & Sarah Folawiyo',
      email: 's.folawiyo@residence.ng',
      phone: '+234 805 771 2000',
      tier: 'Private Client',
      ordersCount: 2,
      totalSpent: 410000000,
      lastOrder: '1 week ago',
    },
  ];

  const isAuthorized = user?.role === 'admin' || isAdminDemoUnlocked;

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.material.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Handle Status Change on Order
  const handleOrderStatusChange = (orderId: string, nextStatus: Order['fulfillmentStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, fulfillmentStatus: nextStatus } : o))
    );
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      _id: 'prod_' + Date.now(),
      name: newProduct.name,
      slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      category: newProduct.category as Product['category'],
      categoryLabel: newProduct.categoryLabel,
      collections: ['contemporary-signatures'],
      price: Number(newProduct.price),
      compareAtPrice: Number(newProduct.compareAtPrice),
      images: [{ url: newProduct.imageUrl, alt: newProduct.name, isPrimary: true }],
      material: newProduct.material,
      color: newProduct.color,
      dimensions: {
        width: Number(newProduct.width),
        depth: Number(newProduct.depth),
        height: Number(newProduct.height),
        unit: 'cm',
      },
      variants: [
        {
          id: 'v_1',
          name: newProduct.color,
          sku: `FL-${newProduct.category.toUpperCase().slice(0, 3)}-01`,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        },
      ],
      sku: `FL-${newProduct.category.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      stock: Number(newProduct.stock),
      isPublished: true,
      isFeatured: newProduct.isFeatured,
      isBestseller: newProduct.isBestseller,
      isNewArrival: newProduct.isNewArrival,
      rating: 5.0,
      reviewCount: 1,
      description: newProduct.description,
      details: ['Handcrafted solid timber joinery', 'Hand-finished organic wax coat', 'Precision architectural tolerances'],
      careInstructions: ['Wipe gently with damp lint-free cloth', 'Apply organic beeswax yearly', 'Avoid prolonged harsh direct sunlight'],
      warrantyInfo: '10-year structural warranty on internal solid timber framing and joinery.',
      deliveryEstimate: '3–5 Business Days via White-Glove Courier',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [created, ...prev]);
    setIsAddProductModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you wish to decommission this architectural piece from the catalog?')) {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  // Toggle feature flag
  const handleToggleFeatured = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  /* ──────────────────────────────────────────────────────────────────────────
     SECURITY LOCK GATE (If not signed in as admin & not unlocked demo)
     ────────────────────────────────────────────────────────────────────────── */
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-forme-ivory py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-forme-cream shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 mx-auto flex items-center justify-center border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-editorial font-semibold text-forme-terracotta">
              Restricted Operations
            </span>
            <h1 className="font-serif text-3xl text-forme-charcoal">
              Atelier Director Gateway
            </h1>
            <p className="text-xs text-forme-charcoal/70 font-sans">
              The FORME Atelier Operating System is reserved for lead curators, production architects, and inventory management.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => setIsAdminDemoUnlocked(true)}
              className="w-full py-3.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-forme-terracotta" />
              <span>Unlock Admin Showcase Mode</span>
            </button>

            <Link
              to="/account"
              className="block w-full py-2.5 border border-forme-cream text-forme-charcoal text-xs uppercase tracking-editorial hover:bg-forme-cream/50 transition-colors"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
     AUTHORIZED ATELIER OPERATING SYSTEM DASHBOARD
     ────────────────────────────────────────────────────────────────────────── */
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 1250000000;

  return (
    <div className="min-h-screen bg-forme-ivory">
      {/* Executive Command Header */}
      <header className="bg-white border-b border-forme-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="group flex flex-col items-start">
              <span className="font-serif text-xl tracking-widest text-forme-charcoal">
                FORME
              </span>
              <span className="text-[8px] uppercase tracking-editorial text-forme-taupe -mt-1 font-mono">
                ATELIER OS v2.5
              </span>
            </Link>
            <span className="hidden sm:inline-block w-px h-6 bg-forme-cream" />
            <span className="hidden sm:inline-block text-xs uppercase tracking-editorial text-forme-olive font-semibold font-mono">
              Production & Logistics HQ
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-editorial text-forme-taupe hover:text-forme-charcoal flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>
            <div className="flex items-center space-x-2 pl-2 border-l border-forme-cream">
              <div className="w-7 h-7 rounded-full bg-forme-charcoal text-white flex items-center justify-center text-xs font-serif font-bold">
                AD
              </div>
              <span className="text-xs font-medium text-forme-charcoal hidden md:inline">
                Atelier Director
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Executive Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-forme-cream space-x-8 text-xs uppercase tracking-editorial font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'overview'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'catalog'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalog & Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commissions & Logistics ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3.5 flex items-center space-x-2 transition-colors border-b-2 shrink-0 ${
              activeTab === 'clients'
                ? 'border-forme-charcoal text-forme-charcoal font-semibold'
                : 'border-transparent text-forme-taupe hover:text-forme-charcoal'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client & Studio Directory ({clients.length})</span>
          </button>
        </div>

        {/* ── TAB 1: EXECUTIVE OVERVIEW ────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Metric Key Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-forme-cream shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-forme-taupe font-mono">
                  <span>Gross Commissions</span>
                  <DollarSign className="w-4 h-4 text-forme-olive" />
                </div>
                <div className="font-serif text-2xl text-forme-charcoal font-semibold">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-forme-olive font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+28.4% vs last calendar month</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-forme-cream shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-forme-taupe font-mono">
                  <span>Active Commissions</span>
                  <ShoppingBag className="w-4 h-4 text-forme-terracotta" />
                </div>
                <div className="font-serif text-2xl text-forme-charcoal font-semibold">
                  {orders.length} In Pipeline
                </div>
                <div className="text-[11px] text-forme-taupe">
                  <span>2 in QC & Crating, 1 In Transit</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-forme-cream shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-forme-taupe font-mono">
                  <span>Curated Signatures</span>
                  <Package className="w-4 h-4 text-forme-charcoal" />
                </div>
                <div className="font-serif text-2xl text-forme-charcoal font-semibold">
                  {products.length} Active Pieces
                </div>
                <div className="text-[11px] text-forme-olive font-medium">
                  <span>100% Sourced Sustainable Wood</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-forme-cream shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-forme-taupe font-mono">
                  <span>Private Client Circle</span>
                  <Users className="w-4 h-4 text-forme-olive" />
                </div>
                <div className="font-serif text-2xl text-forme-charcoal font-semibold">
                  {clients.length} Architectural Studios
                </div>
                <div className="text-[11px] text-forme-taupe">
                  <span>Lagos & Abuja High-Net-Worth</span>
                </div>
              </div>
            </div>

            {/* Quick Overview Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left 8 Cols: Recent Commissions */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 border border-forme-cream shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-forme-cream pb-3">
                  <h3 className="font-serif text-xl text-forme-charcoal">
                    Recent Architectural Commissions
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-forme-terracotta hover:underline font-medium uppercase tracking-editorial"
                  >
                    View All Commissions →
                  </button>
                </div>

                <div className="divide-y divide-forme-cream">
                  {orders.map((o) => (
                    <div key={o._id} className="py-3.5 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-serif text-sm font-semibold text-forme-charcoal">
                          {o.customer.name}
                        </p>
                        <p className="font-mono text-forme-taupe">{o.orderNumber}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-forme-charcoal">{formatPrice(o.total)}</p>
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full bg-forme-cream text-forme-olive">
                          {o.fulfillmentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 4 Cols: Quick Actions & Inventory Health */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 border border-forme-cream shadow-sm space-y-4">
                  <h3 className="font-serif text-lg text-forme-charcoal">Atelier Direct Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setActiveTab('catalog'); setIsAddProductModalOpen(true); }}
                      className="w-full py-2.5 px-4 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Commission New Piece</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2.5 px-4 border border-forme-cream text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream/50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch White-Glove Courier</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 border border-forme-cream shadow-sm space-y-3">
                  <h3 className="font-serif text-lg text-forme-charcoal">Wood & Stone Reserve</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-forme-charcoal">
                      <span>Roman Travertine (Honed)</span>
                      <span className="font-mono text-forme-olive font-semibold">14 Slabs</span>
                    </div>
                    <div className="flex justify-between text-forme-charcoal">
                      <span>Nigerian Black Walnut</span>
                      <span className="font-mono text-forme-olive font-semibold">22 Logs</span>
                    </div>
                    <div className="flex justify-between text-forme-charcoal">
                      <span>Belgian Bouclé Rolls</span>
                      <span className="font-mono text-amber-700 font-semibold">3 Rolls (Reserve)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PRODUCT CATALOG MANAGEMENT ───────────────────────────── */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter and Commission Button Bar */}
            <div className="bg-white p-6 border border-forme-cream shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 items-center space-x-3 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-forme-taupe" />
                  <input
                    type="text"
                    placeholder="Search signatures by name, SKU, or timber..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-forme-cream text-xs outline-none focus:border-forme-charcoal"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-forme-cream text-xs outline-none bg-white text-forme-charcoal"
                >
                  <option value="all">All Categories</option>
                  <option value="sofas">Sofas</option>
                  <option value="dining">Dining</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="tables">Tables</option>
                  <option value="lighting">Lighting</option>
                  <option value="accents">Accents</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-5 py-2.5 bg-forme-charcoal text-white text-xs uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors flex items-center justify-center space-x-2 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Commission New Piece</span>
              </button>
            </div>

            {/* Catalog Table */}
            <div className="bg-white border border-forme-cream shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-forme-ivory/80 border-b border-forme-cream uppercase tracking-editorial text-[10px] text-forme-taupe">
                  <tr>
                    <th className="py-3 px-4">Signature Piece</th>
                    <th className="py-3 px-4">SKU & Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status & Flags</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forme-cream">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-forme-cream/20 transition-colors">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-sm border border-forme-cream shrink-0"
                        />
                        <div>
                          <p className="font-serif text-sm font-semibold text-forme-charcoal leading-snug">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-forme-taupe truncate max-w-xs">
                            {product.material}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-mono text-forme-charcoal">{product.sku}</p>
                        <p className="text-[11px] text-forme-taupe capitalize">{product.category}</p>
                      </td>

                      <td className="py-3 px-4 font-semibold text-forme-charcoal">
                        {formatPrice(product.price)}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-mono font-medium ${product.stock <= 3 ? 'text-rose-600' : 'text-forme-olive'}`}>
                          {product.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4 space-x-1.5">
                        <button
                          onClick={() => handleToggleFeatured(product._id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold font-mono ${
                            product.isFeatured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-forme-cream text-forme-taupe hover:text-forme-charcoal'
                          }`}
                        >
                          {product.isFeatured ? '★ Featured' : 'Not Featured'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="p-1.5 text-forme-taupe hover:text-forme-charcoal inline-block"
                          title="View on Storefront"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1.5 text-forme-taupe hover:text-rose-600 transition-colors"
                          title="Decommission piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Product Modal */}
            {isAddProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forme-charcoal/60 backdrop-blur-sm">
                <div className="bg-white p-8 max-w-2xl w-full border border-forme-cream shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
                  <div className="flex justify-between items-center border-b border-forme-cream pb-3">
                    <h3 className="font-serif text-2xl text-forme-charcoal">Commission New Piece</h3>
                    <button
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="text-forme-taupe hover:text-forme-charcoal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                        Piece Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Zaha Floating Travertine Console Table"
                        className="w-full px-3 py-2 border border-forme-cream outline-none focus:border-forme-charcoal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                          Category *
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full px-3 py-2 border border-forme-cream outline-none bg-white"
                        >
                          <option value="sofas">Sofas & Lounges</option>
                          <option value="dining">Dining & Chairs</option>
                          <option value="bedroom">Bedroom Suites</option>
                          <option value="tables">Tables & Consoles</option>
                          <option value="lighting">Lighting</option>
                          <option value="accents">Accents</option>
                        </select>
                      </div>

                      <div>
                        <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                          Retail Price in Kobo (e.g. 185000000 = ₦1,850,000) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-forme-cream outline-none focus:border-forme-charcoal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                          Materiality *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.material}
                          onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                          placeholder="Honed Roman Travertine & Smoked Brass"
                          className="w-full px-3 py-2 border border-forme-cream outline-none focus:border-forme-charcoal"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                          Atelier Inventory Reserve (Units) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-forme-cream outline-none focus:border-forme-charcoal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                        High-Resolution Editorial Image URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-forme-cream outline-none focus:border-forme-charcoal"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-editorial text-forme-charcoal font-medium mb-1">
                        Architectural Description
                      </label>
                      <textarea
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full px-3 py-2 border border-forme-cream outline-none focus:border-forme-charcoal"
                      />
                    </div>

                    <div className="flex space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddProductModalOpen(false)}
                        className="flex-1 py-3 border border-forme-cream uppercase tracking-editorial font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-forme-charcoal text-white uppercase tracking-editorial font-medium hover:bg-forme-olive transition-colors"
                      >
                        Publish Piece to Atelier
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: COMMISSIONS & LOGISTICS ──────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-forme-cream shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-forme-ivory/80 border-b border-forme-cream uppercase tracking-editorial text-[10px] text-forme-taupe">
                  <tr>
                    <th className="py-3 px-4">Commission Reference</th>
                    <th className="py-3 px-4">Client Details</th>
                    <th className="py-3 px-4">Purchased Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                    <th className="py-3 px-4 text-right">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forme-cream">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-forme-cream/20 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-mono font-bold text-forme-charcoal">{order.orderNumber}</p>
                        <p className="text-[11px] text-forme-taupe">
                          {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-forme-charcoal">{order.customer.name}</p>
                        <p className="text-[11px] text-forme-taupe">{order.customer.email}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-forme-charcoal">
                          {order.items.length} {order.items.length === 1 ? 'Piece' : 'Pieces'}
                        </p>
                        <p className="text-[11px] text-forme-taupe truncate max-w-xs">
                          {order.items[0]?.name}
                        </p>
                      </td>

                      <td className="py-3 px-4 font-semibold text-forme-charcoal">
                        {formatPrice(order.total)}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) =>
                            handleOrderStatusChange(order._id, e.target.value as Order['fulfillmentStatus'])
                          }
                          className="px-2.5 py-1 border border-forme-cream text-xs rounded-sm bg-white font-medium text-forme-charcoal outline-none focus:border-forme-charcoal"
                        >
                          <option value="unfulfilled">Unfulfilled</option>
                          <option value="processing">Atelier QC & Crating</option>
                          <option value="shipped">White-Glove Dispatched</option>
                          <option value="delivered">Delivered & Installed</option>
                          <option value="cancelled">Commission Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="px-3 py-1.5 border border-forme-cream text-forme-charcoal text-[11px] uppercase tracking-editorial font-medium hover:bg-forme-cream transition-colors"
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Inspection Dossier Modal */}
            {inspectingOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forme-charcoal/60 backdrop-blur-sm">
                <div className="bg-white p-8 max-w-2xl w-full border border-forme-cream shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
                  <div className="flex justify-between items-start border-b border-forme-cream pb-4">
                    <div>
                      <h3 className="font-serif text-2xl text-forme-charcoal">Commission Logistics Dossier</h3>
                      <p className="text-xs font-mono text-forme-taupe">{inspectingOrder.orderNumber}</p>
                    </div>
                    <button
                      onClick={() => setInspectingOrder(null)}
                      className="text-forme-taupe hover:text-forme-charcoal text-xs uppercase tracking-editorial"
                    >
                      Close [✕]
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-forme-ivory p-4 border border-forme-cream">
                    <div>
                      <span className="text-forme-taupe uppercase font-semibold block mb-1">
                        Commission Client
                      </span>
                      <p className="font-semibold text-forme-charcoal">{inspectingOrder.customer.name}</p>
                      <p>{inspectingOrder.customer.email}</p>
                      <p>{inspectingOrder.customer.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="text-forme-taupe uppercase font-semibold block mb-1">
                        White-Glove Destination
                      </span>
                      <p className="font-semibold text-forme-charcoal">
                        {inspectingOrder.shippingAddress.streetAddress}
                      </p>
                      {inspectingOrder.shippingAddress.apartment && (
                        <p>{inspectingOrder.shippingAddress.apartment}</p>
                      )}
                      <p>
                        {inspectingOrder.shippingAddress.city}, {inspectingOrder.shippingAddress.state}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-serif text-lg text-forme-charcoal">Commissioned Pieces</h4>
                    <div className="divide-y divide-forme-cream">
                      {inspectingOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between text-xs">
                          <div>
                            <p className="font-semibold text-forme-charcoal">{item.name}</p>
                            {item.variantName && <p className="text-forme-olive">{item.variantName}</p>}
                            <p className="text-forme-taupe">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">{formatPrice(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-forme-cream text-sm font-semibold">
                    <span>Total Remittance</span>
                    <span>{formatPrice(inspectingOrder.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: CLIENT & STUDIO DIRECTORY ────────────────────────────── */}
        {activeTab === 'clients' && (
          <div className="bg-white border border-forme-cream shadow-sm overflow-x-auto animate-fade-in">
            <table className="w-full text-left text-xs">
              <thead className="bg-forme-ivory/80 border-b border-forme-cream uppercase tracking-editorial text-[10px] text-forme-taupe">
                <tr>
                  <th className="py-3 px-4">Private Client / Practice</th>
                  <th className="py-3 px-4">Contact Coordinates</th>
                  <th className="py-3 px-4">Membership Tier</th>
                  <th className="py-3 px-4">Lifetime Commissions</th>
                  <th className="py-3 px-4">Orders Count</th>
                  <th className="py-3 px-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forme-cream">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-forme-cream/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-serif text-sm font-semibold text-forme-charcoal">
                        {client.name}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-forme-charcoal">{client.email}</p>
                      <p className="text-forme-taupe font-mono text-[11px]">{client.phone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold font-mono bg-forme-cream text-forme-olive">
                        {client.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-forme-charcoal">
                      {formatPrice(client.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-forme-charcoal">
                      {client.ordersCount} Commissions
                    </td>

                    <td className="py-3.5 px-4 text-forme-taupe text-[11px]">
                      {client.lastOrder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
