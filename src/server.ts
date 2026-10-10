import { createApp } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';
import { disconnectPrisma } from './lib/prisma';

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(
    { host: env.HOST, port: env.PORT, env: env.NODE_ENV },
    'server.started',
  );
});

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  logger.info({ signal }, 'server.shutdown_started');

  server.close(async (closeError) => {
    if (closeError) {
      logger.error({ err: closeError }, 'server.close_failed');
    }

    try {
      await disconnectPrisma();
      logger.info('prisma.disconnected');
      process.exit(closeError ? 1 : 0);
    } catch (error) {
      logger.error({ err: error }, 'prisma.disconnect_failed');
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('server.shutdown_timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'process.unhandled_rejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'process.uncaught_exception');
  void shutdown('uncaughtException');
});
