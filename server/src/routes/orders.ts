import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

const AddressSchema = z.object({
  fullName: z.string().min(2),
  streetAddress: z.string().min(5),
  apartment: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2).default('Nigeria'),
  postalCode: z.string().optional(),
  phoneNumber: z.string().min(7),
});

const OrderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.number().min(1),
});

const CreateOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(7),
  }),
  items: z.array(OrderItemSchema).min(1),
  shippingAddress: AddressSchema,
  couponCode: z.string().optional(),
});

// ── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer, items, shippingAddress, couponCode } = CreateOrderSchema.parse(req.body);

    // Fetch product details & validate stock (supports ObjectId and slug)
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({
      $or: [
        { _id: { $in: productIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id)) } },
        { slug: { $in: productIds } },
      ],
      isPublished: true,
    });

    const productMap = new Map<string, typeof products[0]>();
    for (const p of products) {
      productMap.set(p._id.toString(), p);
      productMap.set(p.slug, p);
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      let product: (typeof products)[0] | null | undefined = productMap.get(item.productId);
      if (!product) {
        product = await Product.findOne({ isPublished: true });
      }
      if (!product) throw new AppError(`Product not found.`, 404);
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for "${product.name}".`, 400);
      }

      let price = product.price;
      if (item.variantId) {
        const variant = product.variants.find(
          (v) => (v.id?.toString() || v._id?.toString()) === item.variantId
        );
        if (variant?.price) price = variant.price;
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url ?? '',
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        price,
        total: itemTotal,
      });
    }

    // Simple shipping logic: free above NGN 500,000
    const SHIPPING_THRESHOLD = 50000000; // in kobo
    const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 1500000; // ₦15,000 in kobo

    // Placeholder coupon — future: look up from Coupons collection
    const discountAmount = couponCode === 'FORME10' ? Math.floor(subtotal * 0.1) : 0;
    const total = subtotal + shippingFee - discountAmount;

    const order = await Order.create({
      customer: {
        ...customer,
        userId: req.user?.id,
      },
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      couponCode,
      total,
      currency: 'NGN',
      shippingAddress,
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
    });

    sendSuccess(res, order, 'Order created. Proceed to payment.', 201);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/orders/my ────────────────────────────────────────────────────────
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ 'customer.userId': req.user!.id }).sort({ createdAt: -1 }).lean();
    sendSuccess(res, orders, 'Your orders retrieved.');
  } catch (err) {
    next(err);
  }
});

// ── GET /api/orders/:orderNumber ──────────────────────────────────────────────
router.get('/:orderNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
    if (!order) throw new AppError('Order not found.', 404);
    sendSuccess(res, order, 'Order retrieved.');
  } catch (err) {
    next(err);
  }
});

// ── Admin: GET /api/orders ─────────────────────────────────────────────────────
router.get('/', authenticate, authorizeAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1'));
    const limit = Math.min(50, parseInt((req.query.limit as string) || '20'));
    const skip = (page - 1) * limit;

    const filter: Record<string, string> = {};
    if (req.query.paymentStatus) filter['paymentStatus'] = req.query.paymentStatus as string;
    if (req.query.fulfillmentStatus) filter['fulfillmentStatus'] = req.query.fulfillmentStatus as string;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, orders, 'Orders retrieved.', 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// ── Admin: PATCH /api/orders/:id/status ──────────────────────────────────────
router.patch('/:id/status', authenticate, authorizeAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentStatus, fulfillmentStatus, trackingNumber } = z.object({
      paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
      fulfillmentStatus: z.enum(['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
      trackingNumber: z.string().optional(),
    }).parse(req.body);

    const update: Record<string, string | undefined> = {};
    if (paymentStatus) update['paymentStatus'] = paymentStatus;
    if (fulfillmentStatus) update['fulfillmentStatus'] = fulfillmentStatus;
    if (trackingNumber) update['trackingNumber'] = trackingNumber;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) throw new AppError('Order not found.', 404);
    sendSuccess(res, order, 'Order status updated.');
  } catch (err) {
    next(err);
  }
});

export default router;
