
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardStats from "@/components/student/DashboardStats";
import UpcomingExamsList from "@/components/student/UpcomingExamsList";
import RecentNotificationsList from "@/components/student/RecentNotificationsList";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const {
    loading,
    refreshing,
    stats,
    upcomingExams,
    recentNotifications,
    fetchDashboardData,
  } = useDashboardData();

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      <DashboardStats stats={stats} onNavigate={navigate} />
      <UpcomingExamsList upcomingExams={upcomingExams} onViewExamDetails={handleViewExamDetails} />
      <RecentNotificationsList recentNotifications={recentNotifications} />
    </div>
  );
};

export default StudentDashboard;
