import knex from 'knex';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function createDb() {
  const host = requireEnv('DB_HOST');
  const port = Number(process.env.DB_PORT ?? 5432);
  const user = requireEnv('DB_USER');
  const password = requireEnv('DB_PASSWORD');
  const database = requireEnv('DB_NAME');
  const sslEnabled = process.env.DB_SSL === 'true';

  return knex({
    client: 'pg',
    connection: {
      host,
      port,
      user,
      password,
      database,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false
    }
  });
}
