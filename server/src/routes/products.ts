import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { authenticate, authorizeAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

// ── GET /api/products ────────────────────────────────────────────────────────
// Supports: ?category, ?collection, ?material, ?minPrice, ?maxPrice,
//           ?isFeatured, ?isBestseller, ?isNewArrival, ?search,
//           ?sort (price_asc|price_desc|newest|rating), ?page, ?limit
router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category, collection, material, minPrice, maxPrice,
      isFeatured, isBestseller, isNewArrival, search,
      sort = 'newest', page = '1', limit = '24',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { isPublished: true };

    if (category) filter['category'] = { $in: category.split(',') };
    if (collection) filter['collections'] = { $in: collection.split(',') };
    if (material) filter['material'] = { $in: material.split(',') };
    if (isFeatured === 'true') filter['isFeatured'] = true;
    if (isBestseller === 'true') filter['isBestseller'] = true;
    if (isNewArrival === 'true') filter['isNewArrival'] = true;

    if (minPrice || maxPrice) {
      filter['price'] = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    if (search) {
      filter['$text'] = { $search: search };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1, reviewCount: -1 },
    };
    const sortQuery = sortMap[sort] ?? sortMap['newest'];

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(48, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortQuery).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, products, 'Products retrieved.', 200, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/products/:slug ──────────────────────────────────────────────────
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true }).lean();
    if (!product) throw new AppError('Product not found.', 404);
    sendSuccess(res, product, 'Product retrieved.');
  } catch (err) {
    next(err);
  }
});

// ── POST /api/products (Admin only) ─────────────────────────────────────────
router.post('/', authenticate, authorizeAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    sendSuccess(res, product, 'Product created.', 201);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/products/:id (Admin only) ──────────────────────────────────────
router.put('/:id', authenticate, authorizeAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!product) throw new AppError('Product not found.', 404);
    sendSuccess(res, product, 'Product updated.');
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/products/:id (Admin only) ───────────────────────────────────
router.delete('/:id', authenticate, authorizeAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );
    if (!product) throw new AppError('Product not found.', 404);
    sendSuccess(res, null, 'Product unpublished.');
  } catch (err) {
    next(err);
  }
});

// ── GET /api/products/:productId/reviews ─────────────────────────────────────
router.get('/:productId/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Review } = await import('../models/Review');
    const reviews = await Review.find({
      productId: req.params.productId,
      isApproved: true,
    }).sort({ createdAt: -1 }).lean();
    sendSuccess(res, reviews, 'Reviews retrieved.');
  } catch (err) {
    next(err);
  }
});

// ── POST /api/products/:productId/reviews ─────────────────────────────────────
const ReviewSchema = z.object({
  authorName: z.string().min(2).max(80),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(2000),
});

router.post('/:productId/reviews', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Review } = await import('../models/Review');
    const product = await Product.findById(req.params.productId);
    if (!product) throw new AppError('Product not found.', 404);

    const data = ReviewSchema.parse(req.body);
    const review = await Review.create({
      ...data,
      productId: req.params.productId,
      userId: req.user?.id,
      isVerifiedPurchase: false,
    });
    sendSuccess(res, review, 'Review submitted. Thank you!', 201);
  } catch (err) {
    next(err);
  }
});

export default router;
