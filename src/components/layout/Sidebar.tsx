import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Book, 
  FileText, 
  User,
  Settings,
  X,
  GraduationCap,
  BookOpen,
  School,
  CalendarCheck,
  PenTool,
  ClipboardList,
  Award,
  BarChart,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import ExamService from "@/services/exam.service";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  role: "admin" | "doctor" | "student";
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, closeSidebar }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Fetch exam results for students
  const { data: examResults } = useQuery({
    queryKey: ["student-results-sidebar"],
    queryFn: async () => {
      if (role !== "student") return [];
      try {
        const response = await ExamService.getStudentResults();
        return response.data || [];
      } catch (error) {
        console.error('Error fetching exam results for sidebar:', error);
        return [];
      }
    },
    enabled: role === "student",
  });

  // Calculate quick stats for students
  const getQuickStats = () => {
    if (!examResults || examResults.length === 0) return null;
    
    const totalExams = examResults.length;
    const averageScore = Math.round(
      examResults.reduce((sum: number, result: any) => sum + parseFloat(result.score), 0) / totalExams
    );
    const passedExams = examResults.filter((result: any) => parseFloat(result.score) >= 60).length;
    
    return { totalExams, averageScore, passedExams };
  };

  const quickStats = getQuickStats();

  // Different navigation items based on user role
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", path: "/admin/dashboard", icon: Home },
          { name: "Majors", path: "/admin/majors", icon: School },
          { name: "Courses", path: "/admin/courses", icon: BookOpen },
          { name: "Doctors", path: "/admin/doctors", icon: User },
          { name: "Students", path: "/admin/students", icon: GraduationCap },
          { name: "Statistics", path: "/admin/statistics", icon: BarChart },
          { name: "Settings", path: "/admin/settings", icon: Settings },
        ];
      case "doctor":
        return [
          { name: "Dashboard", path: "/doctor/dashboard", icon: Home },
          { name: "My Courses", path: "/doctor/courses", icon: BookOpen },
          { name: "Question Bank", path: "/doctor/questions", icon: PenTool },
          { name: "Exams", path: "/doctor/exams", icon: FileText },
          { name: "Grading", path: "/doctor/grading", icon: Award },
          { name: "Students", path: "/doctor/students", icon: GraduationCap },
          { name: "Reports", path: "/doctor/reports", icon: BarChart },
          { name: "Settings", path: "/doctor/settings", icon: Settings },
        ];
      case "student":
        return [
          { name: "Dashboard", path: "/student/dashboard", icon: Home },
          { name: "My Courses", path: "/student/courses", icon: Book },
          { name: "Exams", path: "/student/exams", icon: ClipboardList },
          { name: "Schedule", path: "/student/schedule", icon: CalendarCheck },
          { name: "Grades", path: "/student/grades", icon: Award },
          { name: "Results", path: "/student/results", icon: Trophy },
          { name: "Settings", path: "/student/settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link 
          to={`/${role}/dashboard`} 
          className="flex items-center text-lg font-semibold"
        >
          <FileText className="mr-2 h-6 w-6 text-sidebar-primary" />
          <span>Exam Arena</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto md:hidden"
          onClick={closeSidebar}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2.5 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Quick Exam Results Summary for Students */}
        {role === "student" && quickStats && (
          <div className="px-3 mt-4">
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-4 w-4 text-sidebar-primary" />
                <span className="text-xs font-medium text-sidebar-foreground">Quick Stats</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-sidebar-foreground/70">Exams Taken:</span>
                  <span className="font-medium">{quickStats.totalExams}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-sidebar-foreground/70">Avg Score:</span>
                  <span className="font-medium text-green-500">{quickStats.averageScore}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-sidebar-foreground/70">Passed:</span>
                  <span className="font-medium text-blue-500">{quickStats.passedExams}/{quickStats.totalExams}</span>
                </div>
              </div>
              <Link
                to="/student/results"
                className="mt-3 block text-center text-xs text-sidebar-primary hover:underline"
              >
                View All Results →
              </Link>
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 py-2">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {currentUser?.role || "Unknown role"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
