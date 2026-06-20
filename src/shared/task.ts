import { z } from 'zod';

/** Canonical domain entity — a single thing the user intends to do. */
export const TaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;
