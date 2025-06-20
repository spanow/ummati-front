// Application constants
export const APP_CONFIG = {
  name: 'Ummati',
  description: 'Plateforme de bénévolat connectant bénévoles et associations',
  version: '1.0.0',
  author: 'Ummati Team',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  ONGS: '/ongs',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    EVENTS: '/admin/events',
    CREATE_EVENT: '/admin/events/create',
    VOLUNTEERS: '/admin/volunteers',
  },
} as const;

export const USER_ROLES = {
  VOLUNTEER: 'volunteer',
  ONG_ADMIN: 'ong_admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const EVENT_CATEGORIES = [
  { value: 'mission', label: 'Mission' },
  { value: 'collecte', label: 'Collecte' },
  { value: 'formation', label: 'Formation' },
  { value: 'sensibilisation', label: 'Sensibilisation' },
  { value: 'autre', label: 'Autre' },
] as const;

export const ONG_CATEGORIES = [
  { value: 'humanitaire', label: 'Humanitaire' },
  { value: 'environnement', label: 'Environnement' },
  { value: 'education', label: 'Éducation' },
  { value: 'sante', label: 'Santé' },
  { value: 'culture', label: 'Culture' },
  { value: 'sport', label: 'Sport' },
  { value: 'social', label: 'Social' },
] as const;

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  MAX_PARTICIPANTS_MIN: 1,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;