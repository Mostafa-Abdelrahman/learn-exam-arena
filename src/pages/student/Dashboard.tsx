
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CourseService, ExamService, NotificationService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, GraduationCap, Bell, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  enrolled_courses: number;
  upcoming_exams: number;
  completed_exams: number;
  average_grade: number;
  unread_notifications: number;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        completed_exams: 0, // This would come from a separate endpoint
        average_grade: 0, // This would come from a separate endpoint
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

  const handleRefresh = () => {
    fetchDashboardData(true);
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated",
    });
  };

  const handleViewExamDetails = (examId: string) => {
    navigate(`/student/exams/${examId}`);
  };

  const statsCards = [
    {
      title: "Enrolled Courses",
      value: stats.enrolled_courses,
      icon: BookOpen,
      color: "text-blue-600",
      onClick: () => navigate("/student/courses"),
    },
    {
      title: "Upcoming Exams",
      value: stats.upcoming_exams,
      icon: Calendar,
      color: "text-orange-600",
      onClick: () => navigate("/student/exams"),
    },
    {
      title: "Completed Exams",
      value: stats.completed_exams,
      icon: GraduationCap,
      color: "text-green-600",
      onClick: () => navigate("/student/results"),
    },
    {
      title: "Unread Notifications",
      value: stats.unread_notifications,
      icon: Bell,
      color: "text-purple-600",
      onClick: () => navigate("/student/notifications"),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {currentUser?.name}!
        </h2>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={stat.onClick}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingExams.length > 0 ? (
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{exam.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exam.course?.name} - {new Date(exam.exam_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewExamDetails(exam.id)}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming exams</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent notifications</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
