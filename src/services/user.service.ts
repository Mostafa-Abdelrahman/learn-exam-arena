
import ApiService from './api.service';

export interface UserFilters {
  role?: 'student' | 'doctor' | 'admin';
  major_id?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
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
    major_id: string;
    major_name: string;
    user_count: number;
  }>;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
  major_id?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'student' | 'doctor' | 'admin';
  gender?: 'male' | 'female' | 'other';
  major_id?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

class UserService {
  // User Management
  async getAllUsers(filters?: UserFilters, pagination?: PaginationParams): Promise<{
    data: User[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }> {
    const params = { ...filters, ...pagination };
    return await ApiService.get('/admin/users', params);
  }

  async getUserById(userId: string): Promise<{ data: User }> {
    return await ApiService.get(`/admin/users/${userId}`);
  }

  async createUser(userData: CreateUserData): Promise<{ user: User; message: string }> {
    return await ApiService.post('/admin/users', userData);
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<{ user: User; message: string }> {
    return await ApiService.put(`/admin/users/${userId}`, userData);
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/users/${userId}`);
  }

  async suspendUser(userId: string, reason?: string): Promise<{ message: string }> {
    return await ApiService.post(`/admin/users/${userId}/suspend`, { reason });
  }

  async activateUser(userId: string): Promise<{ message: string }> {
    return await ApiService.post(`/admin/users/${userId}/activate`);
  }

  // User Statistics
  async getUserStats(): Promise<{ data: UserStats }> {
    return await ApiService.get('/admin/users/stats');
  }

  async getUserActivity(userId: string): Promise<{ data: any[] }> {
    return await ApiService.get(`/admin/users/${userId}/activity`);
  }

  // Bulk Operations
  async bulkCreateUsers(users: CreateUserData[]): Promise<{ created: number; errors: any[] }> {
    return await ApiService.post('/admin/users/bulk', { users });
  }

  async bulkUpdateUsers(userIds: string[], updates: UpdateUserData): Promise<{ updated: number; errors: any[] }> {
    return await ApiService.put('/admin/users/bulk', { user_ids: userIds, updates });
  }

  async bulkDeleteUsers(userIds: string[]): Promise<{ deleted: number; errors: any[] }> {
    return await ApiService.delete('/admin/users/bulk', { user_ids: userIds });
  }

  // Import/Export
  async exportUsers(filters?: UserFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    const response = await fetch(`${ApiService['baseURL']}/admin/users/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  async importUsers(file: File): Promise<{ imported: number; errors: any[] }> {
    return await ApiService.upload('/admin/users/import', file);
  }
}

export default new UserService();
