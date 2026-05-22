# 😋 Dinner served and ate - the ultimate cookboook 🍳🥘
![Banner](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejA0ZXBnNHBra3ZtYTJycDA1OHh4b244MWhrdzhocjg4NWVxeTB0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FyKfqRxVbzciY/giphy.gif)

[![Build and Deploy](https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions/workflows/docker-image.yml/badge.svg)](https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions/workflows/docker-image.yml)

A cookbook with hot recipes for your inner diva🫦

Built with **Next.js + React** frontend, **Express** backend, deployed on **Azure VMs** via **Docker** and **GitHub Actions**.
 
---

## 🚀 Deploy to Azure (step by step)

**Prerequisites:** Azure CLI installed and logged in, SSH key on your machine.

**Step 1 — Provision the VMs**
```bash
bash infrastructure/setup_azure_vms.sh
```
This creates two Azure VMs (backend + nginx) and prints their public/private IPs.

**Step 2 — Add GitHub Secrets**

Go to your repo → Settings → Secrets and add:

| Secret | Value |
|---|---|
| `SSH_PRIVATE_KEY` | contents of your `~/.ssh/id_ed25519` (or id_rsa) |
| `SSH_USER` | `azureuser` |
| `SSH_HOST_NGINX` | public IP of the nginx VM |
| `BACKEND_PRIVATE_IP` | private IP of the backend VM |
| `CR_PAT` | GitHub personal access token (read/write packages) |
| `DOCKER_GITHUB_USERNAME` | your GitHub username |

**Step 3 — Push to `main` to deploy**
```bash
git push origin main
```
GitHub Actions builds the Docker images, pushes them to GHCR, and deploys to both VMs automatically.

**Step 4 — Open monitoring ports (one-time)**
```bash
az vm open-port -g rg-dinner-served-and-ate -n dinner-served-nginx --port 9090 --priority 1004
az vm open-port -g rg-dinner-served-and-ate -n dinner-served-nginx --port 3000 --priority 1005
```

**Step 5 — Deploy monitoring**
```bash
SSH_HOST_NGINX=<nginx-public-ip> BACKEND_PRIVATE_IP=<backend-private-ip> \
  bash infrastructure/deploy-monitoring-manual.sh
```

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| Website | `http://<nginx-public-ip>` |
| Swagger UI | `http://<nginx-public-ip>/swagger` |
| Grafana | `http://<nginx-public-ip>:3000` (admin / admin) |
| Prometheus | `http://<nginx-public-ip>:9090` |

---

## 📊 Monitoring

The backend exposes Prometheus metrics at `/metrics`. Grafana comes pre-configured with a **"Dinner Served Backend"** dashboard showing:
- Request rate
- p95 latency
- Memory usage
- Recipe count

In Prometheus → Status → Targets, `azure-backend` should show as **UP**.

---

## 🔄 Deployment Strategy

**Rolling restart** — on every push to `main`:
1. GitHub Actions builds new Docker images and pushes to GHCR
2. SSHs into the Azure VMs and runs `docker compose pull` + `docker compose down` + `docker compose up -d`

Brief downtime of ~5–10 seconds per deploy. Acceptable for a course project.

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

1. To start deployment with Azure VMs
  `infrastructure/setup_azure_vms.sh`

2. Push to `main` to deploy

### Optional: Dedicated PostgreSQL VM
If you want a separate database VM, run this first (same VNet/subnet, no public IP):

`infrastructure/setup_azure_db_vm.sh`

It will:
- Create a private DB VM in the same VNet/subnet
- Install PostgreSQL and create database/user
- Allow only backend subnet traffic to port 5432

Optional GitHub secrets (set by the script if you run it with `SET_DB_SECRETS=1`):
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

The pipeline uses these compose files:
- `src/docker-compose.backend.yml`
- `src/docker-compose.nginx.yml`
- `src/docker-compose.prod.yml` (buildx bake config)


## Deployment live 🤤🍜
* Frontend - ipadresse coming in hot soon
* Backend API - //-
* API Dumentation swagger - -//-

--- 
<h2 style="color:#ff69b4;">Tech Stack 🍴</h2>

<h3 style="color:#ff69b4;">Backend 🍴</h3>

* 🌟 Javascript / Node.js
* 🍬 Express
* 🧰 Knex + PostgreSQL

<h3 style="color:#ff69b4;">Frontend 🍴</h3>

* ⚛️ React
* 🍩 Next.js

<h3 style="color:#ff69b4;">API Documentation 🍴</h3>

* 🍰 Swagger

<h3 style="color:#ff69b4;">Infrastructure 🥣</h3>

* ☁️ Azure VMs
* 🍬 Ubuntu
* 🌟 Docker Compose
* 🔁 GitHub Actions

---

<h2 style="color:#ff69b4;">Project Structure 😋🍣🍽️</h2>

```
DINNER-SERVED-AND-ATE/
│
├── .github/workflows/          # CI/CD pipeline
│
├── infrastructure/             # Azure provisioning scripts
│   ├── setup_azure_vms.sh
│   ├── setup_azure_db_vm.sh
│   ├── teardown_azure_vms.sh
│   └── deploy-monitoring-manual.sh
│
├── monitoring/                 # Prometheus + Grafana (VM)
│   ├── docker-compose.azure.yml
│   ├── prometheus.azure.template.yml
│   └── grafana/
│
├── src/
│   ├── backend/                # Express API
│   ├── frontend/               # Next.js frontend
│   ├── network/                # Nginx config + Dockerfile
│   ├── docker-compose.backend.yml
│   ├── docker-compose.nginx.yml
│   └── docker-compose.prod.yml
│
└── README.md
```

---

<h2 style="color:#ff69b4;">API Documentation 🍜</h2>

- OpenAPI spec: [src/frontend/app/swagger/api-schema.yaml](src/frontend/app/swagger/api-schema.yaml)
- API overview: [READMEs/API_OVERVIEW.md](READMEs/API_OVERVIEW.md)

---

<h2 style="color:#ff69b4;">Database 🍴</h2>

Uses PostgreSQL via the dedicated DB VM. Configure with:
```
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
```

---

<h2 style="color:#ff69b4;">Team: Ostemadsprincesse 🫶👨🏼‍🍳</h2>

- Føen
- Jonas
- Nikoleta
- Linea
