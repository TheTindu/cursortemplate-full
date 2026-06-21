import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { config } from './config.js';
import { openDatabase } from './db.js';

openDatabase(config.DATABASE_PATH);
const app = createApp();

serve(
  {
    fetch: app.fetch,
    port: config.PORT,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port} [${config.NODE_ENV}]`);
  },
);
