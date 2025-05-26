
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  gender: "male" | "female" | "other";
}

export interface PasswordResetRequest {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "doctor" | "admin";
  gender: "male" | "female" | "other";
}

export interface AuthResponse {
  token: string;
  user: User;
}

import api from '../api/config';

const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  async register(userData: RegisterData): Promise<{ message: string; user: User }> {
    const response = await api.post('/register', userData);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await api.post('/logout');
    return response.data;
  },

  async forgotPassword(data: PasswordResetRequest): Promise<{ message: string }> {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post('/reset-password', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data;
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      // Verify token with backend
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },

  async getUserRole(): Promise<string | null> {
    try {
      const user = await this.getCurrentUser();
      return user.role;
    } catch (error) {
      return null;
    }
  },
};

export default AuthService;
