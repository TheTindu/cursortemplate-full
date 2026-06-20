import 'dotenv/config';
import { isEnvironment } from '@todo/shared';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .string()
    .refine(isEnvironment, {
      message: 'NODE_ENV must be one of: development, production, test',
    })
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_PATH: z.string().default('./data/todo.db'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

/** Validated, typed application configuration. Read once at startup. */
export const config = parsed.data;
