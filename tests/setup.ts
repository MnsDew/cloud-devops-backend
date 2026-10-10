import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '.env' });

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'silent';
process.env.PORT = process.env.PORT ?? '3000';
process.env.HOST = process.env.HOST ?? '127.0.0.1';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
process.env.BODY_LIMIT = process.env.BODY_LIMIT ?? '100kb';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@127.0.0.1:55432/tasks_db?schema=public';
}
