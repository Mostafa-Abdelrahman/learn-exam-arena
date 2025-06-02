
export interface Major {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  student_count?: number;
  course_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMajorData {
  name: string;
  code: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateMajorData {
  name?: string;
  code?: string;
  description?: string;
  status?: 'active' | 'inactive';
}
