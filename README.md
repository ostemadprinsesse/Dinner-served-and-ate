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


# Infrastructure - HOW TO START
Use script for the Azure two-VM setup:

```bash
bash infrastructure/setup_azure_vms.sh
```

teardown with one of these options 
```bash
bash infrastructure/setup_azure_vms.sh --teardown
bash infrastructure/teardown_azure_vms.sh
```


Before running, make sure the `LOCATION` in `infrastructure/setup_azure_vms.sh` matches the Azure region your subscription allows. We default to `swedencentral`.

When setup is done, open the app in your browser at:

```text
http://<nginx-public-ip>/
```

The backend VM is private, so you do not browse to it directly. If you need to test it, SSH into the nginx VM and curl the backend private IP on port `8080`.




## Deployment locally via nginx and docker - we dont use this for deployment
In VS code terminal: (remember to opn docker desktop)
docker compose -f docker-compose.deploy.yml up --build

Vil der starte følgende cotainere
- frontend
- backend
- nginx

Og man kan **se frontend gennem nginx på: localhost:80**, mens man (for now?) stadig kan se "direkte på frontend" fra frontend containeren på localhost:3005 som normalt


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
│   ├── workflows/
│   └── templates           # for issues and pull requests
│
├── READMEs/                # Own notes and details
│ 
├── backend/                # Express backend API
│   ├── index.js
│   ├── db.js
│   ├── app.db
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── frontend/               # React frontend
│   ├── api/
│   │   └──route.js
│   ├── recipes/
│   │   └──page.js
│   ├── swagger/            # API pecification page
│   │   ├──api-schema.yaml
│   │   ├──page.js 
│   │   └──SwaggerUIClient.jsx
│   ├── page.js
│   ├── layout.js
│   ├── package.json
│   ├── global.css
│   └── Dockerfile
│
├── docker-compose.yml     # Docker orchestration
├── Azure-VM-script.ps1    # Script for VM etc
└── README.md
```

---

<h2 style="color:#ff69b4;"> Deployment on your own VM 🍜🍜  - using our cool script :) </h2>
- Make sure to have a ssh key on your computer ?
- Fork repo 

- Open ```Azure-VM-script.ps1```

- Change ```$location = "norwayeast"```
 to a location available to your azure account
- In powershell: 
```powershell -ExecutionPolicy Bypass -File .\Azure-VM-script.ps1```
- Log in to your Azure account


<h2 style="color:#ff69b4;"> Running Locally with Docker 🍳 </h2>
Preconditions:
- Docker Desktop installed and open


### Acces overview - with Docker
Frontend : http://localhost:4000

Backend API : http://localhost:5000/api/     # see API overview for rutes

API overview with Swagger : http://localhost:4000/swagger 

1. **Start applikation:**
   ```bash
   docker-compose up
   ```

2. **Stop applikation:**
   ```bash
   docker-compose down
   ```

--- 

<h2 style="color:#ff69b4;"> Run projekt locally (without Docker) 🍳 🍳 </h2>
Requirements: Node.js 18+

**Note:** Docker uses port 4000, local development uses port 3005.

1. Install dependencies:
	- `npm install`
2. Start dev-server:
	- `npm run dev`
3. Open	- `http://localhost:3005/`

---

<h2 style="color:#ff69b4;"> API dokumentation 🍜 </h2>

- OpenAPI spec: [api-schema.yaml](api-schema.yaml)
- API overview (Markdown): [API_OVERVIEW.md](API_OVERVIEW.md)
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