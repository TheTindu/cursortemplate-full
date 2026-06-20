/** Centralised runtime config — the only place that reads import.meta.env. */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
} as const;
