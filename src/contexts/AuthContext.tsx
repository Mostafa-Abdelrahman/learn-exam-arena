
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthService, { User } from "@/services/auth.service";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData extends LoginCredentials {
  name: string;
  gender: "male" | "female" | "other";
  role: "admin" | "doctor" | "student";
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated
        const authenticated = await AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Get current user data
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Event listener for handling changes to authentication state
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'token') {
        const authenticated = await AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      
      if (response) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Redirect based on user role
        if (currentUser?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (currentUser?.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (currentUser?.role === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
      toast({
        title: "Login failed",
        description: err.message || "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      
      await AuthService.register(data);
      
      toast({
        title: "Registration successful",
        description: "Please login with your new account.",
      });
      
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Failed to register");
      toast({
        title: "Registration failed",
        description: err.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (err: any) {
      toast({
        title: "Logout error",
        description: err.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile: user, // For backward compatibility
    currentUser: user, // For backward compatibility
    loading,
    error,
    login,
    signUp,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
