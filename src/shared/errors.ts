import { z } from 'zod';

/** Wire-format for all API errors. */
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const API_ERROR_CODES = {
  NotFound: 'RESOURCE_NOT_FOUND',
  ValidationError: 'VALIDATION_ERROR',
  InternalError: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
