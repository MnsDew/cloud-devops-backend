import { describe, expect, it } from 'vitest';
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from '../src/schemas/task.schemas';

describe('task schemas', () => {
  it('accepts a valid create payload', () => {
    const result = createTaskSchema.safeParse({
      title: 'Write docs',
      description: 'Draft architecture notes',
      status: 'TODO',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createTaskSchema.safeParse({ title: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty update payload', () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('clamps list query defaults and enforces max limit', () => {
    const defaults = listTasksQuerySchema.parse({});
    expect(defaults.page).toBe(1);
    expect(defaults.limit).toBe(20);

    const tooLarge = listTasksQuerySchema.safeParse({ limit: 101 });
    expect(tooLarge.success).toBe(false);
  });
});
