
import ApiService from './api.service';
import { dummyNotifications, dummyUnreadCount } from '@/data/dummy-notifications';

class NotificationService {
  // Get user notifications
  async getUserNotifications(params?: any): Promise<{ data: any[] }> {
    try {
      const response = await ApiService.get('/notifications', params);
      return { data: response.data || [] };
    } catch (error) {
      console.warn('API getUserNotifications failed, using dummy data:', error);
      const limit = params?.limit || dummyNotifications.length;
      return { data: dummyNotifications.slice(0, limit) };
    }
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await ApiService.get('/notifications/unread-count');
      return { count: response.data?.count || 0 };
    } catch (error) {
      console.warn('API getUnreadCount failed, using dummy data:', error);
      return dummyUnreadCount;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.put(`/notifications/${notificationId}/read`);
      return { message: response.message || 'Notification marked as read' };
    } catch (error) {
      console.warn('API markAsRead failed, using dummy response:', error);
      return { message: 'Notification marked as read' };
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ message: string }> {
    try {
      const response = await ApiService.put('/notifications/mark-all-read');
      return { message: response.message || 'All notifications marked as read' };
    } catch (error) {
      console.warn('API markAllAsRead failed, using dummy response:', error);
      return { message: 'All notifications marked as read' };
    }
  }
}

export default new NotificationService();
