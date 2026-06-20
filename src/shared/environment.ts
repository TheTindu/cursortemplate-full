/**
 * Application environments.
 * A const map instead of a TypeScript `enum` (see `.cursor/rules/typescript.mdc`).
 */
export const ENVIRONMENT = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;

export type Environment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

/**
 * Type guard for {@link Environment}.
 *
 * @param value - Arbitrary input, typically `process.env.NODE_ENV`.
 * @returns `true` when `value` is a known environment.
 */
export const isEnvironment = (value: unknown): value is Environment =>
  typeof value === 'string' && Object.values(ENVIRONMENT).includes(value as Environment);
