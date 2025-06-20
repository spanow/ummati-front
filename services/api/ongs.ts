import { ONG, Filters } from '@/types';
import { delay, ApiError, PaginatedResponse } from './base';
import { PAGINATION_DEFAULTS } from '@/lib/constants';
import ongsData from '@/data/ongs.json';

// Mock ONGs database
const ongs: ONG[] = ongsData.map(ong => ({
  ...ong,
  createdAt: new Date(ong.createdAt),
})) as ONG[];

export const ongsApi = {
  async getAll(filters?: Filters): Promise<PaginatedResponse<ONG>> {
    await delay(400);
    
    let filteredOngs = [...ongs];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOngs = filteredOngs.filter(ong =>
        ong.name.toLowerCase().includes(searchTerm) ||
        ong.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.category) {
      filteredOngs = filteredOngs.filter(ong => ong.category === filters.category);
    }

    if (filters?.city) {
      const cityTerm = filters.city.toLowerCase();
      filteredOngs = filteredOngs.filter(ong =>
        ong.city.toLowerCase().includes(cityTerm)
      );
    }

    // Apply pagination
    const page = filters?.page || PAGINATION_DEFAULTS.PAGE;
    const limit = Math.min(filters?.limit || PAGINATION_DEFAULTS.LIMIT, PAGINATION_DEFAULTS.MAX_LIMIT);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredOngs.slice(startIndex, endIndex),
      total: filteredOngs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOngs.length / limit),
    };
  },

  async getById(id: string): Promise<ONG> {
    await delay(300);
    
    const ong = ongs.find(o => o.id === id);
    if (!ong) {
      throw new ApiError('ONG non trouvée', 404, 'ONG_NOT_FOUND');
    }
    
    return ong;
  },

  async join(ongId: string, userId: string): Promise<ONG> {
    await delay(500);
    
    const ongIndex = ongs.findIndex(o => o.id === ongId);
    if (ongIndex === -1) {
      throw new ApiError('ONG non trouvée', 404, 'ONG_NOT_FOUND');
    }

    const ong = ongs[ongIndex];
    
    if (ong.volunteerIds.includes(userId)) {
      throw new ApiError('Déjà membre de cette ONG', 400, 'ALREADY_MEMBER');
    }

    ong.volunteerIds.push(userId);
    ong.stats.totalVolunteers += 1;

    return ong;
  },

  async leave(ongId: string, userId: string): Promise<ONG> {
    await delay(400);
    
    const ongIndex = ongs.findIndex(o => o.id === ongId);
    if (ongIndex === -1) {
      throw new ApiError('ONG non trouvée', 404, 'ONG_NOT_FOUND');
    }

    const ong = ongs[ongIndex];
    
    if (!ong.volunteerIds.includes(userId)) {
      throw new ApiError('Non membre de cette ONG', 400, 'NOT_MEMBER');
    }

    ong.volunteerIds = ong.volunteerIds.filter(id => id !== userId);
    ong.stats.totalVolunteers -= 1;

    return ong;
  },
};