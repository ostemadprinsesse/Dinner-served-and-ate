# 😋 Dinner served and ate - the ultimate cookboook 🍳🥘
![Banner](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejA0ZXBnNHBra3ZtYTJycDA1OHh4b244MWhrdzhocjg4NWVxeTB0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FyKfqRxVbzciY/giphy.gif)

[![Build and Deploy](https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions/workflows/docker-image.yml/badge.svg)](https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions/workflows/docker-image.yml)

A cookbook with hot recipes for your inner diva🫦

Built with **Next.js + React** frontend, **Express** backend, deployed on **Azure VMs** via **Docker** and **GitHub Actions**.
 
---

## 🚀 Deploy to Azure (step by step)

**Prerequisites — install and log in before you start:**
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) → then run `az login`
- [GitHub CLI](https://cli.github.com/) → then run `gh auth login`
- An SSH key on your machine — generate one if you don't have it:
  ```bash
  ssh-keygen -t ed25519
  ```

> ⚠️ **Note on IP addresses:** Azure assigns **dynamic** IPs by default. The nginx public IP and the private IPs of the backend and DB VMs can change if the VMs are stopped and restarted. Update your secrets and README links if you reprovision.

---

**Step 1 — Create the nginx + backend VMs**
```bash
bash infrastructure/setup_azure_vms.sh
```
Creates two Azure VMs and sets the required GitHub secrets automatically (`SSH_HOST_NGINX`, `BACKEND_PRIVATE_IP`, `SSH_USER`, `SSH_PRIVATE_KEY`).

> If the script says another teammate owns the deployment, ask them to run `bash infrastructure/teardown_azure_vms.sh` first — or force override with `FORCE=1 bash infrastructure/setup_azure_vms.sh`.

---

**Step 2 — Create the database VM**
```bash
SET_DB_SECRETS=1 bash infrastructure/setup_azure_db_vm.sh
```
Creates a private PostgreSQL VM and sets the DB secrets in GitHub automatically (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`). Enter a password when prompted.

---

**Step 3 — Trigger the deploy**
```bash
git push origin main
```
GitHub Actions builds the Docker images, pushes them to GHCR, and deploys everything to the VMs automatically.

Watch progress: `https://github.com/ostemadprinsesse/Dinner-served-and-ate/actions`

---

**Step 4 — Deploy monitoring**

Get your IPs first:
```bash
az vm show -d -g rg-dinner-served-and-ate -n dinner-served-nginx --query publicIps -o tsv
az vm show -d -g rg-dinner-served-and-ate -n dinner-served-backend --query privateIps -o tsv
```

Then run (replace with your actual IPs):
```bash
SSH_HOST_NGINX=<nginx-public-ip> BACKEND_PRIVATE_IP=<backend-private-ip> \
  bash infrastructure/deploy-monitoring-manual.sh
```

Open the monitoring ports:
```bash
az vm open-port -g rg-dinner-served-and-ate -n dinner-served-nginx --port 9090 --priority 1004
az vm open-port -g rg-dinner-served-and-ate -n dinner-served-nginx --port 3000 --priority 1005
```

---

**Tear down when done**
```bash
bash infrastructure/teardown_azure_vms.sh
```

---

## 🌐 Live URLs

> ⚠️ Azure tildeler dynamiske IP-adresser. Hent den aktuelle nginx-IP med:
> ```bash
> az vm show -d -g rg-dinner-served-and-ate -n dinner-served-nginx --query publicIps -o tsv
> ```

Erstat `<nginx-ip>` med outputtet ovenfor:

| Service | URL |
|---|---|
| Website | http://\<nginx-ip\>/ |
| Swagger UI | http://\<nginx-ip\>/swagger |
| Grafana | http://\<nginx-ip\>:3000 (admin / admin) |
| Prometheus | http://\<nginx-ip\>:9090 |

---

## 📊 Monitoring

The backend exposes Prometheus metrics at `/metrics`. Grafana comes pre-configured with a **"Dinner Served Backend"** dashboard showing:
- Request rate
- p95 latency
- Memory usage
- Recipe count

In Prometheus → Status → Targets, `azure-backend` should show as **UP**.

---


A cookbook with hot recipes for your inner diva🫦 

The application deploys with Azure Virtual Machine and uses Docker. 
The application is migrated to **Next.js + React**

--- 

<div style="background-color:#ffe6f2;padding:10px;border-radius:8px; color: Black;">
✨ This project uses Azure VM og nginx✨
</div>


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


## ⚠️ Before you deploy — personal settings

The setup scripts use default values for **location** and **VM size** that may not be available or affordable in your Azure subscription. Check and update these before running:

- **Location** (`LOCATION` in the scripts) — e.g. `swedencentral`, `westeurope`, `northeurope`. Each group member may have different quota or availability.
- **VM size** (`VM_SIZE` / `DB_VM_SIZE`) — e.g. `Standard_B2s_v2`. If a size is unavailable in your region, try `Standard_B2ms` or check with `az vm list-skus --location <your-location> --output table`.

Each person in the group should verify these values match what is available in their own Azure account before running the infrastructure scripts.

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
## If you are a developer
Fork the project and add GitHub Secrets: 

| Secret | Value |
|---|---|
| `SSH_PRIVATE_KEY` | contents of your `~/.ssh/id_ed25519` (or id_rsa) |
| `SSH_USER` | `azureuser` |
| `SSH_HOST_NGINX` | public IP of the nginx VM |
| `BACKEND_PRIVATE_IP` | private IP of the backend VM |
| `CR_PAT` | GitHub personal access token (read/write packages) |
| `DOCKER_GITHUB_USERNAME` | your GitHub username |



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
