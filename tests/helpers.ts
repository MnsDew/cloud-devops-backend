import { prisma } from '../src/lib/prisma';

export async function resetDatabase(): Promise<void> {
  await prisma.task.deleteMany();
}
