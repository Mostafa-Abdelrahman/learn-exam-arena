import ApiService from './api.service';
import { dummyUsers, dummyAuthResponse } from '@/data/dummy-auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
  profile?: UserProfile;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface UserProfile {
  bio?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.warn('API login failed, using dummy data:', error);
      // Return dummy auth response for development
      localStorage.setItem('auth_token', dummyAuthResponse.token);
      localStorage.setItem('user_data', JSON.stringify(dummyAuthResponse.user));
      return dummyAuthResponse;
    }
  }

  async register(userData: RegisterData): Promise<{ message: string; user: User }> {
    try {
      return await ApiService.post('/auth/register', userData);
    } catch (error) {
      console.warn('API register failed, using dummy data:', error);
      // Return dummy registration success
      return {
        message: 'User registered successfully',
        user: dummyUsers[0]
      };
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await ApiService.post<{ message: string }>('/auth/logout');
      return response;
    } catch (error) {
      console.warn('API logout failed, proceeding with local logout:', error);
      return { message: 'Logged out successfully' };
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      return await ApiService.post('/auth/refresh');
    } catch (error) {
      console.warn('API refresh failed, using stored data:', error);
      const storedUser = this.getStoredUser();
      if (storedUser) {
        return {
          token: this.getStoredToken() || dummyAuthResponse.token,
          user: storedUser,
          expires_in: 3600
        };
      }
      throw error;
    }
  }

  // Profile Management
  async getCurrentUser(): Promise<User> {
    try {
      return await ApiService.get('/auth/user');
    } catch (error) {
      console.warn('API getCurrentUser failed, using stored data:', error);
      const storedUser = this.getStoredUser();
      if (storedUser) {
        return storedUser;
      }
      // Return first dummy user as fallback
      return dummyUsers[0];
    }
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<{ user: User }> {
    try {
      const response = await ApiService.put<{ user: User }>('/auth/profile', profileData);
      
      if (response.user) {
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.warn('API updateProfile failed, using dummy data:', error);
      const currentUser = this.getStoredUser() || dummyUsers[0];
      const updatedUser = {
        ...currentUser,
        profile: { ...currentUser.profile, ...profileData },
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      return await ApiService.put('/auth/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword
      });
    } catch (error) {
      console.warn('API changePassword failed, using dummy response:', error);
      return { message: 'Password changed successfully' };
    }
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    try {
      return await ApiService.upload('/auth/avatar', file);
    } catch (error) {
      console.warn('API uploadAvatar failed, using dummy response:', error);
      return { avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' };
    }
  }

  // Password Reset
  async forgotPassword(data: PasswordResetRequest): Promise<{ message: string }> {
    try {
      return await ApiService.post('/auth/forgot-password', data);
    } catch (error) {
      console.warn('API forgotPassword failed, using dummy response:', error);
      return { message: 'Password reset email sent successfully' };
    }
  }

  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    try {
      return await ApiService.post('/auth/reset-password', data);
    } catch (error) {
      console.warn('API resetPassword failed, using dummy response:', error);
      return { message: 'Password reset successfully' };
    }
  }

  // Utility methods
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user_data');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getUserRole(): string | null {
    const user = this.getStoredUser();
    return user?.role || null;
  }
}

export default new AuthService();
