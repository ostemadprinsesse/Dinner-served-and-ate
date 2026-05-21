# 😋 Dinner served and ate - the ultimate cookboook 🍳🥘
![Banner](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejA0ZXBnNHBra3ZtYTJycDA1OHh4b244MWhrdzhocjg4NWVxeTB0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FyKfqRxVbzciY/giphy.gif)

[![Build and Deploy](https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions/workflows/docker-image.yml/badge.svg)](https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions/workflows/docker-image.yml)





---

A cookbook with hot recipes for your inner diva🫦 

The application deploys with Azure Virtual Machine and uses Docker. 
The application is migrated to **Next.js + React**

--- 

<div style="background-color:#ffe6f2;padding:10px;border-radius:8px; color: Black;">
✨ This project uses Azure VM og nginx✨
</div>

## Deployment (two VMs via GitHub Actions)
Use the infra script to provision VMs, then push to `main` to trigger CI/CD.

1. Provision Azure VMs
  ```bash
  bash infrastructure/setup_azure_vms.sh
  ```
2. Push to `main` to deploy

The pipeline uses these compose files:
- `src/docker-compose.backend.yml`
- `src/docker-compose.nginx.yml`
- `src/docker-compose.prod.yml` (buildx bake config)

## Monitoring and feedback with Prometheus + Grafana

Monitoring shows what the system is doing over time with metrics such as uptime, request rate, response time, and memory usage. Logging explains individual events and errors. Both matter: logs help debug what happened, while monitoring makes behavior visible early enough for the team to react.

This project exposes Prometheus metrics from the backend at:

- `http://localhost:5000/metrics`

The local monitoring stack lives in `monitoring/` and starts the backend, Prometheus, and Grafana together:

- `monitoring/prometheus.yml` scrapes the backend `/metrics` endpoint every 15 seconds.
- `monitoring/docker-compose.yml` starts the backend, Prometheus, and Grafana.
- `monitoring/grafana/dashboards/dinner-served-backend.json` is the exported Grafana dashboard.

Run it locally:

```bash
cd monitoring
docker compose up --build -d
```

Access:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000` with login `admin` / `admin`

Grafana is automatically connected to Prometheus at `http://prometheus:9090` and loads the "Dinner Served Backend" dashboard. The dashboard makes the second DevOps principle, Feedback, concrete by showing backend availability, request rate, p95 request duration, memory usage, and the number of recipes in the cookbook.

For Azure multi-VM monitoring, use `monitoring/prometheus.azure.example.yml` as the starting point. Replace the example private IP addresses with the nginx and backend VM private IPs, run Prometheus/Grafana on the nginx VM, and only open scrape ports such as `9100`, `9113`, and the backend metrics port to the nginx VM private IP.


## Deployment live 🤤🍜
* Frontend - *URL to be added after next deploy*
* Backend API - *URL to be added after next deploy*
* API Documentation (Swagger) - *URL to be added after next deploy*
* Grafana monitoring - *URL to be added after next deploy* (port 3000)

## Deployment Strategy

We use a **rolling restart** strategy. On every push to `main`, GitHub Actions:
1. Builds new Docker images and pushes them to GHCR
2. SSHs into the Azure VMs and runs `docker compose pull` + `docker compose up -d`

Docker Compose replaces containers one by one with the new image, resulting in a brief window of downtime (a few seconds). This is acceptable for a course project. A true zero-downtime approach would require blue-green or a load balancer with health checks.

**Tradeoffs:**
- Simple to operate — no extra infrastructure needed
- Brief downtime on each deploy (~5–10 seconds)
- If the new image fails to start, Docker Compose does not automatically roll back

## Definition of Done

A task is considered done when:
- [ ] Code is reviewed and approved via pull request (at least 1 approval)
- [ ] CI pipeline passes (lint + tests green)
- [ ] Feature works in the deployed environment (not just locally)
- [ ] Relevant documentation is updated (README, API spec if needed)

--- 
<h2 style="color:#ff69b4;">Tech Stack 🍴</h2>

<h3 style="color:#ff69b4;"> Backend 🍴</h3>

* 🌟Javascript
* 🍩Node
* 🍬Express
* 🪅better-SQLite3

<h3 style="color:#ff69b4;">Frontend🍴</h3>

* ⚛️ React
* 🍩Next

<h3 style="color:#ff69b4;">API Documentation🍴</h3>

* 🍰Swagger


<h3 style="color:#ff69b4;"> Infrastructure 🥣 </h3>
- ☁️ Azure 
- 🍬Ubunto
- 🌟Docker Compose


<h2 style="color:#ff69b4;"> Project Structure 😋🍣🍽️ </h2>

```
DINNER-SERVED-AT-ATE/
│
├── .github/
│   └── workflows/
│
├── infrastructure/         # Azure provisioning scripts
│   ├── setup_azure_vms.sh
│   └── teardown_azure_vms.sh
│
├── monitoring/             # Prometheus + Grafana local monitoring stack
│   ├── docker-compose.yml
│   ├── prometheus.yml
│   └── grafana/
│
├── READMEs/                # Notes and details
│
├── src/
│   ├── backend/             # Express backend API
│   ├── frontend/            # Next.js frontend
│   ├── network/             # Nginx config + Dockerfile
│   ├── docker-compose.backend.yml
│   ├── docker-compose.nginx.yml
│   └── docker-compose.prod.yml
│
└── README.md
```

---

<h2 style="color:#ff69b4;"> Deployment on your own VM 🍜🍜 </h2>
- Make sure you have an SSH key on your computer
- Fork the repo
- Run the provisioning script:
```bash
bash infrastructure/setup_azure_vms.sh
```


<h2 style="color:#ff69b4;"> Running Locally with Docker 🍳 </h2>
Preconditions:
- Docker Desktop installed and open


### Access overview - local dev
Frontend: http://localhost:3005

Backend API: http://localhost:5000/api/  # see API overview for routes

Swagger UI: http://localhost:3005/swagger

--- 

<h2 style="color:#ff69b4;"> Run projekt locally (without Docker) 🍳 🍳 </h2>
Requirements: Node.js 18+

**Note:** Docker uses port 4000, local development uses port 3005.

1. Install dependencies:
  - `cd src/frontend && npm install`
  - `cd ../backend && npm install`
2. Start dev servers:
  - `cd src/backend && npm run dev`
  - `cd src/frontend && npm run dev`
3. Open: `http://localhost:3005/`

---

<h2 style="color:#ff69b4;"> API dokumentation 🍜 </h2>

- OpenAPI spec: [src/frontend/app/swagger/api-schema.yaml](src/frontend/app/swagger/api-schema.yaml)
- API overview (Markdown): [READMEs/API_OVERVIEW.md](READMEs/API_OVERVIEW.md)
- Checkout the swagger documentation page

<h2 style="color:#ff69b4;"> Funktionality 🍝</h2>

- UI:
  - `/` viser alle opskrifter
  - `/recipes/[id]/` viser opskrifts-detaljer
- API (Next.js route handlers):
  - (Implementeret samlet i én fil: `app/api/[[...path]]/route.js`)
  - `/api/recipe/recipes/`
  - `/api/recipe/recipes/{id}/`
  - `/api/recipe/recipes/{id}/upload-image/` (stub)
  - `/api/recipe/ingredients/` + `/api/recipe/ingredients/{id}/` (id endpoints er stubs)
  - `/api/recipe/tags/` + `/api/recipe/tags/{id}/` (id endpoints er stubs)
  - `/api/user/*` (simple demo endpoints)

<h2 style="color:#ff69b4;"> Database 🍴 </h2>
Uses legacy SQLite database 
`app.db`

Wanna use your own database with delicios meals? 
Change here
- `DB_PATH=/path/to/app.db`

<h2 style="color:#ff69b4;"> Team: Ostemadsprincesse 🫶👨🏼‍🍳</h2>
- Føen
- Jonas
- Nikoleta
- Linea
