
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
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "admin" | "doctor" | "student";
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, closeSidebar }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

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
          { name: "Profile", path: "/student/profile", icon: User },
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
