export interface ProductDimensions {
  width: number;
  depth: number;
  height: number;
  unit: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  stock: number;
  colorName?: string;
  colorHex?: string;
  material?: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: 'sofas' | 'beds' | 'dining' | 'workspace' | 'tables' | 'storage' | 'lighting' | 'accessories';
  categoryLabel?: string;
  collections: string[];
  price: number; // Integer in kobo (NGN 1 = 100 kobo)
  compareAtPrice?: number;
  images: ProductImage[];
  material: string;
  color: string;
  dimensions: ProductDimensions;
  variants: ProductVariant[];
  sku: string;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  details: string[];
  careInstructions: string[];
  warrantyInfo: string;
  deliveryEstimate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number; // Unit price snapshot at time of addition
}

export interface Address {
  _id?: string;
  fullName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  slug: string;
  image: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id?: string;
  _id?: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  items: OrderItemSnapshot[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paystackReference?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}
