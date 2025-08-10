import { User } from '@/types';
import { httpClient, ApiError } from './base';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<{ token: string; user: User }>('/api/users/login', credentials);
      return {
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion', 500, 'LOGIN_ERROR');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<User>('/api/users', data);
      
      return this.login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Erreur lors de l\'inscription', 500, 'REGISTER_ERROR');
    }
  },

  async updateProfile(userId: string, data: Partial<User>) {
    const body = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      bio: (data as any).bio,
      location: (data as any).location,
      wilayaId: (data as any).wilayaId,
      cityId: (data as any).cityId,
      avatar: data.avatar,
      skills: (data as any).skills,
    };
    return httpClient.put(`/api/users/${userId}/profile`, body);
  },
  
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await httpClient.post(`/api/users/${userId}/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors du changement de mot de passe', 500, 'PASSWORD_ERROR');
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await httpClient.post('/api/users/password-reset', { email });
    } catch (error) {
      // Don't throw error for security reasons
      console.log('Password reset requested for:', email);
    }
  },

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await httpClient.get<User>(`/api/users/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la récupération de l\'utilisateur', 500, 'USER_ERROR');
    }
  },
  async getProfile(): Promise<User> {
    try {
      const response = await httpClient.get<User>('/api/users/me');
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la récupération du profil', 500, 'PROFILE_ERROR');
    }
  },
  
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await httpClient.get<User[]>('/api/users');
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur lors de la récupération des utilisateurs', 500, 'USERS_ERROR');
    }
  },
};
