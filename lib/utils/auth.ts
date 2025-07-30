import { USER_ROLES } from '@/lib/constants';
import { User } from '@/types';

/**
 * Authentication utility functions
 */

export const isVolunteer = (user: User | null): boolean => {
  return user?.role === USER_ROLES.VOLUNTEER;
};

export const isOngAdmin = (user: User | null): boolean => {
  return user?.role === USER_ROLES.ONG_ADMIN;
};

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === USER_ROLES.SUPER_ADMIN;
};

export const hasAdminAccess = (user: User | null): boolean => {
  return isOngAdmin(user) || isSuperAdmin(user);
};

export const canManageEvents = (user: User | null): boolean => {
  return hasAdminAccess(user);
};

export const canManageVolunteers = (user: User | null): boolean => {
  return hasAdminAccess(user);
};

export const getDashboardRoute = (user: User | null): string => {
  if (!user) return '/';
  return hasAdminAccess(user) ? '/admin/dashboard' : '/dashboard';
};

export const getWelcomeMessage = (user: User | null): string => {
  if (!user) return '';
  
  if (isVolunteer(user)) {
    return 'Continuez votre aventure bénévole';
  }
  
  if (hasAdminAccess(user)) {
    return 'Gérez vos missions et bénévoles';
  }
  
  return 'Bienvenue sur Ummati';
};