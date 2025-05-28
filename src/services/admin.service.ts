
import ApiService from './api.service';

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

export interface AdminStats {
  total_users: number;
  total_doctors: number;
  total_students: number;
  total_courses: number;
  total_exams: number;
  total_majors: number;
}

class AdminService {
  async getSystemSettings(): Promise<{ data: any }> {
    return await ApiService.get('/admin/settings');
  }

  async updateSystemSettings(settings: any): Promise<{ message: string }> {
    return await ApiService.put('/admin/settings', settings);
  }

  async getSystemStats(): Promise<{ data: SystemStats }> {
    return await ApiService.get('/admin/system/stats');
  }

  async getAdminStats(): Promise<{ data: AdminStats }> {
    return await ApiService.get('/admin/stats');
  }

  async getSystemLogs(): Promise<{ data: any[] }> {
    return await ApiService.get('/admin/logs');
  }

  async backupDatabase(): Promise<{ message: string; backup_url: string }> {
    return await ApiService.post('/admin/backup');
  }

  async restoreDatabase(backupFile: File): Promise<{ message: string }> {
    return await ApiService.upload('/admin/restore', backupFile);
  }

  async clearCache(): Promise<{ message: string }> {
    return await ApiService.post('/admin/cache/clear');
  }
}

export default new AdminService();
