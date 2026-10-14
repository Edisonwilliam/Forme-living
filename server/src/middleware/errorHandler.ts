import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';
import { env } from '../config/environment';
import { AppError } from '../utils/AppError';

// Re-export for convenience (backwards compat)
export type { AppError };

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod schema validation errors
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 422, formatted);
    return;
  }

  // Mongoose duplicate key error (code 11000)
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    sendError(res, `A record with this ${field} already exists`, 409);
    return;
  }

  // Mongoose invalid ObjectId / CastError
  if (err.name === 'CastError') {
    sendError(res, `Invalid resource identifier format`, 400);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authentication token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Authentication token has expired', 401);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  if (env.NODE_ENV === 'development') {
    console.error('Unhandled Application Error:', err);
  }

  sendError(
    res,
    message,
    statusCode,
    env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
}
