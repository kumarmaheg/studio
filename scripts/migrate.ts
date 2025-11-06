import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { readFile } from 'fs/promises';

async function migrate() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  const migration = await readFile('migrations/001-add-date-to-sales.sql', 'utf-8');
  await db.exec(migration);

  console.log('Migration completed successfully.');
}

migrate();
