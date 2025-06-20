
export const dummyExams = [
  {
    id: "exam-1",
    name: "Introduction to Programming Midterm",
    exam_name: "Introduction to Programming Midterm",
    description: "Comprehensive midterm covering Python basics and fundamental programming concepts",
    course_id: "course-1",
    course: {
      id: "course-1",
      name: "Introduction to Programming",
      code: "CS101"
    },
    doctor_id: "doctor-1",
    exam_date: "2024-07-20T10:00:00Z",
    duration: "120",
    exam_duration: "120",
    total_marks: 100,
    passing_marks: 60,
    instructions: "Read all questions carefully. Show your work for partial credit. No external resources allowed.",
    status: "published" as const,
    created_by: "doctor-1",
    created_at: "2024-02-15T10:30:00Z",
    updated_at: "2024-02-15T10:30:00Z",
    needs_grading: false,
    submission_count: 35,
    questions_count: 15,
    questions: [
      {
        id: "eq-1",
        exam_question_id: "eq-1",
        question_id: "q-1",
        text: "What is the output of print('Hello' + 'World')?",
        question_text: "What is the output of print('Hello' + 'World')?",
        type: "mcq" as const,
        question_type: "multiple-choice",
        difficulty_level: "easy",
        choices: [
          { id: "c1", choice_id: "c1", text: "HelloWorld", choice_text: "HelloWorld", is_correct: true },
          { id: "c2", choice_id: "c2", text: "Hello World", choice_text: "Hello World", is_correct: false },
          { id: "c3", choice_id: "c3", text: "Error", choice_text: "Error", is_correct: false },
          { id: "c4", choice_id: "c4", text: "None", choice_text: "None", is_correct: false }
        ]
      },
      {
        id: "eq-2",
        exam_question_id: "eq-2",
        question_id: "q-2",
        text: "Explain the difference between lists and tuples in Python. Provide examples.",
        question_text: "Explain the difference between lists and tuples in Python. Provide examples.",
        type: "written" as const,
        question_type: "written",
        difficulty_level: "medium"
      }
    ]
  },
  {
    id: "exam-2",
    name: "Data Structures Final Exam",
    exam_name: "Data Structures Final Exam",
    description: "Comprehensive final exam covering all data structures and algorithms",
    course_id: "course-2",
    course: {
      id: "course-2",
      name: "Data Structures and Algorithms",
      code: "CS201"
    },
    doctor_id: "doctor-2",
    exam_date: "2024-08-25T14:00:00Z",
    duration: "180",
    exam_duration: "180",
    total_marks: 150,
    passing_marks: 90,
    instructions: "This is a comprehensive final exam. Manage your time wisely. Answer all questions.",
    status: "published" as const,
    created_by: "doctor-2",
    created_at: "2024-02-16T09:15:00Z",
    updated_at: "2024-02-16T09:15:00Z",
    needs_grading: true,
    submission_count: 28,
    questions_count: 20,
    questions: [
      {
        id: "eq-3",
        exam_question_id: "eq-3",
        question_id: "q-3",
        text: "What is the time complexity of searching in a binary search tree?",
        question_text: "What is the time complexity of searching in a binary search tree?",
        type: "mcq" as const,
        question_type: "multiple-choice",
        difficulty_level: "medium",
        choices: [
          { id: "c5", choice_id: "c5", text: "O(n)", choice_text: "O(n)", is_correct: false },
          { id: "c6", choice_id: "c6", text: "O(log n)", choice_text: "O(log n)", is_correct: true },
          { id: "c7", choice_id: "c7", text: "O(1)", choice_text: "O(1)", is_correct: false },
          { id: "c8", choice_id: "c8", text: "O(n²)", choice_text: "O(n²)", is_correct: false }
        ]
      }
    ]
  },
  {
    id: "exam-3",
    name: "Database Design Quiz",
    exam_name: "Database Design Quiz", 
    description: "Quick assessment on database normalization and design principles",
    course_id: "course-3",
    course: {
      id: "course-3",
      name: "Database Systems",
      code: "IT301"
    },
    doctor_id: "doctor-3",
    exam_date: "2024-08-01T11:00:00Z",
    duration: "60",
    exam_duration: "60",
    total_marks: 50,
    passing_marks: 30,
    instructions: "Short quiz on database normalization and design. Answer concisely.",
    status: "published" as const,
    created_by: "doctor-3",
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2024-02-01T08:00:00Z",
    needs_grading: false,
    submission_count: 22,
    questions_count: 8,
    questions: [
      {
        id: "eq-4",
        exam_question_id: "eq-4",
        question_id: "q-4",
        text: "Explain the concept of database normalization and its benefits.",
        question_text: "Explain the concept of database normalization and its benefits.",
        type: "written" as const,
        question_type: "written",
        difficulty_level: "medium"
      }
    ]
  },
  {
    id: "exam-4",
    name: "Web Development Project Assessment",
    exam_name: "Web Development Project Assessment",
    description: "Practical assessment requiring development of a complete web application",
    course_id: "course-4",
    course: {
      id: "course-4",
      name: "Web Development",
      code: "SE201"
    },
    doctor_id: "doctor-1",
    exam_date: "2024-08-15T09:00:00Z",
    duration: "240",
    exam_duration: "240",
    total_marks: 200,
    passing_marks: 120,
    instructions: "Build a complete web application with frontend and backend. Document your code.",
    status: "published" as const,
    created_by: "doctor-1",
    created_at: "2024-02-12T08:00:00Z",
    updated_at: "2024-02-12T08:00:00Z",
    needs_grading: true,
    submission_count: 31,
    questions_count: 5,
    questions: []
  },
  {
    id: "exam-5",
    name: "Machine Learning Algorithms Test",
    exam_name: "Machine Learning Algorithms Test",
    description: "Theoretical and practical questions on machine learning algorithms",
    course_id: "course-5", 
    course: {
      id: "course-5",
      name: "Machine Learning Fundamentals",
      code: "DS401"
    },
    doctor_id: "doctor-4",
    exam_date: "2024-08-30T13:00:00Z",
    duration: "150",
    exam_duration: "150",
    total_marks: 120,
    passing_marks: 72,
    instructions: "Answer both theoretical and practical machine learning questions.",
    status: "published" as const,
    created_by: "doctor-4",
    created_at: "2024-02-15T08:00:00Z",
    updated_at: "2024-02-15T08:00:00Z",
    needs_grading: false,
    submission_count: 19,
    questions_count: 12,
    questions: []
  },
  {
    id: "exam-6",
    name: "Network Security Assessment",
    exam_name: "Network Security Assessment",
    description: "Comprehensive assessment of network security concepts and practices",
    course_id: "course-6",
    course: {
      id: "course-6",
      name: "Network Security",
      code: "CY301"
    },
    doctor_id: "doctor-5",
    exam_date: "2024-09-05T10:00:00Z",
    duration: "120",
    exam_duration: "120",
    total_marks: 100,
    passing_marks: 65,
    instructions: "Focus on security protocols, threat analysis, and prevention methods.",
    status: "draft" as const,
    created_by: "doctor-5",
    created_at: "2024-02-18T08:00:00Z",
    updated_at: "2024-02-18T08:00:00Z",
    needs_grading: false,
    submission_count: 0,
    questions_count: 10,
    questions: []
  },
  {
    id: "exam-7",
    name: "Computer Vision Final Project",
    exam_name: "Computer Vision Final Project",
    description: "Final project implementing computer vision algorithms",
    course_id: "course-7",
    course: {
      id: "course-7",
      name: "Computer Vision",
      code: "AI501"
    },
    doctor_id: "doctor-6",
    exam_date: "2024-09-10T14:00:00Z",
    duration: "180",
    exam_duration: "180",
    total_marks: 150,
    passing_marks: 90,
    instructions: "Implement and demonstrate computer vision algorithms with documentation.",
    status: "draft" as const,
    created_by: "doctor-6",
    created_at: "2024-02-20T08:00:00Z",
    updated_at: "2024-02-20T08:00:00Z",
    needs_grading: false,
    submission_count: 0,
    questions_count: 8,
    questions: []
  }
];

export const dummyUpcomingExams = dummyExams.filter(exam => 
  new Date(exam.exam_date) > new Date() && exam.status === "published"
);

export const dummyExamResults = [
  {
    exam_id: "exam-1",
    exam_name: "Introduction to Programming Midterm",
    course_name: "Introduction to Programming",
    score: 85,
    status: "graded",
    submitted_at: "2024-07-20T12:00:00Z"
  },
  {
    exam_id: "exam-3",
    exam_name: "Database Design Quiz",
    course_name: "Database Systems",
    score: 92,
    status: "graded",
    submitted_at: "2024-08-01T12:00:00Z"
  },
  {
    exam_id: "exam-2",
    exam_name: "Data Structures Final Exam",
    course_name: "Data Structures and Algorithms",
    score: 78,
    status: "graded",
    submitted_at: "2024-08-25T16:30:00Z"
  }
];
