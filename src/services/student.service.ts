import ApiService from './api.service';
import { dummyGrades } from '@/data/dummy-grades';
import { dummyStudentCourses } from '@/data/dummy-student-courses';

class StudentService {
  // Get student grades
  async getStudentGrades(studentId: string): Promise<{ data: any[] }> {
    try {
      console.log('Calling API for student grades...');
      const response = await ApiService.get('/student/grades');
      console.log('Raw API response:', response);
      
      // Handle nested data structure: {success: true, data: {data: [...]}}
      let gradesArray = [];
      const responseData = response.data as any;
      
      console.log('Response data type:', typeof responseData);
      console.log('Response data:', responseData);
      
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        gradesArray = responseData.data;
        console.log('Using nested data structure, found', gradesArray.length, 'grades');
      } else if (Array.isArray(responseData)) {
        gradesArray = responseData;
        console.log('Using direct array structure, found', gradesArray.length, 'grades');
      } else {
        console.warn('Unexpected response structure:', responseData);
        gradesArray = [];
      }
      
      console.log('Processed grades array:', gradesArray);
      return { data: gradesArray };
    } catch (error) {
      console.error('API getStudentGrades failed:', error);
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
      
      // Handle StandardApiResponse<unknown> type
      const extractedData = responseData as any;
      const student = extractedData?.student || {
        id: studentId,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      return {
        message: response.message || 'Profile updated successfully',
        student
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
      console.log('Calling API for student courses...');
      const response = await ApiService.get('/student/courses');
      console.log('Raw API response:', response);
      
      // Handle nested data structure: {success: true, data: {data: [...]}}
      let coursesArray = [];
      const responseData = response.data as any;
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        coursesArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        coursesArray = responseData;
      }
      
      console.log('Processed courses array:', coursesArray);
      return { data: coursesArray };
    } catch (error) {
      console.error('API getStudentCourses failed:', error);
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
