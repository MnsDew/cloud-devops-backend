import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../schemas/task.schemas';

export const tasksRouter = Router();

tasksRouter.get(
  '/',
  validate(listTasksQuerySchema, 'query'),
  (req, res, next) => {
    void tasksController.list(req, res, next);
  },
);

tasksRouter.get(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  (req, res, next) => {
    void tasksController.getById(req, res, next);
  },
);

tasksRouter.post(
  '/',
  validate(createTaskSchema, 'body'),
  (req, res, next) => {
    void tasksController.create(req, res, next);
  },
);

tasksRouter.patch(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  (req, res, next) => {
    void tasksController.update(req, res, next);
  },
);

tasksRouter.delete(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  (req, res, next) => {
    void tasksController.delete(req, res, next);
  },
);
