
import LocalStorageService from './local-storage.service';
import { User } from '@/types/user';

export interface SystemStats {
  users: {
    total: number;
    admins: number;
    doctors: number;
    students: number;
  };
  courses: {
    total: number;
  };
  majors: {
    total: number;
  };
  exams: {
    total: number;
    published: number;
    draft: number;
  };
}

class AdminService {
  // Get system statistics
  async getSystemStats(): Promise<SystemStats> {
    // Initialize data if needed
    LocalStorageService.initializeData();
    return LocalStorageService.getSystemStats();
  }

  // Get all users
  async getAllUsers(): Promise<{ data: User[] }> {
    LocalStorageService.initializeData();
    return { data: LocalStorageService.getUsers() };
  }

  // Get all doctors
  async getAllDoctors(): Promise<{ data: User[] }> {
    LocalStorageService.initializeData();
    const users = LocalStorageService.getUsers();
    return { data: users.filter(user => user.role === 'doctor') };
  }

  // Get all students
  async getAllStudents(): Promise<{ data: User[] }> {
    LocalStorageService.initializeData();
    const users = LocalStorageService.getUsers();
    return { data: users.filter(user => user.role === 'student') };
  }

  // Get all majors
  async getAllMajors(): Promise<{ data: any[] }> {
    LocalStorageService.initializeData();
    return { data: LocalStorageService.getMajors() };
  }

  // Delete user
  async deleteUser(userId: string): Promise<{ message: string }> {
    const success = LocalStorageService.deleteUser(userId);
    if (success) {
      return { message: 'User deleted successfully' };
    }
    throw new Error('User not found');
  }

  // Update user
  async updateUser(userId: string, userData: any): Promise<{ message: string; user: any }> {
    const updatedUser = LocalStorageService.updateUser(userId, userData);
    if (updatedUser) {
      return {
        message: 'User updated successfully',
        user: updatedUser
      };
    }
    throw new Error('User not found');
  }
}

export default new AdminService();
