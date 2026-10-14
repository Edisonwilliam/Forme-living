import { Request, Response, NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/AppError';

// Extend Express Request to carry authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Try Authorization header first, then cookie
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.forme_token) {
      token = req.cookies.forme_token as string;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in to continue.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Invalid or expired session. Please log in again.', 401));
  }
}

export function authorizeAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Access denied. Administrator privileges required.', 403));
  }
  next();
}

// Optional auth — attaches user if token present but doesn't block
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.forme_token) {
      token = req.cookies.forme_token as string;
    }
    if (token) {
      req.user = verifyToken(token);
    }
  } catch {
    // silently ignore — user just isn't authenticated
  }
  next();
}
