# Contributing

This repository is an internship engineering project. Prefer small, reviewable changes with verified results.

## Workflow

1. Create or update a branch for one milestone.
2. Implement the change with tests where practical.
3. Run local checks before opening a pull request:
   - `npm run lint`
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
4. Update `docs/DEVELOPMENT_LOG.md` with what was actually done.
5. Open a PR when the checks pass.

## Commit style

Use short conventional commits, for example:

- `chore: initialize TypeScript backend`
- `feat: add task management endpoints`
- `test: add API integration tests`
- `build: add Docker Compose environment`
- `ci: add GitHub Actions checks`
- `docs: document OCI deployment plan`

Do not invent historical commits or backdate work.

## Environment safety

- Never commit `.env`, credentials, private keys, or production secrets.
- Keep `.env.example` limited to placeholders.
- Do not provision OCI resources from CI in the early phases.
