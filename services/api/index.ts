import { authApi } from './auth';
import { eventsApi } from './events';
import { ongsApi } from './ongs';

/**
 * Centralized API service
 */
export const api = {
  auth: authApi,
  events: eventsApi,
  ongs: ongsApi,
} as const;

export * from './base';
export * from './auth';
export * from './events';
export * from './ongs';