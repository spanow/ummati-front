import { authApi } from './api/auth';
import { eventsApi } from './api/events';
import { ongsApi } from './api/ongs';

/**
 * Centralized API service using real HTTP endpoints
 */
export const api = {
  auth: authApi,
  events: eventsApi,
  ongs: ongsApi,
} as const;

export * from './api/base';
export * from './api/auth';
export * from './api/events';
export * from './api/ongs';