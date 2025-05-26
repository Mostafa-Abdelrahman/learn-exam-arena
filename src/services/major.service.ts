
import API from "./api.service";

export interface Major {
  id: string;
  major_id?: string;
  name: string;
  major_name?: string;
  description?: string;
  student_count?: number;
  doctor_count?: number;
  course_count?: number;
  created_at?: string;
  updated_at?: string;
}

const MajorService = {
  // Get all majors
  async getAllMajors(): Promise<{ data: Major[] }> {
    const response = await API.get("/majors");
    return response.data;
  },

  // Get a specific major
  async getMajor(id: string): Promise<{ data: Major }> {
    const response = await API.get(`/majors/${id}`);
    return response.data;
  },

  // Create a new major (admin only)
  async createMajor(majorData: Partial<Major>): Promise<{ data: Major }> {
    const response = await API.post("/admin/majors", majorData);
    return response.data;
  },

  // Update a major (admin only)
  async updateMajor(id: string, majorData: Partial<Major>): Promise<{ data: Major }> {
    const response = await API.put(`/admin/majors/${id}`, majorData);
    return response.data;
  },

  // Delete a major (admin only)
  async deleteMajor(id: string): Promise<{ message: string }> {
    const response = await API.delete(`/admin/majors/${id}`);
    return response.data;
  },

  // Get major statistics
  async getMajorStats(id: string): Promise<{ data: any }> {
    const response = await API.get(`/admin/majors/${id}/stats`);
    return response.data;
  },

  // Get students in a major
  async getMajorStudents(id: string): Promise<{ data: any[] }> {
    const response = await API.get(`/admin/majors/${id}/students`);
    return response.data;
  },

  // Get doctors in a major
  async getMajorDoctors(id: string): Promise<{ data: any[] }> {
    const response = await API.get(`/admin/majors/${id}/doctors`);
    return response.data;
  },

  // Get courses for a major
  async getMajorCourses(id: string): Promise<{ data: any[] }> {
    const response = await API.get(`/admin/majors/${id}/courses`);
    return response.data;
  }
};

export default MajorService;
