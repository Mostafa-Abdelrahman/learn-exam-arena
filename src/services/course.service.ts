
import api from '../api/config';
import { Course, mapCourseData } from '../types/student-courses';

interface CoursesResponse {
  data: Course[];
}

const CourseService = {
  // Get all courses
  async getAllCourses(): Promise<CoursesResponse> {
    const response = await api.get('/courses');
    return {
      data: (response.data.data || []).map(mapCourseData)
    };
  },

  // Get a specific course
  async getCourse(id: string): Promise<{data: Course}> {
    const response = await api.get(`/courses/${id}`);
    return {
      data: mapCourseData(response.data.data || response.data)
    };
  },

  // Get courses for the authenticated student
  async getStudentCourses(): Promise<CoursesResponse> {
    const response = await api.get('/courses');
    return {
      data: (response.data.data || []).map(mapCourseData)
    };
  },

  // Get courses assigned to a specific doctor
  async getDoctorCourses(doctorId: string): Promise<CoursesResponse> {
    const response = await api.get(`/doctors/${doctorId}/courses`);
    return {
      data: (response.data.data || []).map(mapCourseData)
    };
  },
};

export default CourseService;
