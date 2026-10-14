import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message = 'Operation successful',
  statusCode = 200,
  meta?: ApiResponse['meta']
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  errors?: any
): Response {
  const body: ApiResponse = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };
  return res.status(statusCode).json(body);
}
