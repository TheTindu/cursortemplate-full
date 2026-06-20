/**
 * Public API of the shared package.
 * Both `src/frontend` and `src/backend` import exclusively from here.
 */

export type { CreateTaskBody, TaskListResponse, UpdateTaskBody } from './api.js';
export {
  CreateTaskBodySchema,
  TaskListResponseSchema,
  UpdateTaskBodySchema,
} from './api.js';
export type { Environment } from './environment.js';
export { ENVIRONMENT, isEnvironment } from './environment.js';
export type { ApiError, ApiErrorCode } from './errors.js';
export { API_ERROR_CODES, ApiErrorSchema } from './errors.js';
export type { Task } from './task.js';
export { TaskSchema } from './task.js';
