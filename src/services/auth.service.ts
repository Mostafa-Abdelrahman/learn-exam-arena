
import ApiService from './api.service';

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
  major_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
  major_id?: string;
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
    const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<{ message: string; user: User }> {
    return await ApiService.post('/auth/register', userData);
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await ApiService.post('/auth/logout');
      return response;
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    return await ApiService.post('/auth/refresh');
  }

  // Profile Management
  async getCurrentUser(): Promise<User> {
    return await ApiService.get('/auth/user');
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<{ user: User }> {
    const response = await ApiService.put('/auth/profile', profileData);
    
    if (response.user) {
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return await ApiService.put('/auth/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword
    });
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    return await ApiService.upload('/auth/avatar', file);
  }

  // Password Reset
  async forgotPassword(data: PasswordResetRequest): Promise<{ message: string }> {
    return await ApiService.post('/auth/forgot-password', data);
  }

  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    return await ApiService.post('/auth/reset-password', data);
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
