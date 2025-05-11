
import api from '../api/config';

const CourseService = {
  // Get all courses
  async getAllCourses() {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get a specific course
  async getCourse(id: string) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Get courses for a specific student
  async getStudentCourses(studentId: string) {
    // For students, we use the student-focused endpoint
    const response = await api.get('/courses');
    return response.data;
  },

  // Get courses for a specific doctor
  async getDoctorCourses(doctorId: string) {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get courses for a specific major
  async getMajorCourses(majorId: string) {
    const response = await api.get(`/majors/${majorId}/courses`);
    return response.data;
  },

  // Create a new course (admin only)
  async createCourse(courseData: any) {
    const response = await api.post('/admin/courses', courseData);
    return response.data;
  },

  // Update a course (admin only)
  async updateCourse(id: string, courseData: any) {
    const response = await api.put(`/admin/courses/${id}`, courseData);
    return response.data;
  },

  // Delete a course (admin only)
  async deleteCourse(id: string) {
    await api.delete(`/admin/courses/${id}`);
    return true;
  },

  // Assign doctor to course (admin only)
  async assignDoctorToCourse(doctorId: string, courseId: string) {
    const response = await api.post(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return response.data;
  },

  // Assign student to course (admin only)
  async assignStudentToCourse(studentId: string, courseId: string) {
    const response = await api.post(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return response.data;
  },

  // Remove doctor from course (admin only)
  async removeDoctorFromCourse(doctorId: string, courseId: string) {
    await api.delete(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return true;
  },

  // Remove student from course (admin only)
  async removeStudentFromCourse(studentId: string, courseId: string) {
    await api.delete(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return true;
  },
};

export default CourseService;
