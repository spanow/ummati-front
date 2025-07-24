import { Event, Filters } from '@/types';
import { delay, ApiError, PaginatedResponse } from './base';
import { PAGINATION_DEFAULTS } from '@/lib/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new ApiError(
      errorData.message || 'Une erreur est survenue',
      response.status,
      errorData.code || 'API_ERROR'
    );
  }

  return response.json();
}

function buildQueryParams(filters?: Filters): string {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  return params.toString() ? `?${params.toString()}` : '';
}

export const eventsApi = {
  async getAll(filters?: Filters): Promise<PaginatedResponse<Event>> {
    const queryParams = buildQueryParams(filters);
    return apiRequest<PaginatedResponse<Event>>(`/api/events${queryParams}`);
  },

  async getById(id: string): Promise<Event> {
    return apiRequest<Event>(`/api/events/${id}`);
  },

  async getUpcoming(): Promise<Event[]> {
    return apiRequest<Event[]>('/api/events/upcoming');
  },

  async create(data: CreateEventData): Promise<Event> {
    return apiRequest<Event>('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      }),
    });
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const updateData = { ...data };
    
    // Convert dates to ISO strings if present
    if (updateData.startDate) {
      updateData.startDate = updateData.startDate.toISOString() as any;
    }
    if (updateData.endDate) {
      updateData.endDate = updateData.endDate.toISOString() as any;
    }
    
    return apiRequest<Event>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  async register(eventId: string, userId: string): Promise<Event> {
    return apiRequest<Event>(`/api/events/${eventId}/register/${userId}`, {
      method: 'POST',
    });
  },

  async unregister(eventId: string, userId: string): Promise<Event> {
    await apiRequest<void>(`/api/events/${eventId}/unregister/${userId}`, {
      method: 'DELETE',
    });
    
    // Return updated event
    return this.getById(eventId);
  },
};