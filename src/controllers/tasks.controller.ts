import type { NextFunction, Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from '../schemas/task.schemas';

export class TasksController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await tasksService.list(req.query as unknown as ListTasksQuery);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await tasksService.getById(req.params.id);
      res.status(200).json({ data: task });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await tasksService.create(req.body as CreateTaskInput);
      res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id,
        req.body as UpdateTaskInput,
      );
      res.status(200).json({ data: task });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await tasksService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const tasksController = new TasksController();
