
export const dummyExams = [
  {
    id: "exam-1",
    name: "Midterm Exam - CS101",
    description: "Comprehensive midterm examination covering programming fundamentals and basic algorithms.",
    course_id: "course-1",
    course: {
      id: "course-1",
      name: "Introduction to Computer Science",
      code: "CS101"
    },
    doctor_id: "user-2",
    exam_date: "2024-02-15T14:00:00Z",
    duration: 120,
    total_marks: 100,
    passing_marks: 60,
    status: "published" as const,
    instructions: "Read all questions carefully. Show your work for partial credit.",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-25T15:30:00Z",
    questions_count: 25
  },
  {
    id: "exam-2",
    name: "Final Exam - CS101",
    description: "Final examination covering all course material from the semester.",
    course_id: "course-1",
    course: {
      id: "course-1",
      name: "Introduction to Computer Science",
      code: "CS101"
    },
    doctor_id: "user-2",
    exam_date: "2024-03-20T10:00:00Z",
    duration: 180,
    total_marks: 150,
    passing_marks: 90,
    status: "draft" as const,
    instructions: "Final exam covering all semester topics. No external materials allowed.",
    created_at: "2024-02-01T09:00:00Z",
    updated_at: "2024-02-10T11:20:00Z",
    questions_count: 35
  },
  {
    id: "exam-3",
    name: "Quiz 1 - Data Structures",
    description: "Weekly quiz on arrays and linked lists.",
    course_id: "course-2",
    course: {
      id: "course-2",
      name: "Data Structures and Algorithms",
      code: "CS201"
    },
    doctor_id: "user-2",
    exam_date: "2024-02-05T16:00:00Z",
    duration: 30,
    total_marks: 25,
    passing_marks: 15,
    status: "published" as const,
    instructions: "Short quiz on basic data structures.",
    created_at: "2024-01-30T14:00:00Z",
    updated_at: "2024-02-01T09:15:00Z",
    questions_count: 10
  }
];

export const dummyUpcomingExams = dummyExams.filter(exam => 
  new Date(exam.exam_date) > new Date() && exam.status === "published"
);

export const dummyExamResults = [
  {
    exam_id: "exam-1",
    exam_name: "Midterm Exam - CS101",
    course_name: "Introduction to Computer Science",
    score: 85,
    status: "graded" as const,
    submitted_at: "2024-02-15T16:00:00Z"
  },
  {
    exam_id: "exam-3",
    exam_name: "Quiz 1 - Data Structures",
    course_name: "Data Structures and Algorithms",
    score: 92,
    status: "graded" as const,
    submitted_at: "2024-02-05T16:25:00Z"
  }
];
