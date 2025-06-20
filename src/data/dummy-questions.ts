import { Question, Choice } from '@/services/doctor.service';

export const dummyQuestions: Question[] = [
  {
    id: "q-1",
    text: "What is the output of print('Hello' + 'World')?",
    type: "mcq",
    difficulty: "easy",
    chapter: "Python Basics",
    created_by: "doctor-1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "q-2",
    text: "Explain the difference between lists and tuples in Python.",
    type: "written",
    difficulty: "medium",
    chapter: "Python Data Structures",
    evaluation_criteria: "Must cover mutability, syntax, and use cases",
    created_by: "doctor-1",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "q-3",
    text: "What is the time complexity of searching in a binary search tree?",
    type: "mcq",
    difficulty: "hard",
    chapter: "Data Structures",
    created_by: "doctor-2",
    created_at: "2024-01-16T09:00:00Z",
    updated_at: "2024-01-16T09:00:00Z"
  }
];

export const dummyChoices: Choice[] = [
  {
    id: "c-1-1",
    question_id: "q-1",
    text: "HelloWorld",
    is_correct: true
  },
  {
    id: "c-1-2",
    question_id: "q-1",
    text: "Hello World",
    is_correct: false
  },
  {
    id: "c-1-3",
    question_id: "q-1",
    text: "Error",
    is_correct: false
  },
  {
    id: "c-3-1",
    question_id: "q-3",
    text: "O(n)",
    is_correct: false
  },
  {
    id: "c-3-2",
    question_id: "q-3",
    text: "O(log n)",
    is_correct: true
  },
  {
    id: "c-3-3",
    question_id: "q-3",
    text: "O(1)",
    is_correct: false
  }
]; 