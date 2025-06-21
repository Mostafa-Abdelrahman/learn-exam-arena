
// Standardized API response format
export interface StandardApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
      has_next?: boolean;
      has_prev?: boolean;
    };
    timestamp?: string;
    request_id?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error_code?: string;
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

// Safe user response without sensitive data
export interface SafeUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  profile?: {
    bio?: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: SafeUserResponse;
    expires_in: number;
    refresh_token?: string;
  };
  message?: string;
}
