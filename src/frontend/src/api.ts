import type { Task, UpdateTaskBody } from '@todo/shared';
import { ApiErrorSchema, TaskListResponseSchema, TaskSchema } from '@todo/shared';
import { config } from './config.js';

/** Parses error responses from the API and throws a descriptive Error. */
async function handleError(res: Response): Promise<never> {
  let message = `HTTP ${res.status}`;
  try {
    const body: unknown = await res.json();
    const parsed = ApiErrorSchema.safeParse(body);
    if (parsed.success) {
      message = parsed.data.error.message;
    }
  } catch {
    // ignore JSON parse errors
  }
  throw new Error(message);
}

/** Performs a fetch and throws on non-ok responses. */
async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    await handleError(res);
  }
  return res;
}

/** Fetches all tasks ordered by id ASC. */
export async function fetchTasks(): Promise<Task[]> {
  const res = await apiFetch('/tasks');
  const body: unknown = await res.json();
  return TaskListResponseSchema.parse(body);
}

/** Creates a new task and returns it. */
export async function createTask(title: string): Promise<Task> {
  const res = await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  const body: unknown = await res.json();
  return TaskSchema.parse(body);
}

/** Updates a task's title and/or completed state. */
export async function updateTask(id: number, patch: UpdateTaskBody): Promise<Task> {
  const res = await apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  const body: unknown = await res.json();
  return TaskSchema.parse(body);
}

/** Hard-deletes a single task by id. */
export async function deleteTask(id: number): Promise<void> {
  await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
}

/** Hard-deletes all completed tasks. */
export async function clearCompleted(): Promise<void> {
  await apiFetch('/tasks', { method: 'DELETE' });
}
