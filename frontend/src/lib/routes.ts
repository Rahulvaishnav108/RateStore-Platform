import type { Role } from '@/types';

export function getChangePasswordPath(role?: Role | string): string {
  switch (role) {
    case 'admin':
      return '/admin/change-password';
    case 'user':
      return '/user/change-password';
    case 'store_owner':
      return '/owner/change-password';
    default:
      return '/login';
  }
}

export function getRoleHomePath(role?: Role | string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'user':
      return '/user';
    case 'store_owner':
      return '/owner';
    default:
      return '/login';
  }
}
