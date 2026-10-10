# Deployment

## 1. Local deployment (current)

### Development (API on host, DB in Docker)

```cmd
copy .env.example .env
npm install
docker compose up -d db
npm run prisma:migrate:deploy
npm run dev
```

Compose exposes Postgres on host port `55432` by default to avoid conflicts with local PostgreSQL installs on common ports.


### Full Compose (API + DB containers)

```cmd
docker compose up --build
```

Verify:

```cmd
curl http://localhost:3000/health
curl http://localhost:3000/health/ready
```

Development vs production guidance:

| Concern | Development | Production (planned) |
|---------|-------------|----------------------|
| `NODE_ENV` | `development` | `production` |
| Logging | pretty console | JSON to file/journal |
| Database | local Compose volume | managed or VM Postgres with backups |
| Secrets | `.env` file | env file with restricted permissions / secret store |
| TLS | optional | required via Nginx + trusted cert |

## 2. OCI deployment (roadmap — not complete until verified)

Do **not** treat this section as finished deployment proof. Complete each item when you actually perform it on OCI.

### Planned steps

1. **Compute** — Create an Ubuntu VM (prefer free-tier eligible shape if available in your region).
2. **SSH keys** — Use a dedicated key pair; disable password SSH login.
3. **Network** — Security list / NSG allowing:
   - SSH (`22`) only from your IP (or bastion)
   - HTTP/HTTPS (`80`/`443`) from the internet
   - Deny public access to Postgres (`5432`)
4. **Docker** — Install Docker Engine + Compose plugin on the VM.
5. **App env** — Place production `.env` outside Git with `chmod 600`.
6. **Nginx** — Reverse proxy to `127.0.0.1:3000`; terminate TLS.
7. **HTTPS** — Domain + Let's Encrypt (or another trusted CA).
8. **Restart policy** — Compose `restart: unless-stopped` (or systemd unit).
9. **Logs / monitoring** — `docker compose logs`, `journalctl`, basic `htop`/`df` checks.
10. **Backups** — `pg_dump` schedule + restore drill documentation.
11. **Rollback** — Keep previous image tag; redeploy last known good compose revision.
12. **Cost** — Track Always Free eligibility vs paid shapes/storage/egress; shut down unused resources.

### Risks to avoid

- Opening SSH (`0.0.0.0/0`) without understanding the exposure.
- Hardcoding OCI API keys or DB passwords in the repository.
- Claiming OCI deployment complete before health checks and HTTPS verification succeed.

### Scripts placeholder

Helper scripts for OCI will be added under `scripts/` as the deployment milestone progresses (for example bootstrap notes and backup helpers). No cloud resources are provisioned automatically by this repository.
