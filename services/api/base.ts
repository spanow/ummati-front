/**
 * Base API configuration and utilities
 */

import { APP_CONFIG } from '@/lib/constants';

export const API_CONFIG = {
  BASE_URL: APP_CONFIG.apiUrl,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const withRetry = async <T>(
  fn: () => Promise<T>,
  attempts: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts > 1) {
      await delay(1000);
      return withRetry(fn, attempts - 1);
    }
    throw error;
  }
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * HTTP client utility
 */
export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Backend error data:', errorData); // Pour debug
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // Cas 1: erreur simple avec "error"
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Cas 2: erreur simple avec "message"  
        else if (errorData.message && !errorData.data) {
          errorMessage = errorData.message;
        }
        // Cas 3: erreurs de validation avec "data"
        else if (errorData.data && typeof errorData.data === 'object') {
          const firstError = Object.values(errorData.data)[0];
          errorMessage = firstError as string;
        }
        
        throw new ApiError(errorMessage, response.status, errorData.code);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();