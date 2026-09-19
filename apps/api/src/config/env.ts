import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().default('file:./dev.db'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LLM_PROVIDER: z.enum(['universal', 'mock', 'gemini']).default('gemini'),
  LLM_BASE_URL: z.string().optional(),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default('gemini-3.5-flash'),
  GEMINI_MODEL: z.string().default('gemini-3.5-flash'),
  GEMINI_API_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
