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
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearTokenCookie(res: import('express').Response): void {
  res.clearCookie('forme_token', { httpOnly: true, path: '/' });
}
