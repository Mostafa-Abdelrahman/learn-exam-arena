import LocalStorageService from './local-storage.service';
import { User, CreateUserData, UpdateUserData } from '@/types/user';

export interface UserFilters {
  role?: 'admin' | 'doctor' | 'student';
  status?: 'active' | 'inactive';
  major_id?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_this_month: number;
  users_by_role: {
    students: number;
    doctors: number;
    admins: number;
  };
  users_by_major: Array<{
    major_name: string;
    user_count: number;
  }>;
}

class UserService {
  // Get all users with optional filters
  async getAllUsers(filters?: UserFilters): Promise<{ data: User[] }> {
    LocalStorageService.initializeData();
    let users = LocalStorageService.getUsers();

    if (filters?.role) {
      users = users.filter(user => user.role === filters.role);
    }
    if (filters?.status) {
      users = users.filter(user => user.status === filters.status);
    }
    if (filters?.major_id) {
      users = users.filter(user => (user as any).major_id === filters.major_id);
    }

    return { data: users };
  }

  // Get doctors specifically
  async getDoctors(): Promise<{ data: User[] }> {
    LocalStorageService.initializeData();
    const users = LocalStorageService.getUsers();
    const doctors = users.filter(user => user.role === 'doctor');
    return { data: doctors };
  }

  // Get user statistics
  async getUserStats(): Promise<{ data: UserStats }> {
    LocalStorageService.initializeData();
    const users = LocalStorageService.getUsers();
    const majors = LocalStorageService.getMajors();

    const usersByRole = {
      students: users.filter(u => u.role === 'student').length,
      doctors: users.filter(u => u.role === 'doctor').length,
      admins: users.filter(u => u.role === 'admin').length
    };

    const usersByMajor = majors.map(major => ({
      major_name: major.name,
      user_count: users.filter(u => (u as any).major_id === major.id).length
    }));

    return {
      data: {
        total_users: users.length,
        active_users: users.filter(u => u.status === 'active').length,
        new_users_this_month: Math.floor(Math.random() * 100), // Mock data
        users_by_role: usersByRole,
        users_by_major: usersByMajor
      }
    };
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<{ data: User; message: string }> {
    const newUser = LocalStorageService.createUser(userData);
    return {
      data: newUser,
      message: 'User created successfully'
    };
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<{ data: User; message: string }> {
    const updatedUser = LocalStorageService.updateUser(id, userData);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return {
      data: updatedUser,
      message: 'User updated successfully'
    };
  }

  // Delete user
  async deleteUser(id: string): Promise<{ message: string }> {
    const success = LocalStorageService.deleteUser(id);
    if (!success) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  // Get user by ID
  async getUserById(id: string): Promise<{ data: User }> {
    LocalStorageService.initializeData();
    const users = LocalStorageService.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { data: user };
  }
}

export default new UserService();
