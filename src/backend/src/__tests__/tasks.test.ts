import type { Task } from '@todo/shared';
import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { openDatabase } from '../db.js';

interface ApiErrorBody {
  error: { code: string; message: string };
}

let db: InstanceType<typeof Database>;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  db = openDatabase(':memory:');
  app = createApp(db);
});

afterEach(() => {
  db.close();
});

describe('GET /api/v1/tasks', () => {
  it('returns an empty array when no tasks exist', async () => {
    const res = await app.request('/api/v1/tasks');
    expect(res.status).toBe(200);
    const body = (await res.json()) as Task[];
    expect(body).toEqual([]);
  });
});

describe('POST /api/v1/tasks', () => {
  it('creates and returns a task', async () => {
    const res = await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Buy milk' }),
    });
    expect(res.status).toBe(201);
    const task = (await res.json()) as Task;
    expect(task).toMatchObject({ id: 1, title: 'Buy milk', completed: false });
    expect(typeof task.createdAt).toBe('string');
  });

  it('rejects an empty title', async () => {
    const res = await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as ApiErrorBody;
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a missing title', async () => {
    const res = await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/tasks/:id', () => {
  it('updates the title', async () => {
    await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Original' }),
    });

    const res = await app.request('/api/v1/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    });
    expect(res.status).toBe(200);
    const task = (await res.json()) as Task;
    expect(task.title).toBe('Updated');
    expect(task.completed).toBe(false);
  });

  it('rejects an empty title', async () => {
    await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Original' }),
    });

    const res = await app.request('/api/v1/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    expect(res.status).toBe(400);
  });

  it('toggles completed', async () => {
    await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Task' }),
    });

    const res = await app.request('/api/v1/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    expect(res.status).toBe(200);
    const task = (await res.json()) as Task;
    expect(task.completed).toBe(true);
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await app.request('/api/v1/tasks/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    expect(res.status).toBe(404);
    const body = (await res.json()) as ApiErrorBody;
    expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  it('deletes a task and returns 204', async () => {
    await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Task to delete' }),
    });

    const delRes = await app.request('/api/v1/tasks/1', { method: 'DELETE' });
    expect(delRes.status).toBe(204);

    const patchRes = await app.request('/api/v1/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    expect(patchRes.status).toBe(404);
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await app.request('/api/v1/tasks/999', { method: 'DELETE' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v1/tasks (clear completed)', () => {
  it('deletes only completed tasks, not active ones', async () => {
    await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Active task' }),
    });
    await app.request('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Completed task' }),
    });
    await app.request('/api/v1/tasks/2', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });

    const delRes = await app.request('/api/v1/tasks', { method: 'DELETE' });
    expect(delRes.status).toBe(204);

    const getRes = await app.request('/api/v1/tasks');
    const tasks = (await getRes.json()) as Task[];
    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.title).toBe('Active task');
    expect(tasks[0]?.completed).toBe(false);
  });

  it('returns 204 even when no completed tasks exist', async () => {
    const res = await app.request('/api/v1/tasks', { method: 'DELETE' });
    expect(res.status).toBe(204);
  });
});
