import { z } from 'zod';
import { TaskSchema } from './task.js';

const MAX_TITLE_LENGTH = 500;

/** Shared title validation rule — applied on both create and edit. */
const TitleSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, 'Title must not be empty')
      .max(MAX_TITLE_LENGTH, `Title must be at most ${MAX_TITLE_LENGTH} characters`),
  );

// POST /api/v1/tasks
export const CreateTaskBodySchema = z.object({
  title: TitleSchema,
});

export type CreateTaskBody = z.infer<typeof CreateTaskBodySchema>;

// PATCH /api/v1/tasks/:id
export const UpdateTaskBodySchema = z
  .object({
    title: TitleSchema.optional(),
    completed: z.boolean().optional(),
  })
  .refine((body) => body.title !== undefined || body.completed !== undefined, {
    message: 'At least one of title or completed must be provided',
  });

export type UpdateTaskBody = z.infer<typeof UpdateTaskBodySchema>;

// GET /api/v1/tasks — response
export const TaskListResponseSchema = z.array(TaskSchema);

export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;
