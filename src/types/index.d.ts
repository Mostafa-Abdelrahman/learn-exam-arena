
// Re-export all types for easier imports
export * from './user';
export * from './course';
export * from './exam';
export * from './question';
export * from './major';
export * from './grade';
export * from './student-courses';

// Service-specific types
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next?: boolean;
    has_prev?: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
