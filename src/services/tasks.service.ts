import type { Prisma, Task } from '@prisma/client';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from '../schemas/task.schemas';

export type TaskResponse = {
  id: string;
  title: string;
  description: string | null;
  status: Task['status'];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedTasks = {
  data: TaskResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function toTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export class TasksService {
  async list(query: ListTasksQuery): Promise<PaginatedTasks> {
    const { page, limit, status } = query;
    const where: Prisma.TaskWhereInput = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [total, tasks] = await prisma.$transaction([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: tasks.map(toTaskResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string): Promise<TaskResponse> {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundError('Task', id);
    }

    return toTaskResponse(task);
  }

  async create(input: CreateTaskInput): Promise<TaskResponse> {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        status: input.status,
      },
    });

    return toTaskResponse(task);
  }

  async update(id: string, input: UpdateTaskInput): Promise<TaskResponse> {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
        },
      });

      return toTaskResponse(task);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new NotFoundError('Task', id);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.task.delete({ where: { id } });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new NotFoundError('Task', id);
      }
      throw error;
    }
  }
}

export const tasksService = new TasksService();
