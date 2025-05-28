
import ApiService from './api.service';

export interface SystemStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    by_role: {
      students: number;
      doctors: number;
      admins: number;
    };
  };
  courses: {
    total: number;
    active: number;
    archived: number;
  };
  exams: {
    total: number;
    scheduled: number;
    completed: number;
    pending_grading: number;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
  };
  system_health: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: string;
    response_time: number;
    error_rate: number;
  };
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: any;
  new_values?: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SystemSettings {
  site_name: string;
  site_description: string;
  default_timezone: string;
  date_format: string;
  time_format: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  max_file_upload_size: number;
  allowed_file_types: string[];
}

class AdminService {
  // Dashboard and Statistics
  async getDashboardStats(): Promise<{ data: SystemStats }> {
    return await ApiService.get('/admin/dashboard/stats');
  }

  async getSystemHealth(): Promise<{ data: any }> {
    return await ApiService.get('/admin/system/health');
  }

  async getAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<{ data: any }> {
    return await ApiService.get('/admin/analytics', { period });
  }

  // Assignment System
  async assignDoctorToCourse(doctorId: string, courseId: string): Promise<{ message: string }> {
    return await ApiService.post('/admin/assignments/doctor-course', {
      doctor_id: doctorId,
      course_id: courseId
    });
  }

  async unassignDoctorFromCourse(doctorId: string, courseId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/assignments/doctor-course/${doctorId}/${courseId}`);
  }

  async enrollStudentInCourse(studentId: string, courseId: string): Promise<{ message: string }> {
    return await ApiService.post('/admin/assignments/student-course', {
      student_id: studentId,
      course_id: courseId
    });
  }

  async unenrollStudentFromCourse(studentId: string, courseId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/assignments/student-course/${studentId}/${courseId}`);
  }

  async bulkAssignments(assignments: Array<{
    type: 'doctor-course' | 'student-course';
    user_id: string;
    course_id: string;
    action: 'assign' | 'unassign';
  }>): Promise<{ processed: number; errors: any[] }> {
    return await ApiService.post('/admin/assignments/bulk', { assignments });
  }

  // Major Management
  async getAllMajors(): Promise<{ data: Major[] }> {
    return await ApiService.get('/admin/majors');
  }

  async createMajor(majorData: {
    name: string;
    code?: string;
    description?: string;
  }): Promise<{ major: Major; message: string }> {
    return await ApiService.post('/admin/majors', majorData);
  }

  async updateMajor(majorId: string, majorData: Partial<Major>): Promise<{ major: Major; message: string }> {
    return await ApiService.put(`/admin/majors/${majorId}`, majorData);
  }

  async deleteMajor(majorId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/majors/${majorId}`);
  }

  // Audit Logs
  async getAuditLogs(filters?: {
    user_id?: string;
    action?: string;
    resource_type?: string;
    start_date?: string;
    end_date?: string;
  }, pagination?: PaginationParams): Promise<{
    data: AuditLog[];
    pagination: any;
  }> {
    const params = { ...filters, ...pagination };
    return await ApiService.get('/admin/audit-logs', params);
  }

  async exportAuditLogs(filters?: any): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters).toString() : '';
    const response = await fetch(`${ApiService['baseURL']}/admin/audit-logs/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  // System Settings
  async getSystemSettings(): Promise<{ data: SystemSettings }> {
    return await ApiService.get('/admin/settings');
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<{ message: string }> {
    return await ApiService.put('/admin/settings', settings);
  }

  async enableMaintenanceMode(message?: string): Promise<{ message: string }> {
    return await ApiService.post('/admin/maintenance/enable', { message });
  }

  async disableMaintenanceMode(): Promise<{ message: string }> {
    return await ApiService.post('/admin/maintenance/disable');
  }

  // Backup and Restore
  async createBackup(): Promise<{ backup_id: string; message: string }> {
    return await ApiService.post('/admin/backup/create');
  }

  async getBackupList(): Promise<{ data: any[] }> {
    return await ApiService.get('/admin/backup/list');
  }

  async downloadBackup(backupId: string): Promise<Blob> {
    const response = await fetch(`${ApiService['baseURL']}/admin/backup/${backupId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  async restoreBackup(backupId: string): Promise<{ message: string }> {
    return await ApiService.post(`/admin/backup/${backupId}/restore`);
  }

  // Reports
  async generateReport(reportType: 'users' | 'courses' | 'exams' | 'grades', filters?: any): Promise<{ report_id: string }> {
    return await ApiService.post('/admin/reports/generate', {
      type: reportType,
      filters
    });
  }

  async getReportStatus(reportId: string): Promise<{ status: 'pending' | 'completed' | 'failed'; progress: number }> {
    return await ApiService.get(`/admin/reports/${reportId}/status`);
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await fetch(`${ApiService['baseURL']}/admin/reports/${reportId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }
}

export default new AdminService();
