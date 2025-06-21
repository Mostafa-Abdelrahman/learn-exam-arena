
import SecureApiService from '../api/secure-api.service';
import { API_ENDPOINTS } from '../api/endpoints';
import { AuthResponse, SafeUserResponse } from '@/types/api-response';

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

export interface UserProfile {
  bio?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  avatar_url?: string;
}

export interface PasswordChangeData {
  current_password: string;
  password: string;
  password_confirmation: string;
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

class SecureAuthService {
  // Authentication with secure token handling
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await SecureApiService.post<AuthResponse['data']>(
        API_ENDPOINTS.AUTH.LOGIN, 
        credentials
      );
      
      if (response.success && response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
        return {
          success: true,
          data: response.data,
          message: 'Login successful'
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; data: SafeUserResponse; message: string }> {
    try {
      const response = await SecureApiService.post<SafeUserResponse>(
        API_ENDPOINTS.AUTH.REGISTER, 
        userData
      );
      
      return {
        success: response.success,
        data: response.data,
        message: response.message || 'Registration successful'
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await SecureApiService.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      return {
        success: response.success,
        message: response.message || 'Logged out successfully'
      };
    } catch (error: any) {
      console.warn('API logout failed, proceeding with local logout:', error);
      return { success: true, message: 'Logged out successfully' };
    } finally {
      this.clearAuthData();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await SecureApiService.post<AuthResponse['data']>(API_ENDPOINTS.AUTH.REFRESH);
      
      if (response.success && response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
        return {
          success: true,
          data: response.data,
          message: 'Token refreshed successfully'
        };
      }
      
      throw new Error('Failed to refresh token');
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Profile Management
  async getCurrentUser(): Promise<SafeUserResponse> {
    try {
      const response = await SecureApiService.get<SafeUserResponse>(API_ENDPOINTS.AUTH.PROFILE);
      
      if (response.success) {
        // Update stored user data
        localStorage.setItem('user_data', JSON.stringify(response.data));
        return response.data;
      }
      
      throw new Error('Failed to fetch user profile');
    } catch (error: any) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; data: SafeUserResponse }> {
    try {
      const response = await SecureApiService.put<SafeUserResponse>(
        API_ENDPOINTS.AUTH.PROFILE, 
        profileData
      );
      
      if (response.success) {
        localStorage.setItem('user_data', JSON.stringify(response.data));
        return {
          success: true,
          data: response.data
        };
      }
      
      throw new Error('Failed to update profile');
    } catch (error: any) {
      console.error('Update profile failed:', error);
      throw error;
    }
  }

  async changePassword(passwordData: PasswordChangeData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await SecureApiService.put<void>(
        API_ENDPOINTS.AUTH.PASSWORD, 
        passwordData
      );
      
      return {
        success: response.success,
        message: response.message || 'Password changed successfully'
      };
    } catch (error: any) {
      console.error('Change password failed:', error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<{ success: boolean; data: { avatar_url: string } }> {
    try {
      const response = await SecureApiService.upload<{ avatar_url: string }>(
        API_ENDPOINTS.AUTH.AVATAR, 
        file,
        undefined,
        5 * 1024 * 1024 // 5MB limit for avatars
      );
      
      if (response.success) {
        // Update user data with new avatar
        const currentUser = this.getStoredUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            profile: {
              ...currentUser.profile,
              avatar_url: response.data.avatar_url
            }
          };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        }
      }
      
      return {
        success: response.success,
        data: response.data
      };
    } catch (error: any) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  }

  // Password Reset
  async forgotPassword(data: PasswordResetRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await SecureApiService.post<void>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 
        data
      );
      
      return {
        success: response.success,
        message: response.message || 'Password reset email sent'
      };
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  }

  async resetPassword(data: PasswordReset): Promise<{ success: boolean; message: string }> {
    try {
      const response = await SecureApiService.post<void>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD, 
        data
      );
      
      return {
        success: response.success,
        message: response.message || 'Password reset successful'
      };
    } catch (error: any) {
      console.error('Reset password failed:', error);
      throw error;
    }
  }

  // Secure utility methods
  private setAuthData(token: string, user: SafeUserResponse): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('token_timestamp', Date.now().toString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_timestamp');
  }

  getStoredToken(): string | null {
    const token = localStorage.getItem('auth_token');
    const timestamp = localStorage.getItem('token_timestamp');
    
    // Check if token is expired (24 hours)
    if (token && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge > maxAge) {
        this.clearAuthData();
        return null;
      }
    }
    
    return token;
  }

  getStoredUser(): SafeUserResponse | null {
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

  // Token validation
  isTokenValid(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }
}

export default new SecureAuthService();
