
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to the appropriate dashboard
    if (isAuthenticated && currentUser) {
      switch (currentUser.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/login");
      }
    } else {
      // If not authenticated, redirect to login
      navigate("/login");
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full border-t-2 border-primary h-12 w-12"></div>
    </div>
  );
};

export default Index;
