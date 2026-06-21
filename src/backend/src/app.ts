import { Hono } from 'hono';

export function createApp(): Hono {
  const app = new Hono();
  return app;
}
