# Backend Route Tests

Tests are written with [Vitest](https://vitest.dev/) and [Supertest](https://github.com/ladjs/supertest).
Run them with `npm test` from `src/backend/`.

## Test setup

Two in-memory SQLite databases are created before all tests:

- **`app`** — seeded with one recipe (Pasta, id=1) with a tag and ingredient, and one bare recipe (Plain, id=2) with no associations.
- **`emptyApp`** — schema only, no rows.

---

## GET /health

| Test | Expected |
|------|----------|
| Returns status message | 200, `{ status: 'Backend is running' }` |

---

## GET /api/recipe/recipes

| Test | Expected |
|------|----------|
| Returns an array of recipes | 200, non-empty array |
| Includes tags on each recipe | Each recipe has a `tags` array |
| Returns recipes with the correct shape | Each recipe has `id` (Number), `title` (String), `description` (String), `time_minutes` (Number), `price` (Number), `tags` (Array) |

---

## GET /api/recipe/recipes/:id

| Test | Expected |
|------|----------|
| Returns a single recipe with tags and ingredients | 200, `title === 'Pasta'`, `tags` and `ingredients` are arrays |
| Non-existent recipe (id=999) | 404 |
| Non-numeric id (`abc`) | 404 |
| Recipe with no associations (id=2) | 200, `tags === []`, `ingredients === []` |

---

## GET /api/recipe/ingredients

| Test | Expected |
|------|----------|
| Returns an array of ingredients | 200, non-empty array |

---

## GET /api/recipe/tags

| Test | Expected |
|------|----------|
| Returns an array of tags | 200, array where first tag name is `'Italian'` |

---

## Empty database

| Test | Expected |
|------|----------|
| GET /api/recipe/recipes | 200, `[]` |
| GET /api/recipe/ingredients | 200, `[]` |
| GET /api/recipe/tags | 200, `[]` |
| GET /api/recipe/recipes/1 | 404 |
