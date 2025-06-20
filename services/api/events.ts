import { Event, Filters } from '@/types';
import { delay, ApiError, PaginatedResponse } from './base';
import { PAGINATION_DEFAULTS } from '@/lib/constants';
import eventsData from '@/data/events.json';

// Mock events database
const events: Event[] = eventsData.map(event => ({
  ...event,
  startDate: new Date(event.startDate),
  endDate: new Date(event.endDate),
  createdAt: new Date(event.createdAt),
})) as Event[];

export interface CreateEventData {
  ongId: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  address: string;
  city: string;
  maxParticipants: number;
  requirements?: string[];
  image?: string;
  status: string;
  createdBy: string;
}

export const eventsApi = {
  async getAll(filters?: Filters): Promise<PaginatedResponse<Event>> {
    await delay(400);
    
    let filteredEvents = [...events];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.category) {
      filteredEvents = filteredEvents.filter(event => event.category === filters.category);
    }

    if (filters?.city) {
      const cityTerm = filters.city.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.city.toLowerCase().includes(cityTerm)
      );
    }

    if (filters?.status) {
      filteredEvents = filteredEvents.filter(event => event.status === filters.status);
    }

    // Sort by start date
    filteredEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Apply pagination
    const page = filters?.page || PAGINATION_DEFAULTS.PAGE;
    const limit = Math.min(filters?.limit || PAGINATION_DEFAULTS.LIMIT, PAGINATION_DEFAULTS.MAX_LIMIT);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredEvents.slice(startIndex, endIndex),
      total: filteredEvents.length,
      page,
      limit,
      totalPages: Math.ceil(filteredEvents.length / limit),
    };
  },

  async getById(id: string): Promise<Event> {
    await delay(300);
    
    const event = events.find(e => e.id === id);
    if (!event) {
      throw new ApiError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }
    
    return event;
  },

  async create(data: CreateEventData): Promise<Event> {
    await delay(800);
    
    const newEvent: Event = {
      ...data,
      id: (events.length + 1).toString(),
      currentParticipants: 0,
      participantIds: [],
      createdAt: new Date(),
    };

    events.push(newEvent);
    return newEvent;
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    await delay(600);
    
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new ApiError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...data,
    };

    return events[eventIndex];
  },

  async delete(id: string): Promise<void> {
    await delay(400);
    
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new ApiError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }

    events.splice(eventIndex, 1);
  },

  async register(eventId: string, userId: string): Promise<Event> {
    await delay(600);
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new ApiError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }

    const event = events[eventIndex];
    
    if (event.currentParticipants >= event.maxParticipants) {
      throw new ApiError('Événement complet', 400, 'EVENT_FULL');
    }

    if (event.participantIds.includes(userId)) {
      throw new ApiError('Déjà inscrit à cet événement', 400, 'ALREADY_REGISTERED');
    }

    event.participantIds.push(userId);
    event.currentParticipants += 1;

    return event;
  },

  async unregister(eventId: string, userId: string): Promise<Event> {
    await delay(400);
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new ApiError('Événement non trouvé', 404, 'EVENT_NOT_FOUND');
    }

    const event = events[eventIndex];
    
    if (!event.participantIds.includes(userId)) {
      throw new ApiError('Non inscrit à cet événement', 400, 'NOT_REGISTERED');
    }

    event.participantIds = event.participantIds.filter(id => id !== userId);
    event.currentParticipants -= 1;

    return event;
  },
};