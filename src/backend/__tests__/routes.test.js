import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../app.js';

let app;

beforeAll(() => {
  const db = new Database(':memory:');

  db.exec(`
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

    INSERT INTO recipes VALUES (1, 'Pasta', 'Simple pasta', 20, 50, 'http://example.com');
    INSERT INTO tags VALUES (1, 'Italian');
    INSERT INTO recipe_tags VALUES (1, 1);
    INSERT INTO ingredients VALUES (1, 'Noodles', 'g', 'Carbs');
    INSERT INTO recipe_ingredients VALUES (1, 1, 200, 'g');
  `);

  app = createApp(db);
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
