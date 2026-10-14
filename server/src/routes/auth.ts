import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import { signToken, attachTokenCookie, clearTokenCookie } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { authenticate } from '../middleware/auth';
import { env } from '../config/environment';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit on auth endpoints (relaxed in development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: env.NODE_ENV === 'development' ? 100 : 10,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Validation schemas ──────────────────────────────────────────────────────
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
});

// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    attachTokenCookie(res, token);

    sendSuccess(
      res,
      { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token },
      'Welcome to FORME Living! Your account has been created.',
      201
    );
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = signToken(user);
    attachTokenCookie(res, token);

    sendSuccess(
      res,
      { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token },
      `Welcome back, ${user.name}!`
    );
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/google ───────────────────────────────────────────────────
router.post('/google', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credential } = z
      .object({
        credential: z.string().min(1, 'Google credential token is required'),
      })
      .parse(req.body);

    const googleClientId = env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new AppError(
        'Google Sign-In is not configured on the server. Please set GOOGLE_CLIENT_ID in server/.env.',
        500
      );
    }

    const client = new OAuth2Client(googleClientId);
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch (err: any) {
      throw new AppError(
        `Google credential verification failed: ${err.message || 'Invalid token'}`,
        401
      );
    }

    if (!payload) {
      throw new AppError('Invalid Google authentication payload.', 401);
    }

    const { sub: googleId, email, email_verified, name, picture } = payload;

    if (!email) {
      throw new AppError('No email address provided by Google account.', 400);
    }

    if (!email_verified) {
      throw new AppError(
        'The email associated with this Google account has not been verified by Google.',
        400
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if a user already exists with this googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    }).select('+password');

    if (user) {
      // Securely link Google authentication to existing account
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsSave = true;
      }
      if (user.password && user.authProvider !== 'both') {
        user.authProvider = 'both';
        needsSave = true;
      } else if (!user.password && user.authProvider !== 'google') {
        user.authProvider = 'google';
        needsSave = true;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        needsSave = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    } else {
      // Create new customer account automatically
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId,
        role: 'customer', // Privilege determined on backend — never elevated
        authProvider: 'google',
        isEmailVerified: true,
        avatar: picture,
      });
    }

    const token = signToken(user);
    attachTokenCookie(res, token);

    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
      `Welcome to FORME Living, ${user.name}!`
    );
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/logout ───────────────────────────────────────────────────
router.post('/logout', authenticate, (req: Request, res: Response) => {
  clearTokenCookie(res);
  sendSuccess(res, null, 'You have been logged out successfully.');
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new AppError('User account not found.', 404);
    }
    sendSuccess(res, user, 'Profile retrieved.');
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/auth/me ──────────────────────────────────────────────────────
router.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = UpdateProfileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found.', 404);
    sendSuccess(res, user, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/change-password ──────────────────────────────────────────
router.post('/change-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8)
        .regex(/[A-Z]/, 'Must contain uppercase')
        .regex(/[0-9]/, 'Must contain a number'),
    }).parse(req.body);

    const user = await User.findById(req.user!.id).select('+password');
    if (!user) throw new AppError('User not found.', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect.', 400);

    user.password = newPassword;
    await user.save();

    clearTokenCookie(res);
    sendError(res, 'Password changed. Please log in again.', 200);
  } catch (err) {
    next(err);
  }
});

export default router;
