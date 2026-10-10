# Learning Notes

Add entries when concepts are practiced or problems are solved. Do not invent resolutions.

## Concepts to master

- Strict TypeScript and layered Express structure (routes → controllers → services).
- Environment validation at process startup.
- Prisma migrations vs `db push` for team/CI workflows.
- Readiness vs liveness probes.
- Structured logging and secret redaction.
- Multi-stage Docker builds and non-root containers.
- CI as a gate (lint/typecheck/test/build).
- Reverse proxies, TLS termination, and least-privilege cloud networking.

## Problems encountered

| Date | Problem | Diagnosis | Resolution |
|------|---------|-----------|------------|
| 2026-10-10 | Home directory `C:\Users\mnsso` was already a Git repository | `git rev-parse` showed toplevel outside the project | Initialized a dedicated `.git` inside `cloud-devops-backend` |
| 2026-10-10 | Prisma auth failed on common Postgres ports | Local PostgreSQL 12/17 services answered instead of Compose | Compose publishes host port `55432`; `.env` uses `127.0.0.1:55432` |

## Reflections

- Environment validation and health/readiness checks made the wrong-database issue visible quickly.
- Keeping Compose on a non-default host port is a practical Windows setup detail when multiple Postgres installs exist.
