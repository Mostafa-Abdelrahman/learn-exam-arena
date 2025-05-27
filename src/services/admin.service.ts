
import api from '../api/config';

export interface AdminStats {
  total_users: number;
  total_students: number;
  total_doctors: number;
  total_admins: number;
  total_courses: number;
  total_majors: number;
  total_exams: number;
  active_exams: number;
  system_health: string;
  recent_registrations: number;
  monthly_stats: {
    new_users: number;
    new_courses: number;
    completed_exams: number;
  };
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'doctor' | 'admin';
  gender: string;
  major_id?: string;
  major?: {
    name: string;
  };
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

const AdminService = {
  // Dashboard Stats
  async getDashboardStats(): Promise<{ data: AdminStats }> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User Management
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<PaginationResponse<UserManagement>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await api.get(`/admin/users?${queryParams.toString()}`);
    return response.data;
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    gender: string;
    major_id?: string;
  }): Promise<{ message: string; user: UserManagement }> {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(userId: string, userData: Partial<UserManagement>): Promise<{ message: string }> {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Major Management
  async createMajor(majorData: {
    name: string;
    description?: string;
  }): Promise<{ data: Major }> {
    const response = await api.post('/admin/majors', majorData);
    return response.data;
  },

  // Assignment Management
  async assignDoctorToCourse(doctorId: string, courseId: string): Promise<{ message: string }> {
    const response = await api.post(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return response.data;
  },

  async enrollStudentInCourse(studentId: string, courseId: string): Promise<{ message: string }> {
    const response = await api.post(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return response.data;
  }
};

export default AdminService;
