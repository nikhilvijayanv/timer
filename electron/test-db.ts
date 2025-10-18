import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

export function testDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'test.db');
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY,
      value TEXT
    )
  `);

  const insert = db.prepare('INSERT INTO test (value) VALUES (?)');
  insert.run('Hello from better-sqlite3!');

  const rows = db.prepare('SELECT * FROM test').all();
  console.log('Database test successful:', rows);

  db.close();
}
