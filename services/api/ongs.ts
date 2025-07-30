import { ONG, Filters } from '@/types';
import { httpClient, ApiError, PaginatedResponse } from './base';
import { PAGINATION_DEFAULTS } from '@/lib/constants';

export const ongsApi = {
  async getAll(filters?: Filters): Promise<PaginatedResponse<ONG>> {
    try {
      const params: Record<string, any> = {};
      
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.city) params.city = filters.city;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = Math.min(filters.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

      const response = await httpClient.get<ONG[]>('/api/ngos', params);
      
      // Convert date strings to Date objects
      const ongs = response.map(ong => ({
        ...ong,
        createdAt: new Date(ong.createdAt),
      }));

      // Create paginated response format
      return {
        data: ongs,
        total: ongs.length,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
        totalPages: Math.ceil(ongs.length / (filters?.limit || 12)),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement des ONG', 500, 'ONGS_ERROR');
    }
  },

  async getActiveVerified(filters?: Filters): Promise<PaginatedResponse<ONG>> {
    try {
      const params: Record<string, any> = {};
      
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.city) params.city = filters.city;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = Math.min(filters.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

      const response = await httpClient.get<ONG[]>('/api/ngos/active-verified', params);
      
      // Convert date strings to Date objects
      const ongs = response.map(ong => ({
        ...ong,
        createdAt: new Date(ong.createdAt),
      }));

      // Create paginated response format
      return {
        data: ongs,
        total: ongs.length,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
        totalPages: Math.ceil(ongs.length / (filters?.limit || 12)),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement des ONG actives', 500, 'ACTIVE_ONGS_ERROR');
    }
  },

  async getById(id: string): Promise<ONG> {
    try {
      const response = await httpClient.get<ONG>(`/api/ngos/${id}`);
      
      // Convert date strings to Date objects
      return {
        ...response,
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement de l\'ONG', 500, 'ONG_ERROR');
    }
  },

  async create(data: Omit<ONG, 'id' | 'createdAt' | 'stats'>): Promise<ONG> {
    try {
      const response = await httpClient.post<ONG>('/api/ngos', data);
      
      // Convert date strings to Date objects
      return {
        ...response,
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la création de l\'ONG', 500, 'CREATE_ONG_ERROR');
    }
  },

  async update(id: string, data: Partial<ONG>): Promise<ONG> {
    try {
      const response = await httpClient.put<ONG>(`/api/ngos/${id}`, data);
      
      // Convert date strings to Date objects
      return {
        ...response,
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la mise à jour de l\'ONG', 500, 'UPDATE_ONG_ERROR');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(`/api/ngos/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la suppression de l\'ONG', 500, 'DELETE_ONG_ERROR');
    }
  },

  async addVolunteer(ngoId: string, userId: string): Promise<ONG> {
    try {
      const response = await httpClient.post<ONG>(`/api/ngos/${ngoId}/volunteers/${userId}`);
      
      // Convert date strings to Date objects
      return {
        ...response,
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de l\'ajout du bénévole', 500, 'ADD_VOLUNTEER_ERROR');
    }
  },

  async removeVolunteer(ngoId: string, userId: string): Promise<ONG> {
    try {
      const response = await httpClient.delete<ONG>(`/api/ngos/${ngoId}/volunteers/${userId}`);
      
      // Convert date strings to Date objects
      return {
        ...response,
        createdAt: new Date(response.createdAt),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la suppression du bénévole', 500, 'REMOVE_VOLUNTEER_ERROR');
    }
  },
};