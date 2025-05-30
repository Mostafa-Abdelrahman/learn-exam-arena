
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CourseService, ExamService, NotificationService } from "@/services";

interface DashboardStats {
  enrolled_courses: number;
  upcoming_exams: number;
  completed_exams: number;
  average_grade: number;
  unread_notifications: number;
}

export const useDashboardData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    enrolled_courses: 0,
    upcoming_exams: 0,
    completed_exams: 0,
    average_grade: 0,
    unread_notifications: 0,
  });
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  const fetchDashboardData = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [coursesResponse, upcomingExamsResponse, notificationsResponse, unreadCountResponse] = await Promise.all([
        CourseService.getStudentCourses(),
        ExamService.getUpcomingExams(),
        NotificationService.getUserNotifications({ limit: 5 }),
        NotificationService.getUnreadCount(),
      ]);

      setStats({
        enrolled_courses: coursesResponse.data.length,
        upcoming_exams: upcomingExamsResponse.data.length,
        completed_exams: 0,
        average_grade: 0,
        unread_notifications: unreadCountResponse.count,
      });

      setUpcomingExams(upcomingExamsResponse.data.slice(0, 3));
      setRecentNotifications(notificationsResponse.data);
      
    } catch (error: any) {
      toast({
        title: "Error fetching dashboard data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return {
    loading,
    refreshing,
    stats,
    upcomingExams,
    recentNotifications,
    fetchDashboardData,
  };
};
