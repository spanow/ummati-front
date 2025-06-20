import { VALIDATION_RULES } from '@/lib/constants';

/**
 * Validation utility functions
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Le mot de passe doit contenir au moins ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères`,
    };
  }
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate.getTime() > startDate.getTime();
};

export const validateMaxParticipants = (maxParticipants: number): boolean => {
  return maxParticipants >= VALIDATION_RULES.MAX_PARTICIPANTS_MIN;
};