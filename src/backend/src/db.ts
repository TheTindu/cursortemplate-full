import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Database as Db } from 'better-sqlite3';
import Database from 'better-sqlite3';

const MIGRATION_SQL = `
  -- Add schema migrations here.
`;

/**
 * Opens (or creates) a SQLite database at the given path, enables WAL mode,
 * and runs the schema migration.
 *
 * Pass `:memory:` to get an in-memory database (useful in tests).
 *
 * @param path - Filesystem path or `:memory:`.
 * @returns A ready-to-use Database instance.
 */
export function openDatabase(path: string): Db {
  if (path !== ':memory:') {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(MIGRATION_SQL);
  return db;
}
