import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class HealthController {
  async live(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'ok',
      service: 'cloud-devops-backend',
      timestamp: new Date().toISOString(),
    });
  }

  async ready(_req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        status: 'ready',
        checks: {
          database: 'up',
        },
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(503).json({
        status: 'not_ready',
        checks: {
          database: 'down',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const healthController = new HealthController();
