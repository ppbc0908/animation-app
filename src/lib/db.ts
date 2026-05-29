import { createClient, Client } from '@libsql/client';

let db: Client;

function getDb(): Client {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return db;
}

export async function initDB() {
  const client = getDb();
  // 先尝试添加新字段（如果已存在会忽略）
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0`);
  } catch {
    // 字段已存在，忽略
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN verify_token TEXT`);
  } catch {
    // 字段已存在，忽略
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN reset_token TEXT`);
  } catch {
    // 字段已存在，忽略
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN reset_expires INTEGER`);
  } catch {
    // 字段已存在，忽略
  }

  // 确保表存在
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      username TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      verify_token TEXT,
      reset_token TEXT,
      reset_expires INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export default { execute: (opts: any) => getDb().execute(opts) } as Client;
