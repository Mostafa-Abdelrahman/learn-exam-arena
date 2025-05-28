
import ApiService from './api.service';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  type: 'exam' | 'class' | 'meeting' | 'deadline' | 'other';
  course_id?: string;
  exam_id?: string;
  location?: string;
  participants?: string[];
  created_by: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CreateScheduleData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  type: 'exam' | 'class' | 'meeting' | 'deadline' | 'other';
  course_id?: string;
  exam_id?: string;
  location?: string;
  participants?: string[];
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    end_date?: string;
  };
}

export interface ScheduleFilters {
  start_date?: string;
  end_date?: string;
  type?: string;
  course_id?: string;
  participant_id?: string;
  status?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
  conflicts?: string[];
}

class SchedulingService {
  // Schedule Management
  async getSchedule(filters?: ScheduleFilters): Promise<{ data: ScheduleEvent[] }> {
    return await ApiService.get('/schedule', filters);
  }

  async getScheduleById(scheduleId: string): Promise<{ data: ScheduleEvent }> {
    return await ApiService.get(`/schedule/${scheduleId}`);
  }

  async createScheduleEvent(eventData: CreateScheduleData): Promise<{ event: ScheduleEvent; message: string }> {
    return await ApiService.post('/schedule', eventData);
  }

  async updateScheduleEvent(scheduleId: string, eventData: Partial<CreateScheduleData>): Promise<{ event: ScheduleEvent; message: string }> {
    return await ApiService.put(`/schedule/${scheduleId}`, eventData);
  }

  async deleteScheduleEvent(scheduleId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/schedule/${scheduleId}`);
  }

  async cancelScheduleEvent(scheduleId: string, reason?: string): Promise<{ message: string }> {
    return await ApiService.post(`/schedule/${scheduleId}/cancel`, { reason });
  }

  // Student Schedule
  async getStudentSchedule(studentId?: string, filters?: ScheduleFilters): Promise<{ data: ScheduleEvent[] }> {
    const endpoint = studentId ? `/admin/students/${studentId}/schedule` : '/student/schedule';
    return await ApiService.get(endpoint, filters);
  }

  async getStudentUpcomingEvents(studentId?: string): Promise<{ data: ScheduleEvent[] }> {
    const endpoint = studentId ? `/admin/students/${studentId}/schedule/upcoming` : '/student/schedule/upcoming';
    return await ApiService.get(endpoint);
  }

  // Doctor Schedule
  async getDoctorSchedule(doctorId?: string, filters?: ScheduleFilters): Promise<{ data: ScheduleEvent[] }> {
    const endpoint = doctorId ? `/admin/doctors/${doctorId}/schedule` : '/doctor/schedule';
    return await ApiService.get(endpoint, filters);
  }

  async getDoctorAvailability(doctorId: string, date: string): Promise<{ data: TimeSlot[] }> {
    return await ApiService.get(`/admin/doctors/${doctorId}/availability`, { date });
  }

  async setDoctorAvailability(doctorId: string, availability: TimeSlot[]): Promise<{ message: string }> {
    return await ApiService.post(`/doctor/availability`, { availability });
  }

  // Exam Scheduling
  async scheduleExam(examData: {
    exam_id: string;
    start_time: string;
    duration: string;
    location?: string;
  }): Promise<{ event: ScheduleEvent; message: string }> {
    return await ApiService.post('/doctor/schedule/exam', examData);
  }

  async rescheduleExam(examId: string, newDateTime: string, reason?: string): Promise<{ message: string }> {
    return await ApiService.put(`/doctor/schedule/exam/${examId}`, {
      start_time: newDateTime,
      reason
    });
  }

  async getExamScheduleConflicts(examData: {
    start_time: string;
    duration: string;
    course_id: string;
  }): Promise<{ conflicts: string[]; suggestions: TimeSlot[] }> {
    return await ApiService.post('/schedule/check-conflicts', examData);
  }

  // Calendar Integration
  async exportToCalendar(filters?: ScheduleFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    const response = await fetch(`${ApiService['baseURL']}/schedule/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  async importFromCalendar(file: File): Promise<{ imported: number; errors: any[] }> {
    return await ApiService.upload('/schedule/import', file);
  }

  // Notifications
  async getScheduleNotifications(): Promise<{ data: any[] }> {
    return await ApiService.get('/schedule/notifications');
  }

  async markNotificationRead(notificationId: string): Promise<{ message: string }> {
    return await ApiService.post(`/schedule/notifications/${notificationId}/read`);
  }

  // Statistics
  async getScheduleStats(): Promise<{ data: any }> {
    return await ApiService.get('/admin/schedule/stats');
  }

  async getUtilizationReport(startDate: string, endDate: string): Promise<{ data: any }> {
    return await ApiService.get('/admin/schedule/utilization', {
      start_date: startDate,
      end_date: endDate
    });
  }
}

export default new SchedulingService();
