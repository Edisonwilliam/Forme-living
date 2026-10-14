import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './config/environment';
import { sendSuccess } from './utils/apiResponse';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import paymentsRouter from './routes/payments';

const app: Application = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      env.CLIENT_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  sendSuccess(
    res,
    {
      status: 'healthy',
      brand: 'FORME Living',
      environment: env.NODE_ENV,
      database: dbStatusMap[dbState] || 'unknown',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'FORME Living API Service Operational'
  );
});

// Root welcome endpoint
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      brand: 'FORME Living',
      tagline: 'Contemporary Living & Architectural Furniture API',
      version: '1.0.0',
      documentation: '/api/health',
    },
    'Welcome to FORME Living Commerce API'
  );
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
