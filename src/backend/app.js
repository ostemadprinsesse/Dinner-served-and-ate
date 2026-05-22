import express from 'express';
import cors from 'cors';

export function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/recipe/recipes', async (req, res) => {
    try {
      const recipes = await db('recipes')
        .select('id', 'title', 'description', 'time_minutes', 'price', 'link');

      const recipesWithTags = await Promise.all(
        recipes.map(async recipe => {
          const tags = await db('tags as t')
            .join('recipe_tags as rt', 't.id', 'rt.tag_id')
            .where('rt.recipe_id', recipe.id)
            .select('t.id', 't.name');
          return { ...recipe, tags };
        })
      );

      res.json(recipesWithTags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/recipe/ingredients', async (req, res) => {
    try {
      const ingredients = await db('ingredients')
        .select('id', 'name', 'unit', 'category');
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/recipe/tags', async (req, res) => {
    try {
      const tags = await db('tags').select('id', 'name');
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/recipe/recipes/:id', async (req, res) => {
    try {
      const recipe = await db('recipes')
        .select('id', 'title', 'description', 'time_minutes', 'price', 'link')
        .where('id', req.params.id)
        .first();

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const tags = await db('tags as t')
        .join('recipe_tags as rt', 't.id', 'rt.tag_id')
        .where('rt.recipe_id', recipe.id)
        .select('t.id', 't.name');

      const ingredients = await db('ingredients as i')
        .join('recipe_ingredients as ri', 'i.id', 'ri.ingredient_id')
        .where('ri.recipe_id', recipe.id)
        .select('i.id', 'i.name', 'ri.amount', 'ri.unit');

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
