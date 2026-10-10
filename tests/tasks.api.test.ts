import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { disconnectPrisma } from '../src/lib/prisma';
import { resetDatabase } from './helpers';

const app = createApp();

describe('tasks API', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('creates, lists, retrieves, updates, and deletes a task', async () => {
    const created = await request(app).post('/api/v1/tasks').send({
      title: 'Ship MVP',
      description: 'Deliver the first milestone',
    });

    expect(created.status).toBe(201);
    expect(created.body.data.title).toBe('Ship MVP');
    expect(created.body.data.status).toBe('TODO');

    const taskId = created.body.data.id as string;

    const listed = await request(app).get('/api/v1/tasks');
    expect(listed.status).toBe(200);
    expect(listed.body.data).toHaveLength(1);
    expect(listed.body.meta.total).toBe(1);

    const fetched = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.data.id).toBe(taskId);

    const updated = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .send({ status: 'IN_PROGRESS' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('IN_PROGRESS');

    const deleted = await request(app).delete(`/api/v1/tasks/${taskId}`);
    expect(deleted.status).toBe(204);

    const missing = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe('NOT_FOUND');
  });

  it('rejects invalid create payloads', async () => {
    const response = await request(app).post('/api/v1/tasks').send({
      title: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid task ids', async () => {
    const response = await request(app).get('/api/v1/tasks/not-a-uuid');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 for unknown task ids', async () => {
    const response = await request(app).get(
      '/api/v1/tasks/11111111-1111-1111-1111-111111111111',
    );

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('supports pagination limits', async () => {
    for (let i = 0; i < 3; i += 1) {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: `Task ${i + 1}` });
      expect(response.status).toBe(201);
    }

    const page = await request(app).get('/api/v1/tasks?page=1&limit=2');
    expect(page.status).toBe(200);
    expect(page.body.data).toHaveLength(2);
    expect(page.body.meta.total).toBe(3);
    expect(page.body.meta.totalPages).toBe(2);
  });
});
