
import ApiService from './api.service';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'exam' | 'grade' | 'schedule';
  read: boolean;
  data?: any;
  created_at: string;
  read_at?: string;
}

export interface CreateNotificationData {
  user_ids: string[];
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'exam' | 'grade' | 'schedule';
  data?: any;
  send_email?: boolean;
  send_sms?: boolean;
  schedule_at?: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    exam_reminders: boolean;
    grade_notifications: boolean;
    schedule_updates: boolean;
    course_announcements: boolean;
    system_updates: boolean;
  };
}

class NotificationService {
  // Notification Management
  async getUserNotifications(filters?: {
    type?: string;
    read?: boolean;
    limit?: number;
  }): Promise<{ data: Notification[] }> {
    return await ApiService.get('/notifications', filters);
  }

  async getNotificationById(notificationId: string): Promise<{ data: Notification }> {
    return await ApiService.get(`/notifications/${notificationId}`);
  }

  async markAsRead(notificationId: string): Promise<{ message: string }> {
    return await ApiService.post(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<{ message: string }> {
    return await ApiService.post('/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/notifications/${notificationId}`);
  }

  async deleteAllNotifications(): Promise<{ message: string }> {
    return await ApiService.delete('/notifications/all');
  }

  // Admin Notification Management
  async sendNotification(notificationData: CreateNotificationData): Promise<{ message: string; sent_count: number }> {
    return await ApiService.post('/admin/notifications/send', notificationData);
  }

  async broadcastNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    target_roles?: string[];
    target_majors?: string[];
    send_email?: boolean;
    send_sms?: boolean;
  }): Promise<{ message: string; sent_count: number }> {
    return await ApiService.post('/admin/notifications/broadcast', notificationData);
  }

  async scheduleNotification(notificationData: CreateNotificationData): Promise<{ message: string; scheduled_id: string }> {
    return await ApiService.post('/admin/notifications/schedule', notificationData);
  }

  async getScheduledNotifications(): Promise<{ data: any[] }> {
    return await ApiService.get('/admin/notifications/scheduled');
  }

  async cancelScheduledNotification(scheduledId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/notifications/scheduled/${scheduledId}`);
  }

  // Notification Settings
  async getNotificationSettings(): Promise<{ data: NotificationSettings }> {
    return await ApiService.get('/user/notification-settings');
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<{ message: string }> {
    return await ApiService.put('/user/notification-settings', settings);
  }

  // Push Notifications
  async subscribeToPush(subscription: any): Promise<{ message: string }> {
    return await ApiService.post('/notifications/push/subscribe', { subscription });
  }

  async unsubscribeFromPush(): Promise<{ message: string }> {
    return await ApiService.post('/notifications/push/unsubscribe');
  }

  // Notification Templates
  async getNotificationTemplates(): Promise<{ data: any[] }> {
    return await ApiService.get('/admin/notification-templates');
  }

  async createNotificationTemplate(template: {
    name: string;
    subject: string;
    body: string;
    type: string;
    variables?: string[];
  }): Promise<{ template: any; message: string }> {
    return await ApiService.post('/admin/notification-templates', template);
  }

  async updateNotificationTemplate(templateId: string, template: any): Promise<{ message: string }> {
    return await ApiService.put(`/admin/notification-templates/${templateId}`, template);
  }

  async deleteNotificationTemplate(templateId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/notification-templates/${templateId}`);
  }

  // Statistics
  async getNotificationStats(): Promise<{ data: any }> {
    return await ApiService.get('/admin/notifications/stats');
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return await ApiService.get('/notifications/unread-count');
  }
}

export default new NotificationService();
