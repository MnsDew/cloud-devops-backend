# Development Log

Rules for this file:

- Record only work that was actually performed.
- Do not invent hours, meetings, approvals, or test results.
- Leave draft entries incomplete until the work is done.

---

## 2026-10-10 — Project initialization

**Objective**

Initialize the `cloud-devops-backend` repository with a Task Management API suitable for local development, testing, and a later OCI deployment path.

**Implementation**

- Inspected empty project directory and tooling (Node 20.19.0, npm 11.1.0, Docker 28.3.2).
- Initialized a project-local Git repository (separate from the accidental Git repo in the user home directory).
- Created Express/TypeScript app structure with Zod validation, Prisma schema/migration, Helmet/CORS, Pino logging, graceful shutdown.
- Added Vitest/Supertest tests, Docker multi-stage build, Compose Postgres, GitHub Actions CI, and internship docs.
- Mapped Compose Postgres to host port `55432` after discovering local PostgreSQL 12/17 services colliding with `5432`/`5433`.

**Tests**

- `npm run lint` — pass
- `npm run typecheck` — pass
- `npm run build` — pass
- `npm test` — 11/11 pass (schemas, health, tasks CRUD/validation/pagination)

**Results**

- Local API scaffold is runnable with Compose DB + `npm run dev`.
- OCI deployment remains documentation-only (not deployed/verified yet).

**Next steps**

1. Create the first Git commit (after explicit approval).
2. Create the GitHub remote and push.
3. Confirm CI is green on GitHub.
4. Continue milestone work (hardening docs/scripts for OCI when ready).
