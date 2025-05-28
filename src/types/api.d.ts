
// Global API response types
declare interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

declare interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

declare interface PaginationResponse<T> {
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

declare interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// System health and status
declare interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  response_time: number;
  error_rate: number;
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    storage: 'up' | 'down';
    email: 'up' | 'down';
  };
}

// File upload types
declare interface FileUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  path: string;
  uploaded_by: string;
  uploaded_at: string;
}

declare interface UploadResponse {
  file: FileUpload;
  message: string;
}
