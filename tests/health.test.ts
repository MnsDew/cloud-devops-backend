import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { disconnectPrisma, prisma } from '../src/lib/prisma';

const app = createApp();

describe('health endpoints', () => {
  afterAll(async () => {
    await disconnectPrisma();
  });

  it('GET /health returns ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('cloud-devops-backend');
  });

  it('GET /health/ready reports database connectivity', async () => {
    await prisma.$queryRaw`SELECT 1`;

    const response = await request(app).get('/health/ready');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ready');
    expect(response.body.checks.database).toBe('up');
  });
});
