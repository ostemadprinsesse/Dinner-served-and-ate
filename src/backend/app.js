import express from 'express';
import cors from 'cors';

export function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/recipe/recipes', (req, res) => {
    try {
      const recipes = db.prepare(`
        SELECT id, title, description, time_minutes, price, link
        FROM recipes
      `).all();

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

  app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running' });
  });

  return app;
}
