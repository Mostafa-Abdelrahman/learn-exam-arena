
import { supabase } from "@/integrations/supabase/client";

// User types that match with Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "student";
  gender: "male" | "female" | "other";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  gender: "male" | "female" | "other";
  role: "admin" | "doctor" | "student";
}

const AuthService = {
  // Login using Supabase
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    
    if (error) throw error;
    
    return data;
  },

  // Logout using Supabase
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  // Register using Supabase
  async register(userData: RegisterData) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          gender: userData.gender,
          role: userData.role,
        },
      },
    });
    
    if (error) throw error;
    
    return data;
  },

  // Get current user from Supabase
  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    // Get the user profile from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      name: data.name,
      email: session.user.email || '',
      role: data.role,
      gender: data.gender
    };
  },

  // Check if user is authenticated with Supabase
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Get user role from Supabase
  async getUserRole(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user ? user.role : null;
  }
};

export default AuthService;
