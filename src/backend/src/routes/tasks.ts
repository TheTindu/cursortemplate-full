import { zValidator } from '@hono/zod-validator';
import type { Task } from '@todo/shared';
import { API_ERROR_CODES, CreateTaskBodySchema, UpdateTaskBodySchema } from '@todo/shared';
import type { Database } from 'better-sqlite3';
import { Hono } from 'hono';

/** Raw row shape returned by SQLite — completed stored as 0/1. */
interface DbRow {
  id: number;
  title: string;
  completed: number;
  created_at: string;
}

/** Converts a raw database row to the canonical Task shape. */
function toTask(row: DbRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

/** Builds the validation error hook used by every zValidator call. */
const validationHook = (
  result: { success: boolean; error?: { message: string } },
  c: { json: (body: unknown, status: number) => Response },
) => {
  if (!result.success) {
    return c.json(
      {
        error: {
          code: API_ERROR_CODES.ValidationError,
          message: result.error?.message ?? 'Validation failed',
        },
      },
      400,
    );
  }
};

/**
 * Creates and returns a Hono router containing all `/tasks` endpoints.
 *
 * @param db - An open SQLite database instance (may be in-memory for tests).
 */
export function createTaskRoutes(db: Database): Hono {
  const app = new Hono();

  /** GET / — list all tasks ordered by id ASC */
  app.get('/', (c) => {
    const rows = db.prepare('SELECT * FROM tasks ORDER BY id ASC').all() as DbRow[];
    return c.json(rows.map(toTask));
  });

  /** POST / — create a new task */
  app.post('/', zValidator('json', CreateTaskBodySchema, validationHook), (c) => {
    const body = c.req.valid('json');
    const createdAt = new Date().toISOString();
    const insert = db.prepare('INSERT INTO tasks (title, completed, created_at) VALUES (?, 0, ?)');
    const result = insert.run(body.title, createdAt);
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as DbRow;
    return c.json(toTask(row), 201);
  });

  /** PATCH /:id — update title and/or completed */
  app.patch('/:id', zValidator('json', UpdateTaskBodySchema, validationHook), (c) => {
    const id = Number(c.req.param('id'));
    const body = c.req.valid('json');

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as DbRow | undefined;
    if (!existing) {
      return c.json(
        { error: { code: API_ERROR_CODES.NotFound, message: `Task ${id} not found` } },
        404,
      );
    }

    const newTitle = body.title !== undefined ? body.title : existing.title;
    const newCompleted =
      body.completed !== undefined ? (body.completed ? 1 : 0) : existing.completed;

    db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?').run(
      newTitle,
      newCompleted,
      id,
    );

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as DbRow;
    return c.json(toTask(updated));
  });

  /** DELETE / — hard-delete all completed tasks */
  app.delete('/', (_c) => {
    db.prepare('DELETE FROM tasks WHERE completed = 1').run();
    return new Response(null, { status: 204 });
  });

  /** DELETE /:id — hard-delete a single task */
  app.delete('/:id', (c) => {
    const id = Number(c.req.param('id'));

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as DbRow | undefined;
    if (!existing) {
      return c.json(
        { error: { code: API_ERROR_CODES.NotFound, message: `Task ${id} not found` } },
        404,
      );
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return new Response(null, { status: 204 });
  });

  return app;
}
