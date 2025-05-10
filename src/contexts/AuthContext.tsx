
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User, AuthError } from "@supabase/supabase-js";

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
  session: Session | null;
  user: User | null;
  profile: any | null;
  currentUser: any | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: AuthProvider wasn't wrapped correctly in a React component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);

        if (session?.user) {
          try {
            // We need to use any type here to avoid TypeScript errors until Supabase types are updated
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single() as any;
            
            if (error) {
              console.error('Error fetching user profile:', error);
              toast({
                title: "Profile Error",
                description: "Failed to load user profile",
                variant: "destructive",
              });
            } else {
              setProfile(profile);
            }
          } catch (err) {
            console.error('Profile fetch error:', err);
          }
        } else {
          setProfile(null);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          // We need to use any type here to avoid TypeScript errors until Supabase types are updated
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single() as any;
            
          if (profileError) {
            console.error('Profile initialization error:', profileError);
            toast({
              title: "Profile Error",
              description: "Failed to initialize user profile",
              variant: "destructive",
            });
          } else {
            setProfile(data);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const handleAuthError = (error: AuthError, action: string) => {
    console.error(`${action} error:`, error);
    const errorMessage = error.message === 'Database error saving new user'
      ? 'Failed to create user profile. Please try again.'
      : error.message;
    
    setError(errorMessage);
    toast({
      title: `${action} failed`,
      description: errorMessage,
      variant: "destructive",
    });
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (err) {
      if (err instanceof Error) {
        handleAuthError(err as AuthError, "Login");
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting signup process with data:', { 
        email: data.email,
        role: data.role,
        name: data.name,
        gender: data.gender 
      });
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            gender: data.gender,
            role: data.role,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
    } catch (err) {
      if (err instanceof Error) {
        handleAuthError(err as AuthError, "Registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (err) {
      if (err instanceof Error) {
        handleAuthError(err as AuthError, "Logout");
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    currentUser: profile,
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
