
import API from './api.service';

const UserService = {
  // Get system statistics for admin dashboard
  async getSystemStats() {
    const response = await API.get('/admin/stats');
    return response;
  },

  // Get all users for admin
  async getAllUsers(params?: { role?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await API.get(`/admin/users?${queryParams.toString()}`);
    return response;
  },

  // Create new user
  async createUser(userData: any) {
    const response = await API.post('/admin/users', userData);
    return response;
  },

  // Update user
  async updateUser(userId: string, userData: any) {
    const response = await API.put(`/admin/users/${userId}`, userData);
    return response;
  },

  // Delete user
  async deleteUser(userId: string) {
    const response = await API.delete(`/admin/users/${userId}`);
    return response;
  },

  // Get all courses for admin
  async getAllCourses(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await API.get(`/admin/courses?${queryParams.toString()}`);
    return response;
  },

  // Create new course
  async createCourse(courseData: any) {
    const response = await API.post('/admin/courses', courseData);
    return response;
  },

  // Update course
  async updateCourse(courseId: string, courseData: any) {
    const response = await API.put(`/admin/courses/${courseId}`, courseData);
    return response;
  },

  // Delete course
  async deleteCourse(courseId: string) {
    const response = await API.delete(`/admin/courses/${courseId}`);
    return response;
  },

  // Assignment routes
  async assignDoctorToCourse(doctorId: string, courseId: string) {
    const response = await API.post(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return response;
  },

  async removeDoctorFromCourse(doctorId: string, courseId: string) {
    const response = await API.delete(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return response;
  },

  async enrollStudentInCourse(studentId: string, courseId: string) {
    const response = await API.post(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return response;
  },

  async removeStudentFromCourse(studentId: string, courseId: string) {
    const response = await API.delete(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return response;
  },
};

export default UserService;
