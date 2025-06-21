
import LocalStorageService from './local-storage.service';

export interface EnrollmentRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  course_id: string;
  course_name: string;
  course_code: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'completed' | 'dropped';
}

class EnrollmentService {
  private STORAGE_KEY = 'exam_arena_enrollments';

  // Initialize with dummy data if none exists
  private initializeEnrollments() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const dummyEnrollments: EnrollmentRecord[] = [
        {
          id: 'enroll-1',
          student_id: 'student-1',
          student_name: 'John Smith',
          student_email: 'john.smith@university.edu',
          course_id: 'course-1',
          course_name: 'Introduction to Computer Science',
          course_code: 'CS101',
          enrollment_date: '2024-01-15',
          status: 'active'
        },
        {
          id: 'enroll-2',
          student_id: 'student-2',
          student_name: 'Emily Johnson',
          student_email: 'emily.johnson@university.edu',
          course_id: 'course-2',
          course_name: 'Data Structures',
          course_code: 'CS201',
          enrollment_date: '2024-01-16',
          status: 'active'
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dummyEnrollments));
    }
  }

  async getAllEnrollments(): Promise<{ data: EnrollmentRecord[] }> {
    this.initializeEnrollments();
    const enrollments = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return { data: enrollments };
  }

  async enrollStudent(studentId: string, courseId: string): Promise<{ data: EnrollmentRecord; message: string }> {
    this.initializeEnrollments();
    const enrollments = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    
    // Get student and course info from local storage
    const users = LocalStorageService.getUsers();
    const courses = LocalStorageService.getData('exam_arena_courses');
    
    const student = users.find(u => u.id === studentId);
    const course = courses.find(c => c.id === courseId);
    
    if (!student || !course) {
      throw new Error('Student or course not found');
    }

    const newEnrollment: EnrollmentRecord = {
      id: `enroll-${Date.now()}`,
      student_id: studentId,
      student_name: student.name,
      student_email: student.email,
      course_id: courseId,
      course_name: course.name,
      course_code: course.code,
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    enrollments.push(newEnrollment);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(enrollments));
    
    return {
      data: newEnrollment,
      message: 'Student enrolled successfully'
    };
  }

  async unenrollStudent(enrollmentId: string): Promise<{ message: string }> {
    this.initializeEnrollments();
    const enrollments = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    
    const filteredEnrollments = enrollments.filter((e: EnrollmentRecord) => e.id !== enrollmentId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEnrollments));
    
    return { message: 'Student unenrolled successfully' };
  }

  async updateEnrollmentStatus(enrollmentId: string, status: string): Promise<{ data: EnrollmentRecord; message: string }> {
    this.initializeEnrollments();
    const enrollments = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    
    const enrollmentIndex = enrollments.findIndex((e: EnrollmentRecord) => e.id === enrollmentId);
    if (enrollmentIndex === -1) {
      throw new Error('Enrollment not found');
    }

    enrollments[enrollmentIndex].status = status as 'active' | 'inactive' | 'completed' | 'dropped';
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(enrollments));
    
    return {
      data: enrollments[enrollmentIndex],
      message: 'Enrollment status updated successfully'
    };
  }

  async getStudentEnrollments(studentId: string): Promise<{ data: EnrollmentRecord[] }> {
    this.initializeEnrollments();
    const enrollments = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const studentEnrollments = enrollments.filter((e: EnrollmentRecord) => e.student_id === studentId);
    return { data: studentEnrollments };
  }

  async getCourseEnrollments(courseId: string): Promise<{ data: EnrollmentRecord[] }> {
    this.initializeEnrollments();
    const enrollments = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const courseEnrollments = enrollments.filter((e: EnrollmentRecord) => e.course_id === courseId);
    return { data: courseEnrollments };
  }
}

export default new EnrollmentService();
