export const dummyStudentCourses: StudentCourse[] = [
  {
    student_course_id: "sc-1",
    student_id: "user-1",
    course_id: "course-1",
    enrollment_date: "2024-01-15T10:00:00Z",
    status: "active",
    course: {
      course_id: "course-1",
      course_name: "Introduction to Computer Science",
      course_code: "CS101",
      description: "Fundamental concepts of computer science including programming basics",
      student_count: 45,
      exam_count: 3,
      doctor: {
        id: "user-2",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu"
      }
    }
  },
  {
    student_course_id: "sc-2",
    student_id: "user-1",
    course_id: "course-2",
    enrollment_date: "2024-01-16T09:30:00Z",
    status: "active",
    course: {
      course_id: "course-2",
      course_name: "Data Structures and Algorithms",
      course_code: "CS201",
      description: "Advanced data structures and algorithm design and analysis",
      student_count: 32,
      exam_count: 2,
      doctor: {
        id: "user-2",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu"
      }
    }
  }
];
