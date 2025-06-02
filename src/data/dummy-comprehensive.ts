
import { User } from '@/types/user';
import { Course } from '@/types/course';
import { Major } from '@/types/major';

// Majors
export const dummyMajors: Major[] = [
  {
    id: "major-1",
    name: "Computer Science",
    code: "CS",
    description: "Study of computational systems and design",
    status: "active",
    student_count: 45,
    course_count: 8,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "major-2", 
    name: "Information Technology",
    code: "IT",
    description: "Application of technology in business",
    status: "active",
    student_count: 32,
    course_count: 6,
    created_at: "2024-01-16T10:00:00Z"
  },
  {
    id: "major-3",
    name: "Software Engineering", 
    code: "SE",
    description: "Engineering approach to software development",
    status: "active",
    student_count: 28,
    course_count: 7,
    created_at: "2024-01-17T10:00:00Z"
  },
  {
    id: "major-4",
    name: "Data Science",
    code: "DS", 
    description: "Analysis and interpretation of complex data",
    status: "active",
    student_count: 22,
    course_count: 5,
    created_at: "2024-01-18T10:00:00Z"
  }
];

// Courses
export const dummyCourses: Course[] = [
  {
    id: "course-1",
    name: "Introduction to Programming",
    code: "CS101",
    description: "Basic programming concepts using Python",
    credits: 3,
    semester: "Fall 2024",
    major_id: "major-1",
    doctor_id: "doctor-1",
    student_count: 25,
    status: "active",
    created_at: "2024-02-01T10:00:00Z"
  },
  {
    id: "course-2", 
    name: "Data Structures",
    code: "CS201",
    description: "Fundamental data structures and algorithms",
    credits: 4,
    semester: "Fall 2024", 
    major_id: "major-1",
    doctor_id: "doctor-2",
    student_count: 20,
    status: "active",
    created_at: "2024-02-02T10:00:00Z"
  },
  {
    id: "course-3",
    name: "Database Systems",
    code: "IT301",
    description: "Design and implementation of database systems",
    credits: 3,
    semester: "Fall 2024",
    major_id: "major-2", 
    doctor_id: "doctor-3",
    student_count: 18,
    status: "active",
    created_at: "2024-02-03T10:00:00Z"
  },
  {
    id: "course-4",
    name: "Web Development",
    code: "SE201",
    description: "Full-stack web application development",
    credits: 4,
    semester: "Fall 2024",
    major_id: "major-3",
    doctor_id: "doctor-1", 
    student_count: 22,
    status: "active",
    created_at: "2024-02-04T10:00:00Z"
  },
  {
    id: "course-5",
    name: "Machine Learning",
    code: "DS401",
    description: "Introduction to machine learning algorithms",
    credits: 4,
    semester: "Fall 2024",
    major_id: "major-4",
    doctor_id: "doctor-4",
    student_count: 15,
    status: "active", 
    created_at: "2024-02-05T10:00:00Z"
  }
];

// Users - Students, Doctors, Admins
export const dummyUsers: User[] = [
  // Admins
  {
    id: "admin-1",
    name: "John Administrator",
    email: "admin@university.edu",
    role: "admin",
    gender: "male",
    status: "active",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z"
  },
  {
    id: "admin-2", 
    name: "Sarah Manager",
    email: "sarah.manager@university.edu",
    role: "admin",
    gender: "female",
    status: "active",
    created_at: "2024-01-02T08:00:00Z",
    updated_at: "2024-01-02T08:00:00Z"
  },

  // Doctors
  {
    id: "doctor-1",
    name: "Dr. Michael Smith",
    email: "michael.smith@university.edu", 
    role: "doctor",
    gender: "male",
    status: "active",
    major_id: "major-1",
    major: dummyMajors[0],
    courses: [dummyCourses[0], dummyCourses[3]],
    total_students: 47,
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z"
  },
  {
    id: "doctor-2",
    name: "Dr. Emily Johnson", 
    email: "emily.johnson@university.edu",
    role: "doctor",
    gender: "female",
    status: "active",
    major_id: "major-1",
    major: dummyMajors[0],
    courses: [dummyCourses[1]],
    total_students: 20,
    created_at: "2024-01-11T09:00:00Z",
    updated_at: "2024-01-11T09:00:00Z"
  },
  {
    id: "doctor-3",
    name: "Dr. Robert Wilson",
    email: "robert.wilson@university.edu",
    role: "doctor", 
    gender: "male",
    status: "active",
    major_id: "major-2",
    major: dummyMajors[1],
    courses: [dummyCourses[2]],
    total_students: 18,
    created_at: "2024-01-12T09:00:00Z",
    updated_at: "2024-01-12T09:00:00Z"
  },
  {
    id: "doctor-4",
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@university.edu",
    role: "doctor",
    gender: "female",
    status: "active", 
    major_id: "major-4",
    major: dummyMajors[3],
    courses: [dummyCourses[4]],
    total_students: 15,
    created_at: "2024-01-13T09:00:00Z",
    updated_at: "2024-01-13T09:00:00Z"
  },

  // Students
  {
    id: "student-1",
    name: "Alice Johnson",
    email: "alice.johnson@student.edu",
    role: "student",
    gender: "female",
    status: "active",
    major_id: "major-1",
    major: dummyMajors[0],
    gpa: 3.8,
    enrolled_courses: [dummyCourses[0], dummyCourses[1]],
    current_grade: 85,
    course: dummyCourses[0],
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: "student-2", 
    name: "Bob Smith",
    email: "bob.smith@student.edu",
    role: "student",
    gender: "male",
    status: "active",
    major_id: "major-1",
    major: dummyMajors[0],
    gpa: 3.5,
    enrolled_courses: [dummyCourses[0], dummyCourses[3]],
    current_grade: 78,
    course: dummyCourses[0],
    created_at: "2024-02-02T10:00:00Z",
    updated_at: "2024-02-02T10:00:00Z"
  },
  {
    id: "student-3",
    name: "Carol Davis",
    email: "carol.davis@student.edu",
    role: "student", 
    gender: "female",
    status: "active",
    major_id: "major-2",
    major: dummyMajors[1],
    gpa: 3.9,
    enrolled_courses: [dummyCourses[2]],
    current_grade: 92,
    course: dummyCourses[2],
    created_at: "2024-02-03T10:00:00Z",
    updated_at: "2024-02-03T10:00:00Z"
  },
  {
    id: "student-4",
    name: "David Wilson",
    email: "david.wilson@student.edu",
    role: "student",
    gender: "male", 
    status: "active",
    major_id: "major-3",
    major: dummyMajors[2],
    gpa: 3.2,
    enrolled_courses: [dummyCourses[3]],
    current_grade: 75,
    course: dummyCourses[3],
    created_at: "2024-02-04T10:00:00Z",
    updated_at: "2024-02-04T10:00:00Z"
  },
  {
    id: "student-5",
    name: "Emma Brown",
    email: "emma.brown@student.edu",
    role: "student",
    gender: "female",
    status: "active",
    major_id: "major-4",
    major: dummyMajors[3],
    gpa: 3.7,
    enrolled_courses: [dummyCourses[4]],
    current_grade: 88,
    course: dummyCourses[4],
    created_at: "2024-02-05T10:00:00Z", 
    updated_at: "2024-02-05T10:00:00Z"
  },
  {
    id: "student-6",
    name: "Frank Miller",
    email: "frank.miller@student.edu",
    role: "student",
    gender: "male",
    status: "active",
    major_id: "major-1",
    major: dummyMajors[0],
    gpa: 3.6,
    enrolled_courses: [dummyCourses[0], dummyCourses[1]],
    current_grade: 82,
    course: dummyCourses[1],
    created_at: "2024-02-06T10:00:00Z",
    updated_at: "2024-02-06T10:00:00Z"
  }
];

// Comprehensive Exams Data
export const dummyExamsComprehensive = [
  {
    id: "exam-1",
    name: "Python Programming Midterm",
    course_id: "course-1",
    course: dummyCourses[0],
    exam_date: "2024-07-20T10:00:00Z",
    duration: "120",
    status: "published" as const,
    created_by: "doctor-1",
    instructions: "Answer all questions. No external resources allowed.",
    total_marks: 100,
    passing_marks: 60,
    needs_grading: false,
    submission_count: 15,
    created_at: "2024-07-01T08:00:00Z",
    questions: [
      {
        id: "eq-1-1",
        exam_question_id: "eq-1-1",
        question_id: "q-1-1",
        text: "What is the output of print('Hello' + 'World')?",
        question_text: "What is the output of print('Hello' + 'World')?",
        type: "mcq" as const,
        question_type: "multiple-choice",
        choices: [
          { id: "c1-1", choice_id: "c1-1", text: "HelloWorld", choice_text: "HelloWorld", is_correct: true },
          { id: "c1-2", choice_id: "c1-2", text: "Hello World", choice_text: "Hello World", is_correct: false },
          { id: "c1-3", choice_id: "c1-3", text: "Error", choice_text: "Error", is_correct: false }
        ]
      },
      {
        id: "eq-1-2",
        exam_question_id: "eq-1-2", 
        question_id: "q-1-2",
        text: "Explain the difference between lists and tuples in Python.",
        question_text: "Explain the difference between lists and tuples in Python.",
        type: "written" as const,
        question_type: "written"
      }
    ]
  },
  {
    id: "exam-2",
    name: "Data Structures Final",
    course_id: "course-2",
    course: dummyCourses[1],
    exam_date: "2024-07-25T14:00:00Z",
    duration: "180",
    status: "published" as const,
    created_by: "doctor-2",
    instructions: "Comprehensive exam covering all course material.",
    total_marks: 150,
    passing_marks: 90,
    needs_grading: true,
    submission_count: 8,
    created_at: "2024-07-05T08:00:00Z",
    questions: [
      {
        id: "eq-2-1",
        exam_question_id: "eq-2-1",
        question_id: "q-2-1", 
        text: "What is the time complexity of searching in a binary search tree?",
        question_text: "What is the time complexity of searching in a binary search tree?",
        type: "mcq" as const,
        question_type: "multiple-choice",
        choices: [
          { id: "c2-1", choice_id: "c2-1", text: "O(n)", choice_text: "O(n)", is_correct: false },
          { id: "c2-2", choice_id: "c2-2", text: "O(log n)", choice_text: "O(log n)", is_correct: true },
          { id: "c2-3", choice_id: "c2-3", text: "O(1)", choice_text: "O(1)", is_correct: false }
        ]
      }
    ]
  },
  {
    id: "exam-3",
    name: "Database Design Quiz", 
    course_id: "course-3",
    course: dummyCourses[2],
    exam_date: "2024-08-01T11:00:00Z",
    duration: "60",
    status: "draft" as const,
    created_by: "doctor-3",
    instructions: "Short quiz on database normalization.",
    total_marks: 50,
    passing_marks: 30,
    needs_grading: false,
    submission_count: 0,
    created_at: "2024-07-10T08:00:00Z"
  },
  {
    id: "exam-4",
    name: "Web Development Project",
    course_id: "course-4",
    course: dummyCourses[3],
    exam_date: "2024-08-05T09:00:00Z",
    duration: "240",
    status: "published" as const,
    created_by: "doctor-1",
    instructions: "Build a complete web application.",
    total_marks: 200,
    passing_marks: 120,
    needs_grading: true,
    submission_count: 12,
    created_at: "2024-07-12T08:00:00Z"
  },
  {
    id: "exam-5",
    name: "ML Algorithms Test",
    course_id: "course-5", 
    course: dummyCourses[4],
    exam_date: "2024-08-10T13:00:00Z",
    duration: "150",
    status: "published" as const,
    created_by: "doctor-4",
    instructions: "Theoretical and practical machine learning questions.",
    total_marks: 120,
    passing_marks: 72,
    needs_grading: false,
    submission_count: 7,
    created_at: "2024-07-15T08:00:00Z"
  }
];

// Student Results/Grades
export const dummyStudentResults = [
  {
    id: "result-1",
    student_id: "student-1",
    exam_id: "exam-1",
    exam_name: "Python Programming Midterm", 
    course_name: "Introduction to Programming",
    score: 85,
    total_marks: 100,
    percentage: 85,
    status: "graded",
    submitted_at: "2024-07-20T12:00:00Z",
    graded_at: "2024-07-21T14:00:00Z"
  },
  {
    id: "result-2",
    student_id: "student-2",
    exam_id: "exam-1", 
    exam_name: "Python Programming Midterm",
    course_name: "Introduction to Programming",
    score: 78,
    total_marks: 100,
    percentage: 78,
    status: "graded",
    submitted_at: "2024-07-20T12:15:00Z",
    graded_at: "2024-07-21T14:15:00Z"
  },
  {
    id: "result-3",
    student_id: "student-1",
    exam_id: "exam-2",
    exam_name: "Data Structures Final",
    course_name: "Data Structures",
    score: 135,
    total_marks: 150,
    percentage: 90,
    status: "graded",
    submitted_at: "2024-07-25T17:00:00Z",
    graded_at: "2024-07-26T10:00:00Z"
  }
];

// Notifications
export const dummyNotifications = [
  {
    id: "notif-1",
    user_id: "student-1",
    title: "New Exam Available",
    message: "Python Programming Midterm is now available for taking",
    type: "exam",
    read: false,
    created_at: "2024-07-18T09:00:00Z"
  },
  {
    id: "notif-2", 
    user_id: "student-1",
    title: "Grade Released",
    message: "Your grade for Python Programming Midterm has been released",
    type: "grade",
    read: false,
    created_at: "2024-07-21T15:00:00Z"
  },
  {
    id: "notif-3",
    user_id: "doctor-1",
    title: "Submissions to Grade",
    message: "15 submissions pending grading for Python Programming Midterm",
    type: "grading",
    read: false,
    created_at: "2024-07-20T18:00:00Z"
  }
];
