
import API from "./api.service";

const CourseService = {
  // Get all courses
  getAllCourses() {
    return API.get("/courses");
  },

  // Get a specific course
  getCourse(id: number) {
    return API.get(`/courses/${id}`);
  },

  // Get courses for a specific student
  getStudentCourses(studentId: number) {
    return API.get(`/students/${studentId}/courses`);
  },

  // Get courses for a specific doctor
  getDoctorCourses(doctorId: number) {
    return API.get(`/doctors/${doctorId}/courses`);
  },

  // Get courses for a specific major
  getMajorCourses(majorId: number) {
    return API.get(`/majors/${majorId}/courses`);
  },

  // Create a new course (admin only)
  createCourse(courseData: any) {
    return API.post("/courses", courseData);
  },

  // Update a course (admin only)
  updateCourse(id: number, courseData: any) {
    return API.put(`/courses/${id}`, courseData);
  },

  // Delete a course (admin only)
  deleteCourse(id: number) {
    return API.delete(`/courses/${id}`);
  },

  // Assign doctor to course (admin only)
  assignDoctorToCourse(doctorId: number, courseId: number) {
    return API.post(`/doctor-courses`, { doctor_id: doctorId, course_id: courseId });
  },

  // Assign student to course (admin only)
  assignStudentToCourse(studentId: number, courseId: number) {
    return API.post(`/student-courses`, { student_id: studentId, course_id: courseId });
  },

  // Remove doctor from course (admin only)
  removeDoctorFromCourse(doctorCourseId: number) {
    return API.delete(`/doctor-courses/${doctorCourseId}`);
  },

  // Remove student from course (admin only)
  removeStudentFromCourse(studentCourseId: number) {
    return API.delete(`/student-courses/${studentCourseId}`);
  },
};

export default CourseService;
