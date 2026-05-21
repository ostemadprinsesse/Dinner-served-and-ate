# Diary — Monitoring, CI improvements & fixes

## What we did

### Prometheus + Grafana monitoring

We set up a full monitoring stack using Prometheus and Grafana.

The backend exposes metrics at `/metrics` using the `prom-client` library. We track:
- `dinner_served_http_requests_total` — request count by method, route, status
- `dinner_served_http_request_duration_seconds` — request latency histogram
- `dinner_served_recipes_total` — number of recipes in the database
- Default Node.js metrics (memory, CPU, uptime)

**Local monitoring** runs via `monitoring/docker-compose.yml`:
```bash
cd monitoring
docker compose up --build -d
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3000  (admin / admin)
```

**Azure monitoring** runs on the nginx VM via `monitoring/docker-compose.azure.yml`.
Prometheus is configured from `monitoring/prometheus.azure.template.yml` — the `${BACKEND_PRIVATE_IP}` placeholder is substituted at deploy time using `envsubst`.

To deploy monitoring to the Azure VM manually:
```bash
# Open port 9090 once (for Prometheus access)
az vm open-port -g rg-dinner-served-and-ate -n dinner-served-nginx --port 9090 --priority 1004

# Deploy
SSH_HOST_NGINX=<ip> BACKEND_PRIVATE_IP=<ip> bash infrastructure/deploy-monitoring-manual.sh
```

Grafana auto-provisions the datasource (Prometheus) and the "Dinner Served Backend" dashboard on startup. No manual setup needed.

---

### CI/CD improvements

We improved the GitHub Actions workflow (`.github/workflows/docker-image.yml`):

- **Added a `lint-and-test` job** that runs on every push to every branch and on every PR to main. It lints and tests the backend, and lints the frontend.
- **Added `pull_request` trigger** so PRs get CI checks before merging.
- **Deploy jobs now gate on branch** — only deploy on pushes to `main` or `grafana` (not every branch).
- **Added `deploy-monitoring` job** that deploys Prometheus + Grafana to the nginx VM after every deploy.

---

### SSH key fix

Previously the diary described creating a `DINNERKEY/` folder in `.ssh` and copying a shared key there. This was changed: the setup script now auto-detects your own key from `~/.ssh/id_rsa`, `~/.ssh/id_ed25519`, or `~/.ssh/id_ecdsa`. No shared key folder needed — everyone uses their own key on their own machine.

---

### Infrastructure fixes

- `infrastructure/setup_azure_vms.sh` and `teardown_azure_vms.sh` are now marked executable in git (`chmod +x` via `git update-index --chmod=+x`), so they run directly on Linux/Mac without needing `bash` prefix.
- Port 3000 (Grafana) is now opened automatically by the setup script.
- Added `src/backend/.dockerignore` to prevent Windows-compiled `node_modules` from being copied into the Linux Docker image. This fixed a `better-sqlite3` native module crash (`Exec format error`) when building on Windows.

---

### Frontend lint

Added `"lint": "next lint"` script and ESLint dependencies to `src/frontend/package.json`.
Added `src/frontend/.eslintrc.json` with `"root": true` so ESLint does not traverse up to the repo root config when running in CI.
Fixed a lint error in `app/layout.js`: replaced `<a href="/">` with Next.js `<Link href="/">`.

---

### Deployment strategy documented

We use a **rolling restart** strategy:
1. GitHub Actions builds new Docker images and pushes to GHCR
2. SSH into VMs and run `docker compose pull` + `docker compose up -d`

This causes ~5–10 seconds of downtime per deploy. Acceptable for a course project.

---

### Definition of Done

A task is done when:
- Code reviewed and approved via PR (at least 1 approval)
- CI passes (lint + tests green)
- Feature works in the deployed environment
- Relevant documentation updated
