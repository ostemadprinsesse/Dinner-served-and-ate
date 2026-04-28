import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'app.db');
const db = new Database(dbPath);

// API Routes

// Get all recipes with ingredients
app.get('/api/recipe/recipes', (req, res) => {
  try {
    const recipes = db.prepare(`
      SELECT id, title, description, time_minutes, price, link
      FROM recipes
    `).all();
    
    // Add tags for each recipe
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
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all ingredients
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

// Get all tags
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

// Get single recipe by ID
app.get('/api/recipe/recipes/:id', (req, res) => {
  try {
    const recipe = db.prepare(`
      SELECT id, title, description, time_minutes, price, link
      FROM recipes
      WHERE id = ?
    `).get(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Get tags for this recipe
    const tags = db.prepare(`
      SELECT t.id, t.name
      FROM tags t
      JOIN recipe_tags rt ON t.id = rt.tag_id
      WHERE rt.recipe_id = ?
    `).all(recipe.id);

    // Get ingredients for this recipe
    const ingredients = db.prepare(`
      SELECT i.id, i.name, ri.amount, ri.unit
      FROM ingredients i
      JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ?
    `).all(recipe.id);

    res.json({ ...recipe, tags, ingredients });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Database: ${dbPath}`);
});