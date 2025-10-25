import { httpClient, ApiError, PaginatedResponse } from './base';

export interface Skill {
  id: number;
  name: string;
  category: string;
  level?: string | null;
}

export interface UserSkill extends Skill {
  userId: string;
  addedAt?: Date;
}

export const skillsApi = {
  async getAll(query?: string): Promise<Skill[]> {
    try {
      const params: Record<string, any> = {};
      if (query) params.q = query;

      const response = await httpClient.get<Skill[]>('/api/skills', params);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement des compétences', 500, 'SKILLS_ERROR');
    }
  },

  async search(query: string): Promise<Skill[]> {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const params = { q: query };
      const response = await httpClient.get<Skill[]>('/api/skills', params);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la recherche de compétences', 500, 'SEARCH_SKILLS_ERROR');
    }
  },

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    try {
      const response = await httpClient.get<UserSkill[]>(`/api/users/${userId}/skills`);
      return response.map(skill => ({
        ...skill,
        addedAt: skill.addedAt ? new Date(skill.addedAt) : undefined,
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du chargement des compétences utilisateur', 500, 'USER_SKILLS_ERROR');
    }
  },

  async updateUserSkills(userId: string, skillIds: number[]): Promise<UserSkill[]> {
    try {
      const response = await httpClient.put<UserSkill[]>(
        `/api/users/${userId}/skills`,
        { skillIds }
      );
      return response.map(skill => ({
        ...skill,
        addedAt: skill.addedAt ? new Date(skill.addedAt) : undefined,
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la mise à jour des compétences', 500, 'UPDATE_SKILLS_ERROR');
    }
  },

  async addUserSkill(userId: string, skillId: number): Promise<UserSkill> {
    try {
      const response = await httpClient.post<UserSkill>(
        `/api/users/${userId}/skills`,
        { skillId }
      );
      return {
        ...response,
        addedAt: response.addedAt ? new Date(response.addedAt) : undefined,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de l\'ajout de la compétence', 500, 'ADD_SKILL_ERROR');
    }
  },

  async removeUserSkill(userId: string, skillId: number): Promise<void> {
    try {
      await httpClient.delete(`/api/users/${userId}/skills/${skillId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la suppression de la compétence', 500, 'REMOVE_SKILL_ERROR');
    }
  },
};
