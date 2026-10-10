import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    // Prefer .env for this helper so leftover shell variables do not point at
    // a different local PostgreSQL instance.
    process.env[key] = value;
  }
}

loadEnvFile();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const url = new URL(databaseUrl);
const host = url.hostname;
const port = Number(url.port || 5432);
const timeoutMs = Number(process.env.WAIT_FOR_DB_TIMEOUT_MS || 60_000);
const started = Date.now();

function tryConnect() {
  const socket = net.connect({ host, port });

  socket.on('connect', () => {
    socket.end();
    console.log(`Database is reachable at ${host}:${port}`);
    process.exit(0);
  });

  socket.on('error', () => {
    socket.destroy();
    if (Date.now() - started > timeoutMs) {
      console.error(`Timed out waiting for database at ${host}:${port}`);
      process.exit(1);
    }
    setTimeout(tryConnect, 1000);
  });
}

tryConnect();
