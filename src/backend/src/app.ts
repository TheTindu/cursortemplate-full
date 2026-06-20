import type { Database } from 'better-sqlite3';
import { Hono } from 'hono';
import { createTaskRoutes } from './routes/tasks.js';

/**
 * Assembles the Hono application, wiring all routes.
 *
 * @param db - An open SQLite database instance.
 * @returns A configured Hono app ready to serve requests.
 */
export function createApp(db: Database): Hono {
  const app = new Hono();
  app.route('/api/v1/tasks', createTaskRoutes(db));
  return app;
}
