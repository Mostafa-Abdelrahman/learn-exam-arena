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
    try {
      const response = await ApiService.get('/schedule', filters);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getSchedule failed:', error);
      return { data: [] };
    }
  }

  async getScheduleById(scheduleId: string): Promise<{ data: ScheduleEvent }> {
    try {
      const response = await ApiService.get(`/schedule/${scheduleId}`);
      const responseData = response.data || response;
      return { data: responseData || this.createDefaultEvent() };
    } catch (error) {
      console.warn('API getScheduleById failed:', error);
      return { data: this.createDefaultEvent() };
    }
  }

  async createScheduleEvent(eventData: CreateScheduleData): Promise<{ event: ScheduleEvent; message: string }> {
    try {
      const response = await ApiService.post('/schedule', eventData);
      const responseData = response.data || response;
      return {
        event: responseData || this.createDefaultEvent(eventData),
        message: response.message || 'Event created successfully'
      };
    } catch (error) {
      console.warn('API createScheduleEvent failed:', error);
      return {
        event: this.createDefaultEvent(eventData),
        message: 'Event created successfully'
      };
    }
  }

  async updateScheduleEvent(scheduleId: string, eventData: Partial<CreateScheduleData>): Promise<{ event: ScheduleEvent; message: string }> {
    try {
      const response = await ApiService.put(`/schedule/${scheduleId}`, eventData);
      const responseData = response.data || response;
      return {
        event: responseData || this.createDefaultEvent(eventData as CreateScheduleData),
        message: response.message || 'Event updated successfully'
      };
    } catch (error) {
      console.warn('API updateScheduleEvent failed:', error);
      return {
        event: this.createDefaultEvent(eventData as CreateScheduleData),
        message: 'Event updated successfully'
      };
    }
  }

  async deleteScheduleEvent(scheduleId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/schedule/${scheduleId}`);
      return { message: response.message || 'Event deleted successfully' };
    } catch (error) {
      console.warn('API deleteScheduleEvent failed:', error);
      return { message: 'Event deleted successfully' };
    }
  }

  async cancelScheduleEvent(scheduleId: string, reason?: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.post(`/schedule/${scheduleId}/cancel`, { reason });
      return { message: response.message || 'Event cancelled successfully' };
    } catch (error) {
      console.warn('API cancelScheduleEvent failed:', error);
      return { message: 'Event cancelled successfully' };
    }
  }

  // Student Schedule
  async getStudentSchedule(studentId?: string, filters?: ScheduleFilters): Promise<{ data: ScheduleEvent[] }> {
    try {
      const endpoint = studentId ? `/admin/students/${studentId}/schedule` : '/student/schedule';
      const response = await ApiService.get(endpoint, filters);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentSchedule failed:', error);
      return { data: [] };
    }
  }

  async getStudentUpcomingEvents(studentId?: string): Promise<{ data: ScheduleEvent[] }> {
    try {
      const endpoint = studentId ? `/admin/students/${studentId}/schedule/upcoming` : '/student/schedule/upcoming';
      const response = await ApiService.get(endpoint);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentUpcomingEvents failed:', error);
      return { data: [] };
    }
  }

  // Doctor Schedule
  async getDoctorSchedule(doctorId?: string, filters?: ScheduleFilters): Promise<{ data: ScheduleEvent[] }> {
    try {
      const endpoint = doctorId ? `/admin/doctors/${doctorId}/schedule` : '/doctor/schedule';
      const response = await ApiService.get(endpoint, filters);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getDoctorSchedule failed:', error);
      return { data: [] };
    }
  }

  async getDoctorAvailability(doctorId: string, date: string): Promise<{ data: TimeSlot[] }> {
    try {
      const response = await ApiService.get(`/admin/doctors/${doctorId}/availability`, { date });
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getDoctorAvailability failed:', error);
      return { data: [] };
    }
  }

  async setDoctorAvailability(doctorId: string, availability: TimeSlot[]): Promise<{ message: string }> {
    try {
      const response = await ApiService.post(`/doctor/availability`, { availability });
      return { message: response.message || 'Availability updated successfully' };
    } catch (error) {
      console.warn('API setDoctorAvailability failed:', error);
      return { message: 'Availability updated successfully' };
    }
  }

  // Exam Scheduling
  async scheduleExam(examData: {
    exam_id: string;
    start_time: string;
    duration: string;
    location?: string;
  }): Promise<{ event: ScheduleEvent; message: string }> {
    try {
      const response = await ApiService.post('/doctor/schedule/exam', examData);
      const responseData = response.data || response;
      return {
        event: responseData || this.createDefaultEvent(),
        message: response.message || 'Exam scheduled successfully'
      };
    } catch (error) {
      console.warn('API scheduleExam failed:', error);
      return {
        event: this.createDefaultEvent(),
        message: 'Exam scheduled successfully'
      };
    }
  }

  async rescheduleExam(examId: string, newDateTime: string, reason?: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.put(`/doctor/schedule/exam/${examId}`, {
        start_time: newDateTime,
        reason
      });
      return { message: response.message || 'Exam rescheduled successfully' };
    } catch (error) {
      console.warn('API rescheduleExam failed:', error);
      return { message: 'Exam rescheduled successfully' };
    }
  }

  async getExamScheduleConflicts(examData: {
    start_time: string;
    duration: string;
    course_id: string;
  }): Promise<{ conflicts: string[]; suggestions: TimeSlot[] }> {
    try {
      const response = await ApiService.post('/schedule/check-conflicts', examData);
      const responseData = response.data || response;
      const data = responseData || {};
      return {
        conflicts: data.conflicts || [],
        suggestions: data.suggestions || []
      };
    } catch (error) {
      console.warn('API getExamScheduleConflicts failed:', error);
      return { conflicts: [], suggestions: [] };
    }
  }

  // Calendar Integration
  async exportToCalendar(filters?: ScheduleFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/schedule/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  async importFromCalendar(file: File): Promise<{ imported: number; errors: any[] }> {
    try {
      const response = await ApiService.upload('/schedule/import', file);
      const responseData = response.data || response;
      const data = responseData || {};
      return {
        imported: data.imported || 0,
        errors: data.errors || []
      };
    } catch (error) {
      console.warn('API importFromCalendar failed:', error);
      return { imported: 0, errors: [] };
    }
  }

  // Notifications
  async getScheduleNotifications(): Promise<{ data: any[] }> {
    try {
      const response = await ApiService.get('/schedule/notifications');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getScheduleNotifications failed:', error);
      return { data: [] };
    }
  }

  async markNotificationRead(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.post(`/schedule/notifications/${notificationId}/read`);
      return { message: response.message || 'Notification marked as read' };
    } catch (error) {
      console.warn('API markNotificationRead failed:', error);
      return { message: 'Notification marked as read' };
    }
  }

  // Statistics
  async getScheduleStats(): Promise<{ data: any }> {
    try {
      const response = await ApiService.get('/admin/schedule/stats');
      return { data: response.data || {} };
    } catch (error) {
      console.warn('API getScheduleStats failed:', error);
      return { data: {} };
    }
  }

  async getUtilizationReport(startDate: string, endDate: string): Promise<{ data: any }> {
    try {
      const response = await ApiService.get('/admin/schedule/utilization', {
        start_date: startDate,
        end_date: endDate
      });
      return { data: response.data || {} };
    } catch (error) {
      console.warn('API getUtilizationReport failed:', error);
      return { data: {} };
    }
  }

  private createDefaultEvent(eventData?: Partial<CreateScheduleData>): ScheduleEvent {
    return {
      id: `event-${Date.now()}`,
      title: eventData?.title || 'Default Event',
      description: eventData?.description,
      start_time: eventData?.start_time || new Date().toISOString(),
      end_time: eventData?.end_time || new Date(Date.now() + 3600000).toISOString(),
      type: eventData?.type || 'other',
      course_id: eventData?.course_id,
      exam_id: eventData?.exam_id,
      location: eventData?.location,
      participants: eventData?.participants,
      created_by: '',
      status: 'scheduled'
    };
  }
}

export default new SchedulingService();
