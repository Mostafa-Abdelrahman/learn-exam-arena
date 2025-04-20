
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!isAuthenticated || !currentUser) return "/login";
    
    switch (currentUser.role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/login";
    }
  };

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route.");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <div className="mx-auto max-w-md space-y-6 px-4">
        <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate(getDashboardPath())}
          className="mt-6"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
