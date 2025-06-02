
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
  status?: 'active' | 'inactive' | 'suspended';
  major_id?: string;
  major?: Major;
  created_at: string;
  updated_at: string;
  
  // Student-specific properties
  gpa?: number;
  enrolled_courses?: Course[];
  current_grade?: number;
  course?: Course;
  
  // Doctor-specific properties
  courses?: Course[];
  total_students?: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'doctor' | 'admin';
  gender: 'male' | 'female' | 'other';
  major_id?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'student' | 'doctor' | 'admin';
  gender?: 'male' | 'female' | 'other';
  major_id?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
