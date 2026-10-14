import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import type { IUser } from '../models/User';
import mongoose from 'mongoose';

export interface JwtPayload {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export function signToken(user: IUser | { _id: mongoose.Types.ObjectId; email: string; role: 'customer' | 'admin' }): string {
  const id = '_id' in user ? (user._id as mongoose.Types.ObjectId).toString() : (user as { id: string }).id;
  const payload: JwtPayload = { id, email: user.email, role: user.role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function attachTokenCookie(res: import('express').Response, token: string): void {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie('forme_token', token, {
    httpOnly: true,
    secure: isProduction,
    // 'none' is required for cross-site cookies (Vercel frontend → Render backend).
    // 'none' MUST be paired with secure:true, which we enforce above.
    // In dev we use 'lax' so localhost works without HTTPS.
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearTokenCookie(res: import('express').Response): void {
  const isProduction = env.NODE_ENV === 'production';
  // Must pass the same SameSite/Secure flags used when setting the cookie,
  // otherwise browsers silently ignore the clearCookie instruction.
  res.clearCookie('forme_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}
