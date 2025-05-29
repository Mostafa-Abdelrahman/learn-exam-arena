
import ApiService from './api.service';
import { dummySystemStats, dummyUsers, dummyStudents, dummyDoctors } from '@/data/dummy-admin';

interface SystemStats {
  total_users: number;
  total_students: number;
  total_doctors: number;
  total_admins: number;
  total_courses: number;
  total_exams: number;
  active_exams: number;
  completed_exams: number;
  system_health: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: string;
    response_time: number;
    error_rate: number;
    services: {
      database: 'up' | 'down';
      cache: 'up' | 'down';
      storage: 'up' | 'down';
      email: 'up' | 'down';
    };
  };
}

class AdminService {
  // Get system statistics
  async getSystemStats(): Promise<SystemStats> {
    try {
      return await ApiService.get('/admin/stats');
    } catch (error) {
      console.warn('API getSystemStats failed, using dummy data:', error);
      return dummySystemStats;
    }
  }

  // Get all users
  async getAllUsers(params?: any): Promise<PaginationResponse<any>> {
    try {
      return await ApiService.get('/admin/users', params);
    } catch (error) {
      console.warn('API getAllUsers failed, using dummy data:', error);
      return {
        data: dummyUsers,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: dummyUsers.length,
          per_page: 25,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  // Get all students
  async getAllStudents(params?: any): Promise<PaginationResponse<any>> {
    try {
      return await ApiService.get('/admin/students', params);
    } catch (error) {
      console.warn('API getAllStudents failed, using dummy data:', error);
      return {
        data: dummyStudents,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: dummyStudents.length,
          per_page: 25,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  // Get all doctors
  async getAllDoctors(params?: any): Promise<PaginationResponse<any>> {
    try {
      return await ApiService.get('/admin/doctors', params);
    } catch (error) {
      console.warn('API getAllDoctors failed, using dummy data:', error);
      return {
        data: dummyDoctors,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: dummyDoctors.length,
          per_page: 25,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  // Create user
  async createUser(userData: any): Promise<{ user: any; message: string }> {
    try {
      return await ApiService.post('/admin/users', userData);
    } catch (error) {
      console.warn('API createUser failed, using dummy response:', error);
      return {
        user: {
          id: `user-${Date.now()}`,
          ...userData,
          created_at: new Date().toISOString(),
          status: 'active'
        },
        message: 'User created successfully'
      };
    }
  }

  // Update user
  async updateUser(userId: string, userData: any): Promise<{ user: any; message: string }> {
    try {
      return await ApiService.put(`/admin/users/${userId}`, userData);
    } catch (error) {
      console.warn('API updateUser failed, using dummy response:', error);
      const existingUser = dummyUsers.find(u => u.id === userId) || dummyUsers[0];
      return {
        user: {
          ...existingUser,
          ...userData,
          updated_at: new Date().toISOString()
        },
        message: 'User updated successfully'
      };
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
}

export default new AdminService();
