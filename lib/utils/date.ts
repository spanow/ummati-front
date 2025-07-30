/**
 * Date utility functions
 */

export const formatDate = (date: Date, locale: string = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date, locale: string = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatTime = (date: Date, locale: string = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateShort = (date: Date, locale: string = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const isMultiDay = (startDate: Date, endDate: Date): boolean => {
  return endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000;
};

export const isDateInPast = (date: Date): boolean => {
  return date.getTime() < new Date().getTime();
};

export const isDateInFuture = (date: Date): boolean => {
  return date.getTime() > new Date().getTime();
};

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};