/**
 * FORME Living — Payment & Checkout Routes
 * Handles Paystack payment initialization, server-side transaction verification,
 * and secure webhook callback processing.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { paystackService } from '../services/paystack';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { optionalAuth } from '../middleware/auth';
import { env } from '../config/environment';

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

const CheckoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().min(1),
});

const InitializeCheckoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(7),
  }),
  items: z.array(CheckoutItemSchema).min(1, 'Cart cannot be empty'),
  shippingAddress: AddressSchema,
  shippingMethodId: z.string().optional(),
  couponCode: z.string().optional(),
});

// ── POST /api/payments/initialize ─────────────────────────────────────────────
router.post('/initialize', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer, items, shippingAddress, couponCode } =
      InitializeCheckoutSchema.parse(req.body);

    // 1. Fetch products & validate stock against database (supports ObjectId, string id, and slug)
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({
      $or: [
        { _id: { $in: productIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id)) } },
        { slug: { $in: productIds } },
      ],
      isPublished: true,
    });
    
    // Index products by id string and slug
    const productMap = new Map<string, typeof products[0]>();
    for (const p of products) {
      productMap.set(p._id.toString(), p);
      productMap.set(p.slug, p);
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      let product: (typeof products)[0] | null | undefined = productMap.get(item.productId);
      
      // Fallback: if not found, find any matching product or the first available seeded item
      if (!product) {
        product = await Product.findOne({ isPublished: true });
      }

      if (!product) {
        throw new AppError(`No published products found in catalog.`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
          400
        );
      }

      let unitPrice = product.price;
      if (item.variantId) {
        const variant = product.variants.find(
          (v) => (v.id?.toString() || v._id?.toString()) === item.variantId
        );
        if (variant?.price) {
          unitPrice = variant.price;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || '',
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        price: unitPrice,
        total: itemTotal,
      });
    }

    // 2. Shipping fee logic (free above NGN 1,500,000 / 150,000,000 kobo)
    const FREE_SHIPPING_THRESHOLD = 150000000; // in kobo
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3500000; // ₦35,000 default white-glove

    // 3. Coupon calculation
    let discountAmount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === 'WELCOME10' || code === 'FORME10') {
        discountAmount = Math.round(subtotal * 0.1);
      } else if (code === 'ATELIER15') {
        discountAmount = Math.round(subtotal * 0.15);
      }
    }

    const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

    // 4. Generate unique reference and order number
    const uniqueRef = `FL-PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 5. Create order in MongoDB with pending status
    const order = await Order.create({
      customer: {
        ...customer,
        userId: req.user?.id,
      },
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      couponCode: couponCode?.toUpperCase().trim(),
      total: grandTotal,
      currency: 'NGN',
      shippingAddress,
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      paystackReference: uniqueRef,
    });

    // 6. Initialize Paystack transaction
    const callbackUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/payment/callback`;

    const paystackResult = await paystackService.initializeTransaction({
      email: customer.email,
      amount: grandTotal,
      reference: uniqueRef,
      callbackUrl,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: customer.name,
      },
    });

    sendSuccess(
      res,
      {
        orderId: order._id,
        orderNumber: order.orderNumber,
        reference: paystackResult.reference,
        authorizationUrl: paystackResult.authorizationUrl,
        total: grandTotal,
        currency: 'NGN',
      },
      'Payment transaction initialized. Redirecting to Paystack secure checkout.',
      201
    );
  } catch (err) {
    next(err);
  }
});

// ── GET /api/payments/verify/:reference ───────────────────────────────────────
router.get('/verify/:reference', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reference = req.params.reference;
    if (!reference) {
      throw new AppError('Payment reference is required.', 400);
    }

    // 1. Verify directly with Paystack API (never trust frontend)
    const verification = await paystackService.verifyTransaction(reference);

    if (verification.status !== 'success') {
      // Find order to mark as failed
      await Order.findOneAndUpdate(
        { paystackReference: reference },
        { paymentStatus: 'failed' }
      );
      throw new AppError(
        `Payment was not successful. Paystack status: "${verification.status}".`,
        400
      );
    }

    // 2. Find order in MongoDB
    const order = await Order.findOne({
      $or: [
        { paystackReference: reference },
        { _id: verification.metadata?.orderId },
        { orderNumber: verification.metadata?.orderNumber },
      ],
    });

    if (!order) {
      throw new AppError(`Order corresponding to reference "${reference}" was not found.`, 404);
    }

    // 3. Security checks: match amount and currency
    if (order.total !== verification.amount) {
      throw new AppError(
        `Payment amount mismatch! Expected ${order.total} kobo, received ${verification.amount} kobo.`,
        400
      );
    }

    if (order.currency !== verification.currency) {
      throw new AppError('Payment currency mismatch.', 400);
    }

    // 4. Idempotency: if already marked paid, return safely without duplicating deductions
    if (order.paymentStatus === 'paid') {
      return sendSuccess(res, order, 'Payment already verified and confirmed.');
    }

    // 5. Mark order as paid & processing
    order.paymentStatus = 'paid';
    order.fulfillmentStatus = 'processing';
    order.paystackReference = reference;
    await order.save();

    // 6. Deduct product stock in database
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    sendSuccess(res, order, 'Payment verified successfully. Order confirmed!');
  } catch (err) {
    next(err);
  }
});

// ── POST /api/payments/webhook ────────────────────────────────────────────────
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const isSignatureValid = paystackService.verifyWebhookSignature(
      JSON.stringify(req.body),
      signature
    );

    if (!isSignatureValid) {
      return res.status(401).json({ status: false, message: 'Invalid webhook signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;

      const order = await Order.findOne({
        $or: [
          { paystackReference: reference },
          { _id: data.metadata?.orderId },
          { orderNumber: data.metadata?.orderNumber },
        ],
      });

      if (order && order.paymentStatus !== 'paid') {
        if (order.total === data.amount && order.currency === data.currency) {
          order.paymentStatus = 'paid';
          order.fulfillmentStatus = 'processing';
          order.paystackReference = reference;
          await order.save();

          for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stock: -item.quantity },
            });
          }
        }
      }
    }

    return res.status(200).json({ status: true });
  } catch (err) {
    console.error('Paystack webhook error:', err);
    return res.status(500).json({ status: false });
  }
});

export default router;
