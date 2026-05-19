import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../app.js';

const SCHEMA = `
  CREATE TABLE recipes (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    time_minutes INTEGER,
    price REAL,
    link TEXT
  );
  CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name TEXT
  );
  CREATE TABLE recipe_tags (
    recipe_id INTEGER,
    tag_id INTEGER
  );
  CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY,
    name TEXT,
    unit TEXT,
    category TEXT
  );
  CREATE TABLE recipe_ingredients (
    recipe_id INTEGER,
    ingredient_id INTEGER,
    amount REAL,
    unit TEXT
  );
`;

let app;
let emptyApp;

beforeAll(() => {
  const db = new Database(':memory:');
  db.exec(SCHEMA + `
    INSERT INTO recipes VALUES (1, 'Pasta', 'Simple pasta', 20, 50, 'http://example.com');
    INSERT INTO recipes VALUES (2, 'Plain', 'No tags or ingredients', 5, 10, null);
    INSERT INTO tags VALUES (1, 'Italian');
    INSERT INTO recipe_tags VALUES (1, 1);
    INSERT INTO ingredients VALUES (1, 'Noodles', 'g', 'Carbs');
    INSERT INTO recipe_ingredients VALUES (1, 1, 200, 'g');
  `);
  app = createApp(db);

  const emptyDb = new Database(':memory:');
  emptyDb.exec(SCHEMA);
  emptyApp = createApp(emptyDb);
});

describe('GET /health', () => {
  it('returns 200 with status message', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Backend is running');
  });
});

describe('GET /api/recipe/recipes', () => {
  it('returns 200 with an array of recipes', async () => {
    const res = await request(app).get('/api/recipe/recipes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('includes tags on each recipe', async () => {
    const res = await request(app).get('/api/recipe/recipes');
    expect(res.body[0]).toHaveProperty('tags');
    expect(Array.isArray(res.body[0].tags)).toBe(true);
  });

  it('returns recipes with the correct shape', async () => {
    const res = await request(app).get('/api/recipe/recipes');
    const recipe = res.body[0];
    expect(recipe).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      time_minutes: expect.any(Number),
      price: expect.any(Number),
      tags: expect.any(Array),
    });
  });
});

describe('GET /api/recipe/recipes/:id', () => {
  it('returns a single recipe with tags and ingredients', async () => {
    const res = await request(app).get('/api/recipe/recipes/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Pasta');
    expect(Array.isArray(res.body.tags)).toBe(true);
    expect(Array.isArray(res.body.ingredients)).toBe(true);
  });

  it('returns 404 for a non-existent recipe', async () => {
    const res = await request(app).get('/api/recipe/recipes/999');
    expect(res.status).toBe(404);
  });

  it('returns 404 for a non-numeric id', async () => {
    const res = await request(app).get('/api/recipe/recipes/abc');
    expect(res.status).toBe(404);
  });

  it('returns empty tags and ingredients for a recipe with no associations', async () => {
    const res = await request(app).get('/api/recipe/recipes/2');
    expect(res.status).toBe(200);
    expect(res.body.tags).toEqual([]);
    expect(res.body.ingredients).toEqual([]);
  });
});

describe('GET /api/recipe/ingredients', () => {
  it('returns 200 with an array of ingredients', async () => {
    const res = await request(app).get('/api/recipe/ingredients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/recipe/tags', () => {
  it('returns 200 with an array of tags', async () => {
    const res = await request(app).get('/api/recipe/tags');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Italian');
  });
});

describe('empty database', () => {
  it('GET /api/recipe/recipes returns an empty array', async () => {
    const res = await request(emptyApp).get('/api/recipe/recipes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /api/recipe/ingredients returns an empty array', async () => {
    const res = await request(emptyApp).get('/api/recipe/ingredients');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /api/recipe/tags returns an empty array', async () => {
    const res = await request(emptyApp).get('/api/recipe/tags');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /api/recipe/recipes/:id returns 404', async () => {
    const res = await request(emptyApp).get('/api/recipe/recipes/1');
    expect(res.status).toBe(404);
  });
});
