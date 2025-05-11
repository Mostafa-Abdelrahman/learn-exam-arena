
import api from '../api/config';

// User types
export interface User {
  id: string;
  user_id: string; 
  name: string;
  email: string;
  role: "admin" | "doctor" | "student";
  gender: "male" | "female" | "other";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  gender: "male" | "female" | "other";
  role: "admin" | "doctor" | "student";
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const AuthService = {
  // Login using API
  async login(credentials: LoginCredentials) {
    const response = await api.post('/login', credentials);
    
    // Store the token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Also store user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  // Logout using API
  async logout() {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token on client side even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    }
  },

  // Register using API
  async register(userData: RegisterData) {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Get current user from API
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Try to get from local storage first for faster response
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      // Make a request to get the authenticated user
      const response = await api.get('/user');
      
      // Cache the user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get user role
  async getUserRole(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user ? user.role : null;
  },
  
  // Request password reset
  async forgotPassword(email: PasswordResetRequest): Promise<any> {
    const response = await api.post('/forgot-password', email);
    return response.data;
  },
  
  // Reset password with token
  async resetPassword(resetData: PasswordResetData): Promise<any> {
    const response = await api.post('/reset-password', resetData);
    return response.data;
  }
};

export default AuthService;
