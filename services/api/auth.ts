import { User } from '@/types';
import { delay, ApiError } from './base';
import usersData from '@/data/users.json';

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

// Mock user database
const users: User[] = usersData.map(user => ({
  ...user,
  createdAt: new Date(user.createdAt),
  updatedAt: new Date(user.updatedAt),
})) as User[];

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);
    
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new ApiError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      token: `mock-jwt-token-${user.id}`,
      user: userWithoutPassword as User,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000);
    
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new ApiError('Cet email est déjà utilisé', 409, 'EMAIL_EXISTS');
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      ...data,
      role: data.role as 'volunteer' | 'ong_admin' | 'super_admin',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      token: `mock-jwt-token-${newUser.id}`,
      user: userWithoutPassword as User,
    };
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(600);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new ApiError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date(),
    };

    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword as User;
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await delay(800);
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
    }

    if (user.password !== currentPassword) {
      throw new ApiError('Mot de passe actuel incorrect', 400, 'INVALID_PASSWORD');
    }

    user.password = newPassword;
    user.updatedAt = new Date();
  },

  async requestPasswordReset(email: string): Promise<void> {
    await delay(1000);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if email exists for security
      return;
    }

    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`);
  },
};