
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
  },
  {
    id: "q-4",
    text: "Define database normalization and explain the first three normal forms.",
    type: "written",
    difficulty: "medium",
    chapter: "Database Design",
    evaluation_criteria: "Must define normalization and accurately describe 1NF, 2NF, and 3NF",
    created_by: "doctor-3",
    created_at: "2024-01-17T11:00:00Z",
    updated_at: "2024-01-17T11:00:00Z"
  },
  {
    id: "q-5",
    text: "Which of the following is NOT a principle of object-oriented programming?",
    type: "mcq",
    difficulty: "easy",
    chapter: "OOP Concepts",
    created_by: "doctor-1",
    created_at: "2024-01-18T14:00:00Z",
    updated_at: "2024-01-18T14:00:00Z"
  },
  {
    id: "q-6",
    text: "Implement a function to reverse a linked list in Python.",
    type: "written",
    difficulty: "hard",
    chapter: "Linked Lists",
    evaluation_criteria: "Must provide working code with proper explanation",
    created_by: "doctor-2",
    created_at: "2024-01-19T09:30:00Z",
    updated_at: "2024-01-19T09:30:00Z"
  },
  {
    id: "q-7",
    text: "What is the difference between supervised and unsupervised learning?",
    type: "mcq",
    difficulty: "medium",
    chapter: "Machine Learning Basics",
    created_by: "doctor-4",
    created_at: "2024-01-20T13:15:00Z",
    updated_at: "2024-01-20T13:15:00Z"
  },
  {
    id: "q-8",
    text: "Describe the OSI model and its seven layers.",
    type: "written",
    difficulty: "medium",
    chapter: "Network Fundamentals",
    evaluation_criteria: "Must list all seven layers and explain their functions",
    created_by: "doctor-5",
    created_at: "2024-01-21T10:45:00Z",
    updated_at: "2024-01-21T10:45:00Z"
  },
  {
    id: "q-9",
    text: "Which HTML tag is used to create a hyperlink?",
    type: "mcq",
    difficulty: "easy",
    chapter: "HTML Basics",
    created_by: "doctor-1",
    created_at: "2024-01-22T16:20:00Z",
    updated_at: "2024-01-22T16:20:00Z"
  },
  {
    id: "q-10",
    text: "Explain the concept of computer vision and its applications.",
    type: "written",
    difficulty: "medium",
    chapter: "Computer Vision Introduction",
    evaluation_criteria: "Must define computer vision and provide at least 3 real-world applications",
    created_by: "doctor-6",
    created_at: "2024-01-23T12:00:00Z",
    updated_at: "2024-01-23T12:00:00Z"
  }
];

export const dummyChoices: Choice[] = [
  // Choices for q-1 (Python concatenation)
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
    id: "c-1-4",
    question_id: "q-1",
    text: "None",
    is_correct: false
  },

  // Choices for q-3 (Binary search tree complexity)
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
  },
  {
    id: "c-3-4",
    question_id: "q-3",
    text: "O(n²)",
    is_correct: false
  },

  // Choices for q-5 (OOP principles)
  {
    id: "c-5-1",
    question_id: "q-5",
    text: "Encapsulation",
    is_correct: false
  },
  {
    id: "c-5-2",
    question_id: "q-5",
    text: "Inheritance",
    is_correct: false
  },
  {
    id: "c-5-3",
    question_id: "q-5",
    text: "Polymorphism",
    is_correct: false
  },
  {
    id: "c-5-4",
    question_id: "q-5",
    text: "Compilation",
    is_correct: true
  },

  // Choices for q-7 (ML types)
  {
    id: "c-7-1",
    question_id: "q-7",
    text: "Supervised learning uses labeled data, unsupervised uses unlabeled data",
    is_correct: true
  },
  {
    id: "c-7-2",
    question_id: "q-7",
    text: "Supervised learning is faster than unsupervised learning",
    is_correct: false
  },
  {
    id: "c-7-3",
    question_id: "q-7",
    text: "Unsupervised learning always gives better results",
    is_correct: false
  },
  {
    id: "c-7-4",
    question_id: "q-7",
    text: "There is no significant difference between them",
    is_correct: false
  },

  // Choices for q-9 (HTML hyperlink)
  {
    id: "c-9-1",
    question_id: "q-9",
    text: "<link>",
    is_correct: false
  },
  {
    id: "c-9-2",
    question_id: "q-9",
    text: "<a>",
    is_correct: true
  },
  {
    id: "c-9-3",
    question_id: "q-9",
    text: "<href>",
    is_correct: false
  },
  {
    id: "c-9-4",
    question_id: "q-9",
    text: "<url>",
    is_correct: false
  }
];
