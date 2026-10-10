import { Router } from 'express';
import { healthRouter } from './health.routes';
import { tasksRouter } from './tasks.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/api/v1/tasks', tasksRouter);
