# Testing

## Strategy

| Layer | Tooling | What it covers |
|-------|---------|----------------|
| Unit | Vitest | Zod schemas and pure validation rules |
| Integration | Vitest + Supertest | HTTP status codes, CRUD flows, pagination, 404/400 paths |
| CI | GitHub Actions | lint → typecheck → migrate → test → build against Postgres service |

Integration tests require a reachable PostgreSQL instance (local Compose or CI service container).

## Commands

```cmd
npm test
npm run test:watch
npm run lint
npm run typecheck
npm run build
```

For a clean local DB before tests:

```cmd
docker compose up -d db
set DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/tasks_db?schema=public
npx prisma migrate deploy
npm test
```

## Outcomes

Record actual results only after execution.

| Date | Command | Result | Notes |
|------|---------|--------|-------|
| 2026-10-10 | `npm run lint` | Pass | After ignoring `scripts/**` in ESLint |
| 2026-10-10 | `npm run typecheck` | Pass | Strict TypeScript |
| 2026-10-10 | `npm run build` | Pass | Emits `dist/` |
| 2026-10-10 | `npm test` | Pass — 11/11 | Required Docker Postgres on host port `55432` because local PostgreSQL 12/17 occupied common ports |
