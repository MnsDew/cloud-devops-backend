import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  void healthController.live(req, res);
});

healthRouter.get('/ready', (req, res) => {
  void healthController.ready(req, res);
});
