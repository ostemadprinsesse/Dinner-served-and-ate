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

1. To start deployment with Azure VMs
  `infrastructure/setup_azure_vms.sh`

2. Push to `main` to deploy

The pipeline uses these compose files:
- `src/docker-compose.backend.yml`
- `src/docker-compose.nginx.yml`
- `src/docker-compose.prod.yml` (buildx bake config)

## Monitoring and feedback with Prometheus + Grafana

Monitoring shows what the system is doing over time with metrics such as uptime, request rate, response time, and memory usage. Logging explains individual events and errors. Both matter: logs help debug what happened, while monitoring makes behavior visible early enough for the team to react.

The backend exposes Prometheus metrics at `/metrics`. Grafana is pre-configured with a "Dinner Served Backend" dashboard showing request rate, p95 latency, memory usage, and recipe count.

---

**Prerequisites:** Azure VMs provisioned (`bash infrastructure/setup_azure_vms.sh`), Azure CLI logged in, backend app deployed to the VM (push to `main` first).

```bash
# 1. From the repo root — open port 9090 on the nginx VM (one-time)
az vm open-port -g rg-dinner-served-and-ate -n dinner-served-nginx --port 9090 --priority 1004

# 2. Deploy Prometheus + Grafana to the nginx VM
#    Replace the IPs with your actual values (printed by the setup script)
SSH_HOST_NGINX=<nginx-public-ip> BACKEND_PRIVATE_IP=<backend-private-ip> \
  bash infrastructure/deploy-monitoring-manual.sh

# 3. Open in browser:
#    Prometheus: http://<nginx-public-ip>:9090
#    Grafana:    http://<nginx-public-ip>:3000  (login: admin / admin)

# 4. In Prometheus, go to Status → Targets
#    "azure-backend" should show as UP once the backend is deployed

# NOTE: the backend only starts scraping after the app is deployed via CI/CD (merge to main).
```


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
├── monitoring/             # Prometheus + Grafana stack
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

`infrastructure/setup_azure_vms.sh`

---

<h2 style="color:#ff69b4;"> API dokumentation 🍜 </h2>

- OpenAPI spec: [src/frontend/app/swagger/api-schema.yaml](src/frontend/app/swagger/api-schema.yaml)
- API overview (Markdown): [READMEs/API_OVERVIEW.md](READMEs/API_OVERVIEW.md)
- Checkout the swagger documentation page

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
