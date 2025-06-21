// Mock data for exam system
export const mockExams: Exam[] = [
  {
    id: "exam-1",
    name: "Introduction to Programming - Final Exam",
    course_id: "course-1", 
    exam_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "120",
    status: "published",
    instructions: "Read all questions carefully. You have 2 hours to complete this exam.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: {
      id: "course-1",
      name: "Introduction to Programming",
      code: "CS101"
    },
    questions: [
      {
        id: "q1",
        question_id: "q1",
        exam_id: "exam-1",
        text: "What is the output of the following Python code?\n\nprint('Hello' + ' ' + 'World')",
        type: "multiple_choice",
        weight: 10,
        choices: [
          { id: "c1", text: "Hello World", is_correct: true },
          { id: "c2", text: "HelloWorld", is_correct: false },
          { id: "c3", text: "Hello + World", is_correct: false },
          { id: "c4", text: "Error", is_correct: false }
        ]
      },
      {
        id: "q2", 
        question_id: "q2",
        exam_id: "exam-1",
        text: "Explain the difference between a list and a tuple in Python.",
        type: "essay",
        weight: 15
      },
      {
        id: "q3",
        question_id: "q3", 
        exam_id: "exam-1",
        text: "Which of the following are valid Python data types? (Select all that apply)",
        type: "multiple_choice",
        weight: 10,
        choices: [
          { id: "c5", text: "int", is_correct: true },
          { id: "c6", text: "string", is_correct: false },
          { id: "c7", text: "str", is_correct: true },
          { id: "c8", text: "boolean", is_correct: false },
          { id: "c9", text: "bool", is_correct: true }
        ]
      }
    ]
  },
  {
    id: "exam-2",
    name: "Data Structures - Midterm",
    course_id: "course-2",
    exam_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "90",
    status: "published", 
    instructions: "Answer all questions. Show your work for full credit.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: {
      id: "course-2",
      name: "Data Structures",
      code: "CS201"
    },
    questions: [
      {
        id: "q4",
        question_id: "q4",
        exam_id: "exam-2", 
        text: "What is the time complexity of searching in a balanced binary search tree?",
        type: "multiple_choice",
        weight: 10,
        choices: [
          { id: "c10", text: "O(1)", is_correct: false },
          { id: "c11", text: "O(log n)", is_correct: true },
          { id: "c12", text: "O(n)", is_correct: false },
          { id: "c13", text: "O(n²)", is_correct: false }
        ]
      },
      {
        id: "q5",
        question_id: "q5",
        exam_id: "exam-2",
        text: "Implement a function to reverse a linked list. Explain your approach.",
        type: "essay", 
        weight: 20
      }
    ]
  }
];

export const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "What is the output of the following Python code?\n\nprint('Hello' + ' ' + 'World')",
    type: "multiple_choice",
    difficulty: "easy",
    created_by: "doctor-1",
    created_at: new Date().toISOString(),
    choices: [
      { id: "c1", question_id: "q1", text: "Hello World", is_correct: true },
      { id: "c2", question_id: "q1", text: "HelloWorld", is_correct: false },
      { id: "c3", question_id: "q1", text: "Hello + World", is_correct: false },
      { id: "c4", question_id: "q1", text: "Error", is_correct: false }
    ]
  },
  {
    id: "q2",
    text: "Explain the difference between a list and a tuple in Python.",
    type: "essay",
    difficulty: "medium", 
    created_by: "doctor-1",
    created_at: new Date().toISOString(),
    evaluation_criteria: "Should mention mutability, syntax differences, and use cases"
  },
  {
    id: "q3",
    text: "Which of the following are valid Python data types?",
    type: "multiple_choice",
    difficulty: "easy",
    created_by: "doctor-1", 
    created_at: new Date().toISOString(),
    choices: [
      { id: "c5", question_id: "q3", text: "int", is_correct: true },
      { id: "c6", question_id: "q3", text: "string", is_correct: false },
      { id: "c7", question_id: "q3", text: "str", is_correct: true },
      { id: "c8", question_id: "q3", text: "boolean", is_correct: false },
      { id: "c9", question_id: "q3", text: "bool", is_correct: true }
    ]
  },
  {
    id: "q4",
    text: "What is the time complexity of searching in a balanced binary search tree?",
    type: "multiple_choice",
    difficulty: "medium",
    created_by: "doctor-1",
    created_at: new Date().toISOString(),
    choices: [
      { id: "c10", question_id: "q4", text: "O(1)", is_correct: false },
      { id: "c11", question_id: "q4", text: "O(log n)", is_correct: true },
      { id: "c12", question_id: "q4", text: "O(n)", is_correct: false },
      { id: "c13", question_id: "q4", text: "O(n²)", is_correct: false }
    ]
  },
  {
    id: "q5",
    text: "Implement a function to reverse a linked list. Explain your approach.",
    type: "essay",
    difficulty: "hard",
    created_by: "doctor-1",
    created_at: new Date().toISOString(),
    evaluation_criteria: "Should include code implementation and explanation of the algorithm"
  }
];

// Local storage keys
export const STORAGE_KEYS = {
  EXAMS: 'mock_exams',
  QUESTIONS: 'mock_questions',
  EXAM_ANSWERS: 'exam_answers_',
  EXAM_RESULTS: 'exam_results'
};

// Helper functions for local storage
export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Initialize mock data in localStorage if not present
export const initializeMockData = () => {
  if (!getFromStorage(STORAGE_KEYS.EXAMS)) {
    saveToStorage(STORAGE_KEYS.EXAMS, mockExams);
  }
  if (!getFromStorage(STORAGE_KEYS.QUESTIONS)) {
    saveToStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
  }
};
