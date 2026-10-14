import mongoose, { Document, Schema } from 'mongoose';

// ── Sub-schemas ───────────────────────────────────────────────────────────────
const DimensionsSchema = new Schema(
  {
    width: { type: Number, required: true },
    depth: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, default: 'cm' },
  },
  { _id: false }
);

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const VariantSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number },
    stock: { type: Number, default: 0 },
    colorName: { type: String },
    colorHex: { type: String },
    material: { type: String },
  },
  { _id: true }
);

// ── Main Document ─────────────────────────────────────────────────────────────
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  categoryLabel?: string;
  collections: string[];
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt: string; isPrimary?: boolean }[];
  material: string;
  color: string;
  dimensions: { width: number; depth: number; height: number; unit: string };
  variants: { _id?: mongoose.Types.ObjectId | string; id?: string; name: string; sku: string; price?: number; stock: number; colorName?: string; colorHex?: string; material?: string }[];
  sku: string;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  details: string[];
  careInstructions: string[];
  warrantyInfo: string;
  deliveryEstimate: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: {
      type: String,
      required: true,
      enum: ['sofas', 'beds', 'dining', 'workspace', 'tables', 'storage', 'lighting', 'accessories'],
    },
    categoryLabel: { type: String },
    collections: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: { type: [ImageSchema], default: [] },
    material: { type: String, required: true },
    color: { type: String, required: true },
    dimensions: { type: DimensionsSchema, required: true },
    variants: { type: [VariantSchema], default: [] },
    sku: { type: String, required: true, unique: true, uppercase: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    details: [{ type: String }],
    careInstructions: [{ type: String }],
    warrantyInfo: { type: String, default: '2 Year Manufacturer Warranty' },
    deliveryEstimate: { type: String, default: '4–6 weeks' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_doc, ret: Record<string, unknown>) => { delete ret['__v']; return ret; } },
  }
);

// Text index for search
ProductSchema.index({ name: 'text', description: 'text', material: 'text' });
ProductSchema.index({ category: 1, isPublished: 1 });
ProductSchema.index({ isFeatured: 1, isPublished: 1 });
ProductSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
