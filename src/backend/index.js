import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;

// Database setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'app.db');
const db = new Database(dbPath);
const app = createApp(db);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Database: ${dbPath}`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
});
