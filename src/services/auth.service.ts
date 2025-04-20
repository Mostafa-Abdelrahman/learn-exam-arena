
import axios from "axios";

// Set your Laravel backend base URL here
const API_URL = "http://localhost:8000/api";

// Create an axios instance with default config
const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is important for Laravel Sanctum to work properly
});

// Add interceptor to add token to requests
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User types
export interface User {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "doctor" | "student";
  gender: "male" | "female" | "other";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const AuthService = {
  // Login and get token
  async login(credentials: LoginCredentials) {
    try {
      const response = await authAPI.post("/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout and remove token
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return authAPI.post("/logout");
  },

  // Get current user
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  // Register user (for testing purposes)
  register(userData: any) {
    return authAPI.post("/register", userData);
  },
};

export default AuthService;
