import mongoose, { Document, Schema } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    variantId: { type: String },
    variantName: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const AddressSnapshotSchema = new Schema(
  {
    fullName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String },
    phoneNumber: { type: String, required: true },
  },
  { _id: false }
);

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    userId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
  };
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paystackReference?: string;
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    phoneNumber: string;
  };
  trackingNumber?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `FL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    },
    customer: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phoneNumber: { type: String, required: true },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, uppercase: true },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'NGN' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'unfulfilled',
    },
    paystackReference: { type: String },
    shippingAddress: { type: AddressSnapshotSchema, required: true },
    trackingNumber: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_doc, ret: Record<string, unknown>) => { delete ret['__v']; return ret; } },
  }
);

OrderSchema.index({ 'customer.userId': 1 });
OrderSchema.index({ paymentStatus: 1, fulfillmentStatus: 1 });
OrderSchema.index({ paystackReference: 1 }, { sparse: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
