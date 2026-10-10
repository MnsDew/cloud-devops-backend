# Project Plan

## Objectives

Build a production-oriented Task Management REST API that demonstrates:

1. Professional backend structure and TypeScript practices.
2. Database modeling, migrations, and validation.
3. Automated testing and CI.
4. Containerized local development.
5. A clear, documented path to deploy and monitor the API on Oracle Cloud Infrastructure (OCI).

## Scope (initial 2–3 weeks)

**In scope**

- Task CRUD API with pagination and consistent error responses.
- PostgreSQL + Prisma migrations.
- Docker Compose for local API + database.
- GitHub Actions CI (lint, typecheck, test, build).
- Documentation for architecture, testing, deployment roadmap, and learning notes.

**Out of scope (unless later required)**

- Authentication / authorization
- Redis, message queues, microservices
- Kubernetes
- Automatic cloud provisioning
- Claiming production readiness before checks and deployment verification pass

## Technical architecture (summary)

Client → Express API → Prisma → PostgreSQL

Supporting concerns: Zod validation, Helmet/CORS, Pino logging, health/readiness probes, graceful shutdown.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for diagrams and data model details.

## Milestones and acceptance criteria

| Milestone | Target | Acceptance criteria |
|-----------|--------|---------------------|
| M1 — Scaffold | Days 1–2 | Repo structure, strict TS, env validation, health endpoints, docs stubs |
| M2 — Tasks API | Days 2–5 | Full CRUD + Prisma schema/migrations + validation + error handling |
| M3 — Tests & CI | Days 5–8 | Vitest/Supertest coverage for happy path + invalid/missing cases; CI green |
| M4 — Docker | Days 8–10 | Multi-stage Dockerfile + Compose with persistent Postgres + healthchecks |
| M5 — OCI prep | Days 10–14 | Deployment docs/scripts for Ubuntu VM, Nginx, HTTPS, backups, rollback |
| M6 — OCI deploy | Later | Deployed and verified on OCI (not claimed complete until done) |

## Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental commit of secrets | High | `.gitignore`, placeholders in `.env.example`, review before push |
| Parent home-directory Git repo | Medium | Keep a dedicated `.git` inside this project only |
| Local Postgres unavailable for tests | Medium | Compose service + documented setup; CI provides Postgres service |
| Scope creep (auth, K8s, etc.) | Medium | Explicit out-of-scope list; add only with documented need |
| Overstating production readiness | High | Record only verified test/deploy outcomes in logs |

## Success definition for internship demo

- Working API with clear docs and CI evidence.
- Demonstrable understanding of backend + DevOps trade-offs.
- Honest development log with no fabricated progress.
