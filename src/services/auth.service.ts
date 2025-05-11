
import api from '../api/config';

// User types
export interface User {
  id: string;
  user_id: string; // Adding this property to fix the type errors
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

const AuthService = {
  // Login using Laravel API
  async login(credentials: LoginCredentials) {
    const response = await api.post('/login', credentials);
    
    // Store the token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  // Logout using Laravel API
  async logout() {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token on client side even if API call fails
      localStorage.removeItem('token');
      return true;
    }
  },

  // Register using Laravel API
  async register(userData: RegisterData) {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Get current user from Laravel API
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Make a request to get the authenticated user
      const response = await api.get('/user');
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
  }
};

export default AuthService;
