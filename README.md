![Banner](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejA0ZXBnNHBra3ZtYTJycDA1OHh4b244MWhrdzhocjg4NWVxeTB0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FyKfqRxVbzciY/giphy.gif)
# Dinner-served-and-ate

Dette repo er migreret til **Next.js + React** for brugerflade og funktionalitet.

## Kør projektet

Krav: Node.js 18+.

1. Installer dependencies:
	- `npm install`
2. Start dev-server:
	- `npm run dev`
3. Åbn:
	- `http://localhost:3000/`

## Funktionalitet

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

## Database

Projektet bruger den eksisterende SQLite databasefil `app.db` i roden.

Hvis du vil pege på en anden databasefil, sæt env variablen:
- `DB_PATH=/path/to/app.db`

## Legacy (Flask)

Den gamle Flask app ligger i `legacy-flask/app.py` (med `legacy-flask/templates/` og `legacy-flask/static/`), men den bruges ikke længere af Next.js.

## Mappe overblik
```
legacy/
├─ .eslintrc.json
├─ .gitignore
├─ api-schema.yaml
├─ app.db
├─ architecutreIdeaLINEA.md
├─ jsconfig.json
├─ next.config.mjs
├─ package.json
├─ package-lock.json
├─ README.md
│
├─ app/
│  ├─ globals.css
│  ├─ layout.js
│  ├─ page.js
│  ├─ api/
│  │  └─ [[...path]]/
│  │     └─ route.js
│  └─ recipes/
│     └─ [id]/
│        └─ page.js
│
├─ lib/
│  └─ db.js
│
├─ legacy-flask/
│  ├─ app.py
│  ├─ requirements.txt
│  ├─ .venv/
│  ├─ Diary/
│  │  ├─ 2-Introduction.md
│  │  ├─ ToDoList.md
│  │  └─ image.png
│  ├─ static/
│  │  └─ style.css
│  └─ templates/
│     ├─ base.html
│     ├─ home.html
│     └─ recipe_detail.html
│
├─ node_modules/        (genereret)
└─ .next/               (genereret)
```
