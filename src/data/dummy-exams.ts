
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
    exam_date: "2024-06-15T10:00:00Z",
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
    questions_count: 10,
    questions: [
      {
        id: "eq-1",
        exam_question_id: "eq-1",
        question_id: "q-1",
        text: "What is the capital of France?",
        question_text: "What is the capital of France?",
        type: "mcq" as const,
        question_type: "multiple-choice",
        difficulty_level: "easy",
        choices: [
          { id: "c1", choice_id: "c1", text: "London", choice_text: "London", is_correct: false },
          { id: "c2", choice_id: "c2", text: "Paris", choice_text: "Paris", is_correct: true },
          { id: "c3", choice_id: "c3", text: "Berlin", choice_text: "Berlin", is_correct: false },
          { id: "c4", choice_id: "c4", text: "Madrid", choice_text: "Madrid", is_correct: false }
        ]
      },
      {
        id: "eq-2",
        exam_question_id: "eq-2",
        question_id: "q-2",
        text: "Explain the concept of object-oriented programming.",
        question_text: "Explain the concept of object-oriented programming.",
        type: "written" as const,
        question_type: "written",
        difficulty_level: "medium"
      }
    ]
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
    exam_date: "2024-07-20T14:00:00Z",
    duration: "180",
    exam_duration: "180",
    total_marks: 150,
    passing_marks: 90,
    instructions: "This is a comprehensive final exam. Manage your time wisely.",
    status: "published" as const,
    created_by: "user-2",
    created_at: "2024-02-16T09:15:00Z",
    updated_at: "2024-02-16T09:15:00Z",
    needs_grading: false,
    submission_count: 0,
    questions_count: 15,
    questions: [
      {
        id: "eq-3",
        exam_question_id: "eq-3",
        question_id: "q-3",
        text: "Which programming paradigm emphasizes functions as first-class citizens?",
        question_text: "Which programming paradigm emphasizes functions as first-class citizens?",
        type: "mcq" as const,
        question_type: "multiple-choice",
        difficulty_level: "medium",
        choices: [
          { id: "c5", choice_id: "c5", text: "Object-Oriented", choice_text: "Object-Oriented", is_correct: false },
          { id: "c6", choice_id: "c6", text: "Functional", choice_text: "Functional", is_correct: true },
          { id: "c7", choice_id: "c7", text: "Procedural", choice_text: "Procedural", is_correct: false },
          { id: "c8", choice_id: "c8", text: "Imperative", choice_text: "Imperative", is_correct: false }
        ]
      }
    ]
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
    exam_date: "2024-06-28T11:00:00Z",
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
    questions_count: 5,
    questions: [
      {
        id: "eq-4",
        exam_question_id: "eq-4",
        question_id: "q-4",
        text: "Describe the time complexity of searching in a binary search tree.",
        question_text: "Describe the time complexity of searching in a binary search tree.",
        type: "written" as const,
        question_type: "written",
        difficulty_level: "hard"
      }
    ]
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
    submitted_at: "2024-06-15T12:00:00Z"
  },
  {
    exam_id: "exam-3",
    exam_name: "Quiz 1 - Data Structures",
    course_name: "Data Structures and Algorithms",
    score: 92,
    status: "graded",
    submitted_at: "2024-06-28T12:00:00Z"
  }
];
