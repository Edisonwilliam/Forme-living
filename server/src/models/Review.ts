import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_doc, ret: Record<string, unknown>) => { delete ret['__v']; return ret; } },
  }
);

// After save/delete — update product's aggregated rating
async function updateProductRating(productId: mongoose.Types.ObjectId) {
  const stats = await Review.aggregate([
    { $match: { productId, isApproved: true } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const { Product } = await import('./Product');
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
  }
}

ReviewSchema.post('save', async function () {
  await updateProductRating(this.productId);
});

ReviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await updateProductRating(this.productId);
});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
