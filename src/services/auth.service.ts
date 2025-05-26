
import api from '../api/config';

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
  major?: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

const AuthService = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async register(userData: RegisterData): Promise<{ message: string; user: User }> {
    const response = await api.post('/register', userData);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post('/logout');
      return response.data;
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data;
  },

  // Password reset
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Promise<{ message: string }> {
    const response = await api.post('/reset-password', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation
    });
    return response.data;
  },

  // Token management
  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },

  getUserRole(): string | null {
    const user = this.getStoredUser();
    return user?.role || null;
  },

  // Profile management
  async updateProfile(userData: Partial<User>): Promise<{ data: User }> {
    const response = await api.put('/user/profile', userData);
    
    // Update stored user data
    const updatedUser = response.data.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
    const response = await api.put('/user/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword
    });
    return response.data;
  }
};

export default AuthService;
