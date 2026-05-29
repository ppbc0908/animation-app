const fs = require('fs');
const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
}

const {createClient} = require('@libsql/client');
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function test() {
  try {
    // Simulate initDB
    try {
      await db.execute("ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0");
    } catch(e) { console.log('ALTER verified:', e.message); }
    try {
      await db.execute("ALTER TABLE users ADD COLUMN verify_token TEXT");
    } catch(e) { console.log('ALTER verify_token:', e.message); }
    try {
      await db.execute("ALTER TABLE users ADD COLUMN reset_token TEXT");
    } catch(e) { console.log('ALTER reset_token:', e.message); }
    try {
      await db.execute("ALTER TABLE users ADD COLUMN reset_expires INTEGER");
    } catch(e) { console.log('ALTER reset_expires:', e.message); }

    await db.execute(`
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
    console.log('CREATE TABLE done');

    const r = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', JSON.stringify(r.rows));
  } catch(e) {
    console.error('Fatal Error:', e.message);
  }
}
test();
