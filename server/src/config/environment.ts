import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/forme_living'),
  JWT_SECRET: z.string().default('forme_living_development_secret_key_1234567890'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('forme_development_cookie_secret_987654321'),
  PAYSTACK_SECRET_KEY: z.string().default('sk_test_placeholder'),
  PAYSTACK_PUBLIC_KEY: z.string().default('pk_test_placeholder'),
  CLOUDINARY_CLOUD_NAME: z.string().default('forme-living'),
  CLOUDINARY_API_KEY: z.string().default('placeholder'),
  CLOUDINARY_API_SECRET: z.string().default('placeholder'),
  EMAIL_HOST: z.string().default('smtp.mailtrap.io'),
  EMAIL_PORT: z.coerce.number().default(2525),
  EMAIL_USER: z.string().default('placeholder'),
  EMAIL_PASSWORD: z.string().default('placeholder'),
  EMAIL_FROM: z.string().default('concierge@formeliving.com'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
