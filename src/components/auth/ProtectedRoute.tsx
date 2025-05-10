
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        
        if (authenticated && session?.user) {
          // Get user role from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user role:", error);
            setIsAuthenticated(false);
          } else if (data) {
            setUserRole(data.role);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        
        if (authenticated && session?.user) {
          // Get user role from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user role:", error);
            setIsAuthenticated(false);
          } else if (data) {
            setUserRole(data.role);
          } else {
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    // Show loading indicator while checking authentication
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-primary h-12 w-12"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles.length > 0 &&
    userRole &&
    !allowedRoles.includes(userRole)
  ) {
    // Redirect based on user role if they don't have access
    let redirectPath = "/login";
    
    if (userRole === "admin") {
      redirectPath = "/admin/dashboard";
    } else if (userRole === "doctor") {
      redirectPath = "/doctor/dashboard";
    } else if (userRole === "student") {
      redirectPath = "/student/dashboard";
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
