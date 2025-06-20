
import LocalStorageService from './local-storage.service';
import { User, CreateUserData, UpdateUserData } from '@/types/user';

export interface UserFilters {
  role?: 'admin' | 'doctor' | 'student';
  status?: 'active' | 'inactive';
  major_id?: string;
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
