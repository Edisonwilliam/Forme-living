import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  sendError(res, `Cannot ${req.method} ${req.originalUrl} - Route not found`, 404);
}
