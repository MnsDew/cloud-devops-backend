import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ErrorBody = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: {
          issues: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
      },
    } satisfies ErrorBody);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
      } satisfies ErrorBody);
      return;
    }

    logger.error({ errCode: err.code }, 'prisma.known_error');
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'A database error occurred',
      },
    } satisfies ErrorBody);
    return;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error('prisma.initialization_error');
    res.status(503).json({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database is unavailable',
      },
    } satisfies ErrorBody);
    return;
  }

  logger.error(
    {
      err:
        err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack }
          : { value: String(err) },
    },
    'unhandled_error',
  );

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err instanceof Error
            ? err.message
            : 'An unexpected error occurred',
    },
  } satisfies ErrorBody);
}
