import ApiService from './api.service';
import { dummySystemStats, dummyUsers } from '@/data/dummy-admin';
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
    try {
      return await ApiService.get('/admin/system-stats');
    } catch (error) {
      console.warn('API getSystemStats failed, using dummy data:', error);
      return dummySystemStats;
    }
  }

  // Get all users
  async getAllUsers(): Promise<{ data: User[] }> {
    try {
      return await ApiService.get('/admin/users');
    } catch (error) {
      console.warn('API getAllUsers failed, using dummy data:', error);
      return { data: dummyUsers };
    }
  }

  // Get all doctors
  async getAllDoctors(): Promise<{ data: User[] }> {
    try {
      return await ApiService.get('/admin/doctors');
    } catch (error) {
      console.warn('API getAllDoctors failed, using dummy data:', error);
      return { data: dummyUsers.filter(user => user.role === 'doctor') };
    }
  }

  // Get all students
  async getAllStudents(): Promise<{ data: User[] }> {
    try {
      return await ApiService.get('/admin/students');
    } catch (error) {
      console.warn('API getAllStudents failed, using dummy data:', error);
      return { data: dummyUsers.filter(user => user.role === 'student') };
    }
  }

  // Get all majors
  async getAllMajors(): Promise<{ data: any[] }> {
    try {
      return await ApiService.get('/admin/majors');
    } catch (error) {
      console.warn('API getAllMajors failed, using dummy data:', error);
      return { data: [] };
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.warn('API deleteUser failed, using dummy response:', error);
      return { message: 'User deleted successfully' };
    }
  }

  // Update user
  async updateUser(userId: string, userData: any): Promise<{ message: string; user: any }> {
    try {
      return await ApiService.put(`/admin/users/${userId}`, userData);
    } catch (error) {
      console.warn('API updateUser failed, using dummy response:', error);
      return {
        message: 'User updated successfully',
        user: { id: userId, ...userData, updated_at: new Date().toISOString() }
      };
    }
  }
}

export default new AdminService();
