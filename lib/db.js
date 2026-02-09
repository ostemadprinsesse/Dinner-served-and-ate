import path from 'node:path';
import Database from 'sqlite3';
import Database from 'better-sqlite3';

export const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'app.db');

// Open a connection using better-sqlite3 (synchronous driver)
export function openDb() {
  return new Database(DB_PATH);
}

export function allAsync(db, sql, params = []) {
  return Promise.resolve(db.prepare(sql).all(...params));
}

export function getAsync(db, sql, params = []) {
  return Promise.resolve(db.prepare(sql).get(...params));
}

export function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const info = db.prepare(sql).run(...params);
      resolve({ lastID: info.lastInsertRowid, changes: info.changes });
    } catch (err) {
      reject(err);
    }
  });
}
