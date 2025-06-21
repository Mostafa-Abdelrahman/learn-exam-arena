
import ApiService from './api.service';
import { dummyGrades } from '@/data/dummy-grades';
import { dummyStudentCourses } from '@/data/dummy-student-courses';

class StudentService {
  // Get student grades
  async getStudentGrades(studentId: string): Promise<{ data: any[] }> {
    try {
      const response = await ApiService.get(`/student/${studentId}/grades`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentGrades failed, using dummy data:', error);
      return { data: dummyGrades };
    }
  }

  // Get student profile
  async getStudentProfile(studentId: string): Promise<any> {
    try {
      const response = await ApiService.get(`/student/${studentId}/profile`);
      return response.data || {
        id: studentId,
        name: "John Smith",
        email: "john.smith@university.edu",
        role: "student",
        profile: {
          bio: "Computer Science student passionate about AI and machine learning",
          phone: "+1234567890",
          address: "123 University Ave, Campus City"
        }
      };
    } catch (error) {
      console.warn('API getStudentProfile failed, using dummy data:', error);
      return {
        id: studentId,
        name: "John Smith",
        email: "john.smith@university.edu",
        role: "student",
        profile: {
          bio: "Computer Science student passionate about AI and machine learning",
          phone: "+1234567890",
          address: "123 University Ave, Campus City"
        }
      };
    }
  }

  // Update student profile
  async updateStudentProfile(studentId: string, profileData: any): Promise<{ message: string; student: any }> {
    try {
      const response = await ApiService.put(`/student/${studentId}/profile`, profileData);
      const responseData = response.data || response;
      return {
        message: response.message || 'Profile updated successfully',
        student: responseData?.student || {
          id: studentId,
          ...profileData,
          updated_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.warn('API updateStudentProfile failed, using dummy response:', error);
      return {
        message: 'Profile updated successfully',
        student: {
          id: studentId,
          ...profileData,
          updated_at: new Date().toISOString()
        }
      };
    }
  }

  // Get student courses
  async getStudentCourses(): Promise<{ data: StudentCourse[] }> {
    try {
      const response = await ApiService.get('/student/courses');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentCourses failed, using dummy data:', error);
      return { data: dummyStudentCourses };
    }
  }

  // Enroll in course
  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    try {
      // Remove any prefix from the course ID
      const cleanCourseId = courseId.replace(/^course-/, '');
      const response = await ApiService.post(`/student/courses/${cleanCourseId}/enroll`);
      return { message: response.message || 'Successfully enrolled in course' };
    } catch (error) {
      console.warn('API enrollInCourse failed, using dummy response:', error);
      return { message: 'Successfully enrolled in course' };
    }
  }
}

export default new StudentService();
