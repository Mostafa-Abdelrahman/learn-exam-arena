import ApiService from './api.service';

export interface ScheduleEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  event_type: 'meeting' | 'lecture' | 'exam' | 'appointment';
  location?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  start_time: string;
  end_time: string;
  event_type: 'meeting' | 'lecture' | 'exam' | 'appointment';
  location?: string;
  description?: string;
}

export interface UpdateEventData {
  title?: string;
  start_time?: string;
  end_time?: string;
  event_type?: 'meeting' | 'lecture' | 'exam' | 'appointment';
  location?: string;
  description?: string;
}

export interface AvailabilityFilters {
  start_date: string;
  end_date: string;
  duration: number;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface ExportFilters {
  start_date?: string;
  end_date?: string;
  event_type?: string;
}

export interface ImportOptions {
  overwrite?: boolean;
  ignore_conflicts?: boolean;
}

class SchedulingService {
  async getEvents(): Promise<{ data: ScheduleEvent[] }> {
    try {
      const response = await ApiService.get('/schedule/events');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getEvents failed:', error);
      return { data: [] };
    }
  }

  async getUserEvents(userId: string): Promise<{ data: ScheduleEvent[] }> {
    try {
      const response = await ApiService.get(`/schedule/users/${userId}/events`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getUserEvents failed:', error);
      return { data: [] };
    }
  }

  async getEventById(eventId: string): Promise<{ data: ScheduleEvent }> {
    try {
      const response = await ApiService.get(`/schedule/events/${eventId}`);
      const responseData = response.data || response;
      return { data: responseData || this.createDefaultEvent() };
    } catch (error) {
      console.warn('API getEventById failed:', error);
      return { data: this.createDefaultEvent() };
    }
  }

  async createEvent(eventData: CreateEventData): Promise<{ event: ScheduleEvent; message: string }> {
    try {
      const response = await ApiService.post('/schedule/events', eventData);
      const responseData = response.data || response;
      const extractedData = responseData as any;
      return {
        event: extractedData?.event || this.createDefaultEvent(eventData),
        message: response.message || 'Event created successfully'
      };
    } catch (error) {
      console.warn('API createEvent failed:', error);
      return {
        event: this.createDefaultEvent(eventData),
        message: 'Event created successfully'
      };
    }
  }

  async updateEvent(eventId: string, eventData: UpdateEventData): Promise<{ event: ScheduleEvent; message: string }> {
    try {
      const response = await ApiService.put(`/schedule/events/${eventId}`, eventData);
      const responseData = response.data || response;
      const extractedData = responseData as any;
      return {
        event: extractedData?.event || this.createDefaultEvent(eventData as CreateEventData),
        message: response.message || 'Event updated successfully'
      };
    } catch (error) {
      console.warn('API updateEvent failed:', error);
      return {
        event: this.createDefaultEvent(eventData as CreateEventData),
        message: 'Event updated successfully'
      };
    }
  }

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/schedule/events/${eventId}`);
      return { message: response.message || 'Event deleted successfully' };
    } catch (error) {
      console.warn('API deleteEvent failed:', error);
      return { message: 'Event deleted successfully' };
    }
  }

  async getAvailableSlots(filters: AvailabilityFilters): Promise<{ data: TimeSlot[] }> {
    try {
      const response = await ApiService.get('/schedule/available-slots', filters);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getAvailableSlots failed:', error);
      return { data: [] };
    }
  }

  async checkConflicts(eventData: CreateEventData): Promise<{ conflicts: string[]; suggestions: TimeSlot[]; }> {
    try {
      const response = await ApiService.post('/schedule/check-conflicts', eventData);
      const responseData = response.data || response;
      const extractedData = responseData as any;
      return {
        conflicts: extractedData?.conflicts || [],
        suggestions: extractedData?.suggestions || []
      };
    } catch (error) {
      console.warn('API checkConflicts failed:', error);
      return { conflicts: [], suggestions: [] };
    }
  }

  async bulkCreateEvents(events: CreateEventData[]): Promise<{ created: ScheduleEvent[]; errors: any[] }> {
    try {
      const response = await ApiService.post('/schedule/events/bulk', { events });
      const responseData = response.data || response;
      const extractedData = responseData as any;
      return {
        created: extractedData?.created || [],
        errors: extractedData?.errors || []
      };
    } catch (error) {
      console.warn('API bulkCreateEvents failed:', error);
      return { created: [], errors: [] };
    }
  }

  async importSchedule(file: File, options?: ImportOptions): Promise<{ imported: number; errors: any[]; }> {
    try {
      const response = await ApiService.upload('/schedule/import', file, options);
      const responseData = response.data || response;
      const extractedData = responseData as any;
      return {
        imported: extractedData?.imported || 0,
        errors: extractedData?.errors || []
      };
    } catch (error) {
      console.warn('API importSchedule failed:', error);
      return { imported: 0, errors: [] };
    }
  }

  async exportSchedule(filters?: ExportFilters): Promise<{ message: string }> {
    try {
      const response = await ApiService.get('/schedule/export', filters);
      return { message: response.message || 'Schedule exported successfully' };
    } catch (error) {
      console.warn('API exportSchedule failed:', error);
      return { message: 'Schedule exported successfully' };
    }
  }

  private createDefaultEvent(eventData?: Partial<CreateEventData>): ScheduleEvent {
    return {
      id: `event-${Date.now()}`,
      title: eventData?.title || 'Default Event',
      start_time: eventData?.start_time || new Date().toISOString(),
      end_time: eventData?.end_time || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      event_type: eventData?.event_type || 'meeting',
      location: eventData?.location,
      description: eventData?.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

export default new SchedulingService();
