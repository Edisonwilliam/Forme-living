/**
 * Auth API service — typed wrappers around /api/auth
 */

import { apiClient } from '../lib/apiClient';
import type { User } from '../types';

export interface AuthResponse {
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  token: string;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', {
      name,
      email,
      password,
    });
    const { token, user } = res.data.data;
    localStorage.setItem('forme_token', token);
    return { token, user };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', {
      email,
      password,
    });
    const { token, user } = res.data.data;
    localStorage.setItem('forme_token', token);
    return { token, user };
  },

  async googleLogin(credential: string): Promise<AuthResponse> {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/google', {
      credential,
    });
    const { token, user } = res.data.data;
    localStorage.setItem('forme_token', token);
    return { token, user };
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout').catch(() => {/* ignore network errors on logout */});
    localStorage.removeItem('forme_token');
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return res.data.data;
  },

  async updateProfile(updates: { name?: string }): Promise<User> {
    const res = await apiClient.patch<{ success: boolean; data: User }>('/auth/me', updates);
    return res.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    localStorage.removeItem('forme_token');
  },
};
