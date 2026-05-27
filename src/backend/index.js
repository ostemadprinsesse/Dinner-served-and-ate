import { createApp } from './app.js';
import { createDb } from './db.js';

const PORT = Number(process.env.PORT ?? 5000);

const db = createDb();
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await db.destroy();
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
  process.exit(0);
});
