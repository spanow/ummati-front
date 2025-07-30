import { Event, Filters } from '@/types';
import { httpClient, ApiError, PaginatedResponse } from './base';
import { PAGINATION_DEFAULTS } from '@/lib/constants';

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
    try {
      const params: Record<string, any> = {};
      
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.city) params.city = filters.city;
      if (filters?.status) params.status = filters.status;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = Math.min(filters.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

      const response = await httpClient.get<Event[]>('/api/events', params);
      
      // Convert date strings to Date objects
      const events = response.map(event => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        createdAt: new Date(event.createdAt),
      }));

      // Create paginated response format
      return {
        data: events,
        total: events.length,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
        totalPages: Math.ceil(events.length / (filters?.limit || 12)),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement des événements', 500, 'EVENTS_ERROR');
    }
  },

  async getUpcoming(filters?: Filters): Promise<PaginatedResponse<Event>> {
    try {
      const params: Record<string, any> = {};
      
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.city) params.city = filters.city;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = Math.min(filters.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

      const response = await httpClient.get<Event[]>('/api/events/upcoming', params);
      
      // Convert date strings to Date objects
      const events = response.map(event => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        createdAt: new Date(event.createdAt),
      }));

      // Create paginated response format
      return {
        data: events,
        total: events.length,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
        totalPages: Math.ceil(events.length / (filters?.limit || 12)),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement des événements à venir', 500, 'UPCOMING_EVENTS_ERROR');
    }
  },

  async getById(id: string): Promise<Event> {
    try {
      const response = await httpClient.get<Event>(`/api/events/${id}`);
      
      // Convert date strings to Date objects
      return {
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement de l\'événement', 500, 'EVENT_ERROR');
    }
  },

  async create(data: CreateEventData): Promise<Event> {
    try {
      const response = await httpClient.post<Event>('/api/events', data);
      
      // Convert date strings to Date objects
      return {
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la création de l\'événement', 500, 'CREATE_EVENT_ERROR');
    }
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    try {
      const response = await httpClient.put<Event>(`/api/events/${id}`, data);
      
      // Convert date strings to Date objects
      return {
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la mise à jour de l\'événement', 500, 'UPDATE_EVENT_ERROR');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(`/api/events/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la suppression de l\'événement', 500, 'DELETE_EVENT_ERROR');
    }
  },

  async register(eventId: string, userId: string): Promise<Event> {
    try {
      const response = await httpClient.post<Event>(`/api/events/${eventId}/register/${userId}`);
      
      // Convert date strings to Date objects
      return {
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de l\'inscription à l\'événement', 500, 'REGISTER_ERROR');
    }
  },

  async unregister(eventId: string, userId: string): Promise<Event> {
    try {
      const response = await httpClient.delete<Event>(`/api/events/${eventId}/unregister/${userId}`);
      
      // Convert date strings to Date objects
      return {
        ...response,
        startDate: new Date(response.startDate),
        endDate: new Date(response.endDate),
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la désinscription de l\'événement', 500, 'UNREGISTER_ERROR');
    }
  },
};