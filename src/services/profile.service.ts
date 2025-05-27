
import api from '../api/config';

export interface ProfileUpdate {
  name?: string;
  gender?: string;
}

export interface PasswordChange {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const ProfileService = {
  // Profile Management
  async updateProfile(profileData: ProfileUpdate): Promise<{ message: string; data: any }> {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  async changePassword(passwordData: PasswordChange): Promise<{ message: string }> {
    const response = await api.put('/user/password', passwordData);
    return response.data;
  },

  // Password Reset
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/reset-password', data);
    return response.data;
  }
};

export default ProfileService;
