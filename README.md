# 😋 Dinner served and ate - the ultimate cookboook 🍳🥘
![Banner](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejA0ZXBnNHBra3ZtYTJycDA1OHh4b244MWhrdzhocjg4NWVxeTB0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FyKfqRxVbzciY/giphy.gif)





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


## Deployment live 🤤🍜
* Frontend - ipadresse coming in hot soon
* Backend API - //-
* API Dumentation swagger - -//-

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

Start the full stack (app + monitoring) from the repo root:
```bash
docker compose up --build
```


### Access overview - local dev
Frontend: http://localhost:3005

Backend API: http://localhost:5000/api/  # see API overview for routes

Backend metrics: http://localhost:5000/metrics

Swagger UI: http://localhost:3005/swagger

Prometheus UI: http://localhost:9090

Grafana UI: http://localhost:3000

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