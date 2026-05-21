import express from 'express';
import cors from 'cors';
import promClient from 'prom-client';

export function createApp(db) {
  const app = express();
  const register = new promClient.Registry();

  promClient.collectDefaultMetrics({
    register,
    prefix: 'dinner_served_',
  });

  const httpRequestCounter = new promClient.Counter({
    name: 'dinner_served_http_requests_total',
    help: 'Total HTTP requests handled by the backend',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
  });

  const httpRequestDuration = new promClient.Histogram({
    name: 'dinner_served_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [register],
  });

  const recipesTotalGauge = new promClient.Gauge({
    name: 'dinner_served_recipes_total',
    help: 'Current number of recipes in the cookbook database',
    registers: [register],
  });

  const updateRecipeMetrics = () => {
    const recipeCount = db.prepare('SELECT COUNT(*) AS count FROM recipes').get().count;
    recipesTotalGauge.set(recipeCount);
  };

  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    const endTimer = httpRequestDuration.startTimer();

    res.on('finish', () => {
      const route = req.route?.path || req.path;
      const labels = {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      };

      httpRequestCounter.inc(labels);
      endTimer(labels);
    });

    next();
  });

  app.get('/api/recipe/recipes', (req, res) => {
    try {
      const recipes = db.prepare(`
        SELECT id, title, description, time_minutes, price, link
        FROM recipes
      `).all();
      updateRecipeMetrics();

      const recipesWithTags = recipes.map(recipe => {
        const tags = db.prepare(`
          SELECT t.id, t.name
          FROM tags t
          JOIN recipe_tags rt ON t.id = rt.tag_id
          WHERE rt.recipe_id = ?
        `).all(recipe.id);
        return { ...recipe, tags };
      });

      res.json(recipesWithTags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/recipe/ingredients', (req, res) => {
    try {
      const ingredients = db.prepare(`
        SELECT id, name, unit, category
        FROM ingredients
      `).all();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/recipe/tags', (req, res) => {
    try {
      const tags = db.prepare(`
        SELECT id, name
        FROM tags
      `).all();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/recipe/recipes/:id', (req, res) => {
    try {
      const recipe = db.prepare(`
        SELECT id, title, description, time_minutes, price, link
        FROM recipes WHERE id = ?
      `).get(req.params.id);

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const tags = db.prepare(`
        SELECT t.id, t.name
        FROM tags t
        JOIN recipe_tags rt ON t.id = rt.tag_id
        WHERE rt.recipe_id = ?
      `).all(recipe.id);

      const ingredients = db.prepare(`
        SELECT i.id, i.name, ri.amount, ri.unit
        FROM ingredients i
        JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
        WHERE ri.recipe_id = ?
      `).all(recipe.id);

      res.json({ ...recipe, tags, ingredients });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/swagger-schema', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: { title: 'Dinner Served API', version: '1.0.0' },
      paths: {
        '/api/recipe/recipes': {
          get: {
            summary: 'Get all recipes',
            responses: {
              200: { description: 'List of recipes with tags' },
            },
          },
        },
        '/api/recipe/recipes/{id}': {
          get: {
            summary: 'Get a recipe by ID',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: {
              200: { description: 'Recipe with tags and ingredients' },
              404: { description: 'Recipe not found' },
            },
          },
        },
        '/api/recipe/ingredients': {
          get: {
            summary: 'Get all ingredients',
            responses: {
              200: { description: 'List of ingredients' },
            },
          },
        },
        '/api/recipe/tags': {
          get: {
            summary: 'Get all tags',
            responses: {
              200: { description: 'List of tags' },
            },
          },
        },
        '/health': {
          get: {
            summary: 'Health check',
            responses: {
              200: { description: 'Backend status' },
            },
          },
        },
      },
    });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running' });
  });

  app.get('/metrics', async (req, res) => {
    updateRecipeMetrics();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  return app;
}
