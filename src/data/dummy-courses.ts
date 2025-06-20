export const dummyCourses = [
  {
    id: "course-1",
    name: "Introduction to Computer Science",
    code: "CS101",
    description: "Fundamental concepts of computer science including programming basics, algorithms, and data structures.",
    credits: 3,
    semester: "Fall 2024",
    year: 2024,
    status: "active" as const,
    doctor_id: "user-2",
    doctor: {
      id: "user-2",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu"
    },
    enrolled_students: 45,
    max_students: 50,
    academic_year: "2024-2025",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "course-2",
    name: "Data Structures and Algorithms",
    code: "CS201",
    description: "Advanced study of data structures, algorithm design, and analysis techniques.",
    credits: 4,
    semester: "Spring 2024",
    year: 2024,
    status: "active" as const,
    doctor_id: "user-2",
    doctor: {
      id: "user-2",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu"
    },
    enrolled_students: 32,
    max_students: 40,
    academic_year: "2024-2025",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "course-3",
    name: "Database Systems",
    code: "CS301",
    description: "Design and implementation of database systems, SQL, and database management.",
    credits: 3,
    semester: "Fall 2024",
    year: 2024,
    status: "active" as const,
    doctor_id: "user-2",
    doctor: {
      id: "user-2",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu"
    },
    enrolled_students: 28,
    max_students: 35,
    academic_year: "2024-2025",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  }
];

export const dummyStudentCourses = [
  {
    enrollment_id: "enrollment-1",
    student_id: "user-1",
    course_id: "course-1",
    course: dummyCourses[0],
    enrolled_at: "2024-01-15T10:30:00Z",
    status: "active" as const,
    grade: null
  },
  {
    enrollment_id: "enrollment-2",
    student_id: "user-1",
    course_id: "course-2",
    course: dummyCourses[1],
    enrolled_at: "2024-01-15T10:30:00Z",
    status: "active" as const,
    grade: null
  }
];
