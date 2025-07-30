import { Event } from '@/types';

/**
 * Event utility functions
 */

export const getEventProgress = (event: Event): number => {
  return Math.round((event.currentParticipants / event.maxParticipants) * 100);
};

export const getSpotsLeft = (event: Event): number => {
  return event.maxParticipants - event.currentParticipants;
};

export const isEventFull = (event: Event): boolean => {
  return getSpotsLeft(event) <= 0;
};

export const isEventAlmostFull = (event: Event, threshold: number = 3): boolean => {
  const spotsLeft = getSpotsLeft(event);
  return spotsLeft <= threshold && spotsLeft > 0;
};

export const isEventUpcoming = (event: Event): boolean => {
  return event.startDate.getTime() > new Date().getTime();
};

export const isEventOngoing = (event: Event): boolean => {
  const now = new Date().getTime();
  return event.startDate.getTime() <= now && event.endDate.getTime() >= now;
};

export const isEventCompleted = (event: Event): boolean => {
  return event.endDate.getTime() < new Date().getTime();
};

export const canRegisterForEvent = (event: Event): boolean => {
  return isEventUpcoming(event) && !isEventFull(event) && event.status === 'published';
};

export const getEventDuration = (event: Event): string => {
  const diffMs = event.endDate.getTime() - event.startDate.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
};

export const sortEventsByDate = (events: Event[], ascending: boolean = true): Event[] => {
  return [...events].sort((a, b) => {
    const comparison = a.startDate.getTime() - b.startDate.getTime();
    return ascending ? comparison : -comparison;
  });
};

export const filterEventsByStatus = (events: Event[], status: string): Event[] => {
  return events.filter(event => event.status === status);
};

export const filterUpcomingEvents = (events: Event[]): Event[] => {
  return events.filter(isEventUpcoming);
};