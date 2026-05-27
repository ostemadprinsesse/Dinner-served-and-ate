const path = require('node:path');

const sslEnabled = process.env.DB_SSL === 'true';

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false
  },
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    loadExtensions: ['.cjs']
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
    loadExtensions: ['.cjs']
  }
};
