// Core application constants
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STORE_OWNER: 'store_owner'
} as const;

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.USER]: 'User',
  [ROLES.STORE_OWNER]: 'Store Owner'
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
} as const;

export const VALIDATION = {
  NAME_MIN: 20,
  NAME_MAX: 60,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 16,
  ADDRESS_MAX: 400
} as const;

export const RATINGS = {
  MIN: 1,
  MAX: 5,
  LABELS: {
    1: 'Poor 😞',
    2: 'Fair 😐',
    3: 'Good 🙂',
    4: 'Very Good 😊',
    5: 'Excellent 🤩'
  }
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  ADMIN: {
    USERS: '/admin/users',
    STORES: '/admin/stores',
    DASHBOARD: '/admin/dashboard'
  },
  STORES: '/stores',
  RATINGS: '/ratings',
  OWNER: '/owner'
} as const;

export const QUERY_KEYS = {
  AUTH: ['auth'],
  USERS: ['users'],
  STORES: ['stores'],
  RATINGS: ['ratings'],
  DASHBOARD: ['dashboard'],
  OWNER: ['owner']
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type Theme = typeof THEMES[keyof typeof THEMES];