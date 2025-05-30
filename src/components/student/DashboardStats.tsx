
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, GraduationCap, Bell } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    enrolled_courses: number;
    upcoming_exams: number;
    completed_exams: number;
    unread_notifications: number;
  };
  onNavigate: (path: string) => void;
}

const DashboardStats = ({ stats, onNavigate }: DashboardStatsProps) => {
  const statsCards = [
    {
      title: "Enrolled Courses",
      value: stats.enrolled_courses,
      icon: BookOpen,
      color: "text-blue-600",
      path: "/student/courses",
    },
    {
      title: "Upcoming Exams",
      value: stats.upcoming_exams,
      icon: Calendar,
      color: "text-orange-600",
      path: "/student/exams",
    },
    {
      title: "Completed Exams",
      value: stats.completed_exams,
      icon: GraduationCap,
      color: "text-green-600",
      path: "/student/results",
    },
    {
      title: "Unread Notifications",
      value: stats.unread_notifications,
      icon: Bell,
      color: "text-purple-600",
      path: "/student/notifications",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <Card 
          key={stat.title} 
          className="hover:shadow-md transition-shadow cursor-pointer" 
          onClick={() => onNavigate(stat.path)}
        >
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
  );
};

export default DashboardStats;
