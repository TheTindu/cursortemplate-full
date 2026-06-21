/**
 * Public API of the shared package.
 * Both `src/frontend` and `src/backend` import exclusively from here.
 */

export type { Environment } from './environment.js';
export { ENVIRONMENT, isEnvironment } from './environment.js';
export type { ApiError, ApiErrorCode } from './errors.js';
export { API_ERROR_CODES, ApiErrorSchema } from './errors.js';
