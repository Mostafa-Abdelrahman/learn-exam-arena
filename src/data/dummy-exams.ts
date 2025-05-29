
export const dummyExams = [
  {
    id: "exam-1",
    name: "Midterm Exam - CS101",
    exam_name: "Midterm Exam - CS101",
    description: "Comprehensive midterm covering all topics from chapters 1-5",
    course_id: "course-1",
    course: {
      id: "course-1",
      name: "Introduction to Computer Science",
      code: "CS101"
    },
    doctor_id: "user-2",
    exam_date: "2024-03-15T10:00:00Z",
    duration: "120",
    exam_duration: "120",
    total_marks: 100,
    passing_marks: 60,
    instructions: "Read all questions carefully. Show your work for partial credit.",
    status: "published" as const,
    created_by: "user-2",
    created_at: "2024-02-15T10:30:00Z",
    updated_at: "2024-02-15T10:30:00Z",
    needs_grading: false,
    submission_count: 15,
    questions_count: 10
  },
  {
    id: "exam-2",
    name: "Final Exam - CS101",
    exam_name: "Final Exam - CS101",
    description: "Comprehensive final exam covering all course material",
    course_id: "course-1",
    course: {
      id: "course-1",
      name: "Introduction to Computer Science",
      code: "CS101"
    },
    doctor_id: "user-2",
    exam_date: "2024-05-20T14:00:00Z",
    duration: "180",
    exam_duration: "180",
    total_marks: 150,
    passing_marks: 90,
    instructions: "This is a comprehensive final exam. Manage your time wisely.",
    status: "draft" as const,
    created_by: "user-2",
    created_at: "2024-02-16T09:15:00Z",
    updated_at: "2024-02-16T09:15:00Z",
    needs_grading: false,
    submission_count: 0,
    questions_count: 15
  },
  {
    id: "exam-3",
    name: "Quiz 1 - Data Structures",
    exam_name: "Quiz 1 - Data Structures",
    description: "Quick assessment on basic data structures",
    course_id: "course-2",
    course: {
      id: "course-2",
      name: "Data Structures and Algorithms",
      code: "CS201"
    },
    doctor_id: "user-2",
    exam_date: "2024-02-28T11:00:00Z",
    duration: "60",
    exam_duration: "60",
    total_marks: 50,
    passing_marks: 30,
    instructions: "Short quiz on arrays, linked lists, and stacks.",
    status: "published" as const,
    created_by: "user-2",
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2024-02-01T08:00:00Z",
    needs_grading: true,
    submission_count: 25,
    questions_count: 5
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
    status: "graded",
    submitted_at: "2024-03-15T12:00:00Z"
  },
  {
    exam_id: "exam-3",
    exam_name: "Quiz 1 - Data Structures",
    course_name: "Data Structures and Algorithms",
    score: 92,
    status: "graded",
    submitted_at: "2024-02-28T12:00:00Z"
  }
];
