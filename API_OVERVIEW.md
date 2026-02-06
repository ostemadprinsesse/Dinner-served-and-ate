# API Overview (OpenAPI)

Source: `api-schema.yaml`

## Info
- **Title:** Recipe Cookbook API
- **OpenAPI:** 3.0.3
- **Version:** 1.0.0
- **Description:** A recipe cookbook API with detailed cooking instructions and ingredient measurements
- **Base URL / servers:** Not specified in the OpenAPI document.

## Tags
- `web` – HTML pages
- `user` – user + token endpoints
- `recipe` – recipes, tags, ingredients

## Authentication
The OpenAPI document does not define a `securitySchemes` block.

However, some endpoints state they are for the **authenticated user** (e.g. `GET /api/user/me/`).
A token can be created via `POST /api/user/token/`.

**Note:** The exact header format (e.g. `Authorization: Token …` vs `Bearer …`) is not specified in the YAML.

---

## Endpoints

### Web (HTML)

#### `GET /`
Home page displaying all recipes with 90s styling.
- **Response 200:** `text/html` (string)

#### `GET /recipes/{id}/`
Recipe detail page with full cooking instructions.
- **Path params**
  - `id` (integer, required) – Recipe ID
- **Response 200:** `text/html` (string)

> The description explicitly warns this endpoint is vulnerable to SQL injection “for educational purposes”.

---

### User

#### `POST /api/user/create/`
Create a new user.
- **Body:** `application/json` → `UserRequest`
- **Response 201:** `application/json` → `User`

#### `GET /api/user/me/`
Retrieve authenticated user.
- **Response 200:** `application/json` → `User`

#### `PUT /api/user/me/`
Update authenticated user.
- **Body:** `application/json` → `UserRequest`
- **Response 200:** `application/json` → `User`

#### `PATCH /api/user/me/`
Partial update authenticated user.
- **Body:** `application/json` → `PatchedUserRequest`
- **Response 200:** `application/json` → `User`

#### `POST /api/user/token/`
Create an auth token.
- **Body:** `application/json` → `AuthTokenRequest`
- **Response 200:** `application/json` → `AuthToken`

---

### Recipe

#### `GET /api/recipe/recipes/`
List recipes.
- **Query params (optional)**
  - `ingredients` (string) – Comma separated list of ingredient IDs to filter
  - `tags` (string) – Comma separated list of tag IDs to filter
- **Response 200:** `application/json` → `Recipe[]`

#### `POST /api/recipe/recipes/`
Create recipe.
- **Body:** `application/json` → `RecipeDetailRequest`
- **Response 201:** `application/json` → `RecipeDetail`

#### `GET /api/recipe/recipes/{id}/`
Get recipe by id.
- **Path params**
  - `id` (integer, required) – Recipe id
- **Response 200:** `application/json` → `RecipeDetail`

#### `PUT /api/recipe/recipes/{id}/`
Update recipe by id.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `RecipeDetailRequest`
- **Response 200:** `application/json` → `RecipeDetail`

#### `PATCH /api/recipe/recipes/{id}/`
Partial update recipe by id.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `PatchedRecipeDetailRequest`
- **Response 200:** `application/json` → `RecipeDetail`

#### `DELETE /api/recipe/recipes/{id}/`
Delete recipe by id.
- **Path params**
  - `id` (integer, required)
- **Response 204:** No response body

#### `POST /api/recipe/recipes/{id}/upload-image/`
Upload an image to a recipe.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `RecipeImageRequest`
- **Response 200:** `application/json` → `RecipeImage`

> Note: `RecipeImageRequest.image` is `format: binary`, but it is declared under `application/json` in the OpenAPI. In practice, image uploads are often `multipart/form-data`.

#### `GET /api/recipe/ingredients/`
List ingredients.
- **Query params (optional)**
  - `assigned_only` (integer enum: `0|1`) – Filter by items assigned to recipes
- **Response 200:** `application/json` → `Ingredient[]`

#### `PUT /api/recipe/ingredients/{id}/`
Update ingredient by id.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `IngredientRequest`
- **Response 200:** `application/json` → `Ingredient`

#### `PATCH /api/recipe/ingredients/{id}/`
Partial update ingredient by id.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `PatchedIngredientRequest`
- **Response 200:** `application/json` → `Ingredient`

#### `DELETE /api/recipe/ingredients/{id}/`
Delete ingredient by id.
- **Path params**
  - `id` (integer, required)
- **Response 204:** No response body

#### `GET /api/recipe/tags/`
List tags.
- **Query params (optional)**
  - `assigned_only` (integer enum: `0|1`) – Filter by items assigned to recipes
- **Response 200:** `application/json` → `Tag[]`

#### `PUT /api/recipe/tags/{id}/`
Update tag by id.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `TagRequest`
- **Response 200:** `application/json` → `Tag`

#### `PATCH /api/recipe/tags/{id}/`
Partial update tag by id.
- **Path params**
  - `id` (integer, required)
- **Body:** `application/json` → `PatchedTagRequest`
- **Response 200:** `application/json` → `Tag`

#### `DELETE /api/recipe/tags/{id}/`
Delete tag by id.
- **Path params**
  - `id` (integer, required)
- **Response 204:** No response body

---

## Schemas (summary)

### `UserRequest`
- `email` (email, required)
- `password` (string, writeOnly, min 5, required)
- `name` (string, required)

### `User`
- `email` (email, required)
- `name` (string, required)

### `AuthTokenRequest`
- `email` (email, required)
- `password` (string, required)

### `AuthToken`
- `email` (email, required)
- `password` (string, required)

### `RecipeDetailRequest`
- `title` (string, required)
- `time_minutes` (integer, required)
- `price` (decimal-like string, required)
- `link` (string, optional)
- `tags` (`TagRequest[]`, optional)
- `ingredients` (`IngredientRequest[]`, optional)
- `description` (string, optional; step-by-step instructions)

### `RecipeDetail`
Like `RecipeDetailRequest`, plus:
- `id` (integer, readOnly)
- `tags` (`Tag[]`)
- `ingredients` (`Ingredient[]`)

### `IngredientRequest`
- `name` (string, required)
- `amount` (string, optional)
- `unit` (string, optional)

### `Ingredient`
- `id` (integer, readOnly)
- `name` (string)
- `amount` (string, optional)
- `unit` (string, optional)

### `TagRequest`
- `name` (string, required)

### `Tag`
- `id` (integer, readOnly)
- `name` (string)

### `RecipeImageRequest`
- `image` (binary, nullable, required)

### `RecipeImage`
- `id` (integer, readOnly)
- `image` (uri, nullable)

### Patched schemas
- `PatchedUserRequest`, `PatchedRecipeDetailRequest`, `PatchedIngredientRequest`, `PatchedTagRequest` are the same shapes as their non-patched versions, but with all fields optional.
