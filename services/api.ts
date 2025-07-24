import { User, ONG, Event, Filters } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AuthResponse {
  token: string;
  user: User;
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
    throw new Error(errorData.message || 'Une erreur est survenue');
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

export const api = {
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      return apiRequest<AuthResponse>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    async register(data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: string;
    }): Promise<AuthResponse> {
      return apiRequest<AuthResponse>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
      return apiRequest<User>(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
      await apiRequest<void>(`/api/users/${userId}/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
  },

  users: {
    async getAll(): Promise<User[]> {
      return apiRequest<User[]>('/api/users');
    },

    async getById(id: string): Promise<User> {
      return apiRequest<User>(`/api/users/${id}`);
    },

    async delete(id: string): Promise<void> {
      await apiRequest<void>(`/api/users/${id}`, {
        method: 'DELETE',
      });
    },
  },

  ongs: {
    async getAll(filters?: Filters): Promise<PaginatedResponse<ONG>> {
      const queryParams = buildQueryParams(filters);
      return apiRequest<PaginatedResponse<ONG>>(`/api/ngos${queryParams}`);
    },

    async getById(id: string): Promise<ONG> {
      return apiRequest<ONG>(`/api/ngos/${id}`);
    },

    async getActiveVerified(): Promise<ONG[]> {
      return apiRequest<ONG[]>('/api/ngos/active-verified');
    },

    async create(data: Omit<ONG, 'id' | 'createdAt'>): Promise<ONG> {
      return apiRequest<ONG>('/api/ngos', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: Partial<ONG>): Promise<ONG> {
      return apiRequest<ONG>(`/api/ngos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string): Promise<void> {
      await apiRequest<void>(`/api/ngos/${id}`, {
        method: 'DELETE',
      });
    },

    async join(ongId: string, userId: string): Promise<ONG> {
      return apiRequest<ONG>(`/api/ngos/${ongId}/volunteers/${userId}`, {
        method: 'POST',
      });
    },
  },

  events: {
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

    async create(data: Omit<Event, 'id' | 'createdAt' | 'currentParticipants' | 'participantIds'>): Promise<Event> {
      const createData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      };

      return apiRequest<Event>('/api/events', {
        method: 'POST',
        body: JSON.stringify(createData),
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

    async delete(id: string): Promise<boolean> {
      await apiRequest<void>(`/api/events/${id}`, {
        method: 'DELETE',
      });
      return true;
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
  },
};