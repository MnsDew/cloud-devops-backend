# Cloud-DevOps Backend API

Task Management REST API built as an internship engineering project focused on professional backend practices and a staged path to Oracle Cloud Infrastructure (OCI).

**Stack:** Node.js 20 LTS · TypeScript (strict) · Express · PostgreSQL · Prisma · Zod · Pino · Vitest · Docker · GitHub Actions · Nginx (deployment) · OCI (target)

## Features

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/health/ready` | Readiness check (includes DB) |
| GET | `/api/v1/tasks` | List tasks (pagination) |
| GET | `/api/v1/tasks/:id` | Get one task |
| POST | `/api/v1/tasks` | Create task |
| PATCH | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

## Quick start (Windows CMD)

```cmd
cd /d c:\Users\mnsso\Desktop\staj\cloud-devops-backend
copy .env.example .env
npm install
docker compose up -d db
npm run prisma:migrate:deploy
npm run dev
```

Notes:
- Local Compose maps PostgreSQL to host port **55432** (container still uses 5432) so it does not collide with local PostgreSQL installs.
- API base: `http://localhost:3000`

## Common commands

```cmd
npm run lint
npm run typecheck
npm test
npm run build
docker compose up --build
```

## Documentation

- [Project plan](docs/PROJECT_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development log](docs/DEVELOPMENT_LOG.md)
- [Testing](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Learning notes](docs/LEARNING_NOTES.md)
- [Contributing](CONTRIBUTING.md)

## Technology choices

- **Express 4** — stable, widely documented HTTP framework for a single API service.
- **Prisma** — typed ORM with first-class migrations; parameterized queries by default.
- **Zod** — runtime validation aligned with TypeScript types; used for env and request payloads.
- **Pino** — structured JSON logs suitable for later aggregation on a VM.
- **Vitest + Supertest** — fast unit/integration tests against the real Express app.
- **Docker Compose** — local PostgreSQL without paid cloud services.

## Security notes

- Secrets stay in `.env` (never committed). Use `.env.example` as the template.
- Helmet sets secure HTTP headers; CORS is env-driven; body size is limited.
- Error responses avoid leaking stack traces in production.

## License

This internship repository has no license selected yet. Add a `LICENSE` file only after you choose one intentionally.
