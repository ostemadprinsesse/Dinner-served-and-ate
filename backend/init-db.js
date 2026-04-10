import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

//File written by Mistral AI

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'app.db');

const db = new Database(dbPath);

function columnExists(table, column) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  return columns.some((c) => c.name === column);
}

function ensureColumn(table, column, definition) {
  if (!columnExists(table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    time_minutes INTEGER,
    price DECIMAL(10, 2),
    link TEXT
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    unit TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    amount TEXT,
    unit TEXT,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id),
    FOREIGN KEY(ingredient_id) REFERENCES ingredients(id),
    UNIQUE(recipe_id, ingredient_id)
  );

  CREATE TABLE IF NOT EXISTS recipe_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    UNIQUE(recipe_id, tag_id)
  );
`);

// Keep compatibility with legacy DB files that may have older table shapes.
ensureColumn('users', 'name', 'TEXT');
ensureColumn('recipes', 'description', 'TEXT');
ensureColumn('recipes', 'time_minutes', 'INTEGER');
ensureColumn('recipes', 'price', 'DECIMAL(10, 2)');
ensureColumn('recipes', 'link', 'TEXT');
ensureColumn('ingredients', 'unit', 'TEXT');
ensureColumn('ingredients', 'category', 'TEXT');
ensureColumn('recipe_ingredients', 'amount', 'TEXT');
ensureColumn('recipe_ingredients', 'unit', 'TEXT');

// Insert sample data
db.prepare('INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)').run(
  'test@example.com',
  'hashed_password_123',
  'Test User'
);

db.prepare('INSERT OR IGNORE INTO ingredients (name, unit, category) VALUES (?, ?, ?)').run('Tomatoes', 'kg', 'Vegetables');
db.prepare('INSERT OR IGNORE INTO ingredients (name, unit, category) VALUES (?, ?, ?)').run('Garlic', 'cloves', 'Vegetables');
db.prepare('INSERT OR IGNORE INTO ingredients (name, unit, category) VALUES (?, ?, ?)').run('Olive Oil', 'ml', 'Oils');
db.prepare('INSERT OR IGNORE INTO ingredients (name, unit, category) VALUES (?, ?, ?)').run('Pasta', 'g', 'Grains');
db.prepare('INSERT OR IGNORE INTO ingredients (name, unit, category) VALUES (?, ?, ?)').run('Basil', 'g', 'Herbs');

db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run('Italian');
db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run('Vegetarian');
db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run('Quick');
db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run('Dinner');

db.prepare('INSERT OR IGNORE INTO recipes (title, description, time_minutes, price, link) VALUES (?, ?, ?, ?, ?)').run(
  'Simple Pasta Tomato',
  'Step 1: Boil pasta in salted water.\n\nStep 2: Heat olive oil in a pan.\n\nStep 3: Add garlic and tomatoes.\n\nStep 4: Simmer for 10 minutes.\n\nStep 5: Combine pasta with sauce.\n\nStep 6: Serve with fresh basil.',
  25,
  '8.50',
  ''
);

db.prepare('INSERT OR IGNORE INTO recipes (title, description, time_minutes, price, link) VALUES (?, ?, ?, ?, ?)').run(
  'Garlic Pasta Aglio e Olio',
  'Step 1: Cook pasta until al dente.\n\nStep 2: Slice garlic thinly.\n\nStep 3: Heat olive oil in pan.\n\nStep 4: Add garlic, cook until golden.\n\nStep 5: Toss hot pasta with oil and garlic.\n\nStep 6: Season with salt and pepper.',
  15,
  '5.00',
  ''
);

// Associate tags with recipes
db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)').run(1, 1); // Recipe 1, Italian tag
db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)').run(1, 2); // Recipe 1, Vegetarian tag
db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)').run(1, 4); // Recipe 1, Dinner tag
db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)').run(2, 1); // Recipe 2, Italian tag
db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)').run(2, 2); // Recipe 2, Vegetarian tag
db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)').run(2, 3); // Recipe 2, Quick tag

// Associate ingredients with recipes
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(1, 1, '400', 'g'); // Tomatoes
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(1, 2, '3', 'cloves'); // Garlic
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(1, 3, '50', 'ml'); // Olive Oil
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(1, 4, '400', 'g'); // Pasta
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(1, 5, '10', 'g'); // Basil

db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(2, 4, '400', 'g'); // Pasta
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(2, 2, '5', 'cloves'); // Garlic
db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)').run(2, 3, '100', 'ml'); // Olive Oil

console.log('✅ Database initialized with schema and sample data');
console.log(`📁 Database: ${dbPath}`);

db.close();
