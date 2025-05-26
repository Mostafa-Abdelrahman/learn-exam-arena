
# Comprehensive Laravel API Routes Documentation

This document provides detailed information about all API routes including request parameters, response data structures, and examples.

## Authentication Routes

### Login
- **Method:** POST
- **Route:** `/login`
- **Description:** Authenticate a user and get a token
- **Request Headers:**
  ```
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "email": "student@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "student@example.com",
      "role": "student",
      "gender": "male",
      "major_id": "550e8400-e29b-41d4-a716-446655440001",
      "major": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Computer Science"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
  ```
- **Error Response (401):**
  ```json
  {
    "message": "Invalid credentials"
  }
  ```
- **Error Response (422):**
  ```json
  {
    "message": "Validation failed",
    "errors": {
      "email": ["The email field is required."],
      "password": ["The password field is required."]
    }
  }
  ```

### Register
- **Method:** POST
- **Route:** `/register`
- **Description:** Register a new user
- **Request Headers:**
  ```
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "student",
    "gender": "female",
    "major_id": "550e8400-e29b-41d4-a716-446655440001"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "student",
      "gender": "female",
      "major_id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2024-01-15T11:00:00Z",
      "updated_at": "2024-01-15T11:00:00Z"
    }
  }
  ```

### Logout
- **Method:** POST
- **Route:** `/logout`
- **Description:** Log out the authenticated user
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

### Get Current User
- **Method:** GET
- **Route:** `/user`
- **Description:** Get the currently authenticated user
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "student@example.com",
    "role": "student",
    "gender": "male",
    "major_id": "550e8400-e29b-41d4-a716-446655440001",
    "major": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Computer Science"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
  ```

### Update Profile
- **Method:** PUT
- **Route:** `/user/profile`
- **Description:** Update user profile
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "John Updated Doe",
    "gender": "male"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Profile updated successfully",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Updated Doe",
      "email": "student@example.com",
      "role": "student",
      "gender": "male",
      "major_id": "550e8400-e29b-41d4-a716-446655440001",
      "updated_at": "2024-01-15T12:00:00Z"
    }
  }
  ```

### Change Password
- **Method:** PUT
- **Route:** `/user/password`
- **Description:** Change user password
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "current_password": "oldpassword123",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

### Forgot Password
- **Method:** POST
- **Route:** `/forgot-password`
- **Description:** Send password reset email
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Password reset link sent to your email"
  }
  ```

### Reset Password
- **Method:** POST
- **Route:** `/reset-password`
- **Description:** Reset password with token
- **Request Body:**
  ```json
  {
    "token": "reset_token_string",
    "email": "user@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

## Student Routes

### Get Student Courses
- **Method:** GET
- **Route:** `/courses`
- **Description:** Get all courses the student is enrolled in
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Introduction to Programming",
        "code": "CS101",
        "description": "Basic programming concepts",
        "credits": 3,
        "semester": "Fall 2024",
        "major_id": "550e8400-e29b-41d4-a716-446655440001",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z",
        "doctors": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440020",
            "name": "Dr. Smith",
            "email": "dr.smith@university.edu"
          }
        ],
        "enrollment": {
          "enrolled_at": "2024-01-15T10:00:00Z",
          "status": "active"
        }
      }
    ]
  }
  ```

### Get Student Stats
- **Method:** GET
- **Route:** `/student/stats`
- **Description:** Get student dashboard statistics
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "total_courses": 5,
      "total_exams": 12,
      "upcoming_exams": 3,
      "completed_exams": 9,
      "average_grade": 85.5,
      "total_credits": 18,
      "gpa": 3.7,
      "recent_activity": [
        {
          "type": "exam_completed",
          "exam_name": "Midterm Exam",
          "course_name": "Data Structures",
          "date": "2024-01-14T14:00:00Z",
          "grade": 88
        }
      ]
    }
  }
  ```

### Enroll in Course
- **Method:** POST
- **Route:** `/students/{studentId}/courses`
- **Description:** Enroll student in a course
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "course_id": "550e8400-e29b-41d4-a716-446655440010"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Successfully enrolled in course",
    "enrollment": {
      "student_id": "550e8400-e29b-41d4-a716-446655440000",
      "course_id": "550e8400-e29b-41d4-a716-446655440010",
      "enrolled_at": "2024-01-15T12:00:00Z",
      "status": "active"
    }
  }
  ```

### Get Student Grades
- **Method:** GET
- **Route:** `/students/{studentId}/grades`
- **Description:** Get all grades for a student
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "student_id": "550e8400-e29b-41d4-a716-446655440000",
        "exam_id": "550e8400-e29b-41d4-a716-446655440040",
        "grade": 88.5,
        "feedback": "Good work, but could improve on problem-solving approach",
        "graded_at": "2024-01-15T16:00:00Z",
        "exam": {
          "id": "550e8400-e29b-41d4-a716-446655440040",
          "name": "Midterm Exam",
          "course": {
            "name": "Data Structures",
            "code": "CS201"
          }
        }
      }
    ]
  }
  ```

## Exam Routes

### Get Available Exams
- **Method:** GET
- **Route:** `/exams/available`
- **Description:** Get available exams for the student
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "name": "Final Exam",
        "course_id": "550e8400-e29b-41d4-a716-446655440010",
        "exam_date": "2024-01-20T10:00:00Z",
        "duration": "120",
        "instructions": "This is a comprehensive exam covering all topics",
        "status": "published",
        "created_by": "550e8400-e29b-41d4-a716-446655440020",
        "needs_grading": false,
        "course": {
          "name": "Introduction to Programming",
          "code": "CS101"
        },
        "questions_count": 25,
        "total_marks": 100
      }
    ]
  }
  ```

### Get Upcoming Exams
- **Method:** GET
- **Route:** `/exams/upcoming`
- **Description:** Get upcoming exams for the student
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Query Parameters:**
  - `limit` (optional): Number of exams to return (default: 10)
  - `days` (optional): Number of days ahead to look (default: 30)
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440041",
        "name": "Quiz 3",
        "course_id": "550e8400-e29b-41d4-a716-446655440010",
        "exam_date": "2024-01-18T14:00:00Z",
        "duration": "60",
        "status": "published",
        "course": {
          "name": "Introduction to Programming",
          "code": "CS101"
        },
        "time_until_exam": "2 days"
      }
    ]
  }
  ```

### Get Course Exams
- **Method:** GET
- **Route:** `/courses/{courseId}/exams`
- **Description:** Get all exams for a specific course
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "name": "Final Exam",
        "exam_date": "2024-01-20T10:00:00Z",
        "duration": "120",
        "status": "published",
        "student_status": "not_started",
        "attempts_allowed": 1,
        "attempts_used": 0
      }
    ]
  }
  ```

### Get Exam Details
- **Method:** GET
- **Route:** `/exams/{id}`
- **Description:** Get details of a specific exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440040",
      "name": "Final Exam",
      "course_id": "550e8400-e29b-41d4-a716-446655440010",
      "exam_date": "2024-01-20T10:00:00Z",
      "duration": "120",
      "instructions": "Read all questions carefully. Show your work.",
      "status": "published",
      "created_by": "550e8400-e29b-41d4-a716-446655440020",
      "course": {
        "name": "Introduction to Programming",
        "code": "CS101"
      },
      "questions": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440050",
          "exam_question_id": "550e8400-e29b-41d4-a716-446655440051",
          "question_id": "550e8400-e29b-41d4-a716-446655440052",
          "text": "What is the difference between a stack and a queue?",
          "question_text": "What is the difference between a stack and a queue?",
          "type": "written",
          "question_type": "written",
          "weight": 10,
          "difficulty_level": "medium"
        }
      ]
    }
  }
  ```

### Get Exam Questions
- **Method:** GET
- **Route:** `/exams/{id}/questions`
- **Description:** Get all questions for an exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440050",
        "exam_question_id": "550e8400-e29b-41d4-a716-446655440051",
        "question_id": "550e8400-e29b-41d4-a716-446655440052",
        "text": "What is polymorphism in OOP?",
        "question_text": "What is polymorphism in OOP?",
        "type": "mcq",
        "question_type": "multiple-choice",
        "weight": 5,
        "difficulty_level": "medium",
        "choices": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440060",
            "choice_id": "550e8400-e29b-41d4-a716-446655440060",
            "text": "The ability to have multiple forms",
            "choice_text": "The ability to have multiple forms",
            "is_correct": true
          },
          {
            "id": "550e8400-e29b-41d4-a716-446655440061",
            "choice_id": "550e8400-e29b-41d4-a716-446655440061",
            "text": "The ability to inherit properties",
            "choice_text": "The ability to inherit properties",
            "is_correct": false
          }
        ]
      }
    ]
  }
  ```

### Start Exam
- **Method:** POST
- **Route:** `/exams/{id}/start`
- **Description:** Start an exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "student_exam_id": "550e8400-e29b-41d4-a716-446655440070",
      "started_at": "2024-01-15T14:00:00Z",
      "ends_at": "2024-01-15T16:00:00Z",
      "time_remaining": 7200
    }
  }
  ```

### Submit Answer
- **Method:** POST
- **Route:** `/exams/{examId}/questions/{questionId}/answer`
- **Description:** Submit an answer for a question
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "answer": "550e8400-e29b-41d4-a716-446655440060"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Answer saved successfully",
    "answer": {
      "id": "550e8400-e29b-41d4-a716-446655440080",
      "student_exam_id": "550e8400-e29b-41d4-a716-446655440070",
      "question_id": "550e8400-e29b-41d4-a716-446655440052",
      "answer": "550e8400-e29b-41d4-a716-446655440060",
      "submitted_at": "2024-01-15T14:30:00Z"
    }
  }
  ```

### Submit Exam
- **Method:** POST
- **Route:** `/exams/{id}/submit`
- **Description:** Submit a completed exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "answers": [
      {
        "questionId": "550e8400-e29b-41d4-a716-446655440052",
        "answer": "550e8400-e29b-41d4-a716-446655440060"
      }
    ]
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Exam submitted successfully",
    "submission": {
      "id": "550e8400-e29b-41d4-a716-446655440070",
      "submitted_at": "2024-01-15T15:45:00Z",
      "auto_grade": 85.5,
      "status": "submitted"
    }
  }
  ```

### Get Student Results
- **Method:** GET
- **Route:** `/results`
- **Description:** Get all exam results for the student
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440070",
        "exam_id": "550e8400-e29b-41d4-a716-446655440040",
        "student_id": "550e8400-e29b-41d4-a716-446655440000",
        "score": 88.5,
        "max_score": 100,
        "percentage": 88.5,
        "status": "graded",
        "submitted_at": "2024-01-15T15:45:00Z",
        "graded_at": "2024-01-16T10:00:00Z",
        "exam": {
          "name": "Final Exam",
          "course": {
            "name": "Introduction to Programming",
            "code": "CS101"
          }
        }
      }
    ]
  }
  ```

## Doctor Routes

### Get Doctor Courses
- **Method:** GET
- **Route:** `/doctor/courses`
- **Description:** Get all courses assigned to the doctor
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Query Parameters:**
  - `doctor_id` (optional): Filter by specific doctor ID
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Introduction to Programming",
        "code": "CS101",
        "description": "Basic programming concepts",
        "credits": 3,
        "semester": "Fall 2024",
        "students_count": 45,
        "exams_count": 4,
        "assignment": {
          "assigned_at": "2024-01-01T00:00:00Z",
          "role": "instructor"
        }
      }
    ]
  }
  ```

### Get Doctor Stats
- **Method:** GET
- **Route:** `/doctor/stats`
- **Description:** Get doctor dashboard statistics
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "total_courses": 3,
      "total_students": 120,
      "total_exams": 12,
      "pending_grading": 25,
      "total_questions": 156,
      "recent_submissions": 8,
      "courses_breakdown": [
        {
          "course_name": "CS101",
          "students": 45,
          "exams": 4,
          "pending_grades": 8
        }
      ]
    }
  }
  ```

### Get Course Students
- **Method:** GET
- **Route:** `/courses/{id}/students`
- **Description:** Get all students enrolled in a specific course
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "student@example.com",
        "major": {
          "name": "Computer Science"
        },
        "enrollment": {
          "enrolled_at": "2024-01-15T10:00:00Z",
          "status": "active"
        },
        "grades": {
          "average": 85.5,
          "exam_count": 3
        }
      }
    ]
  }
  ```

### Get Course Doctors
- **Method:** GET
- **Route:** `/courses/{id}/doctors`
- **Description:** Get all doctors assigned to a specific course
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "name": "Dr. Smith",
        "email": "dr.smith@university.edu",
        "assignment": {
          "assigned_at": "2024-01-01T00:00:00Z",
          "role": "instructor"
        }
      }
    ]
  }
  ```

## Question Management Routes

### Get Doctor Questions
- **Method:** GET
- **Route:** `/doctor/questions`
- **Description:** Get all questions created by the doctor
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Query Parameters:**
  - `doctor_id` (optional): Filter by specific doctor ID
  - `type` (optional): Filter by question type (mcq, written)
  - `difficulty` (optional): Filter by difficulty (easy, medium, hard)
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440052",
        "question_id": "550e8400-e29b-41d4-a716-446655440052",
        "text": "What is polymorphism in OOP?",
        "question_text": "What is polymorphism in OOP?",
        "type": "mcq",
        "question_type": "multiple-choice",
        "chapter": "Object-Oriented Programming",
        "difficulty": "medium",
        "difficulty_level": "medium",
        "created_by": "550e8400-e29b-41d4-a716-446655440020",
        "evaluation_criteria": "Understanding of OOP concepts",
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-10T00:00:00Z",
        "choices": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440060",
            "choice_id": "550e8400-e29b-41d4-a716-446655440060",
            "question_id": "550e8400-e29b-41d4-a716-446655440052",
            "text": "The ability to have multiple forms",
            "choice_text": "The ability to have multiple forms",
            "is_correct": true
          }
        ]
      }
    ]
  }
  ```

### Create Question
- **Method:** POST
- **Route:** `/doctor/questions`
- **Description:** Create a new question
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "text": "What is inheritance in OOP?",
    "type": "mcq",
    "chapter": "Object-Oriented Programming",
    "difficulty": "easy",
    "evaluation_criteria": "Basic understanding of inheritance concept"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440053",
      "text": "What is inheritance in OOP?",
      "type": "mcq",
      "chapter": "Object-Oriented Programming",
      "difficulty": "easy",
      "created_by": "550e8400-e29b-41d4-a716-446655440020",
      "evaluation_criteria": "Basic understanding of inheritance concept",
      "created_at": "2024-01-15T12:00:00Z",
      "updated_at": "2024-01-15T12:00:00Z"
    }
  }
  ```

### Update Question
- **Method:** PUT
- **Route:** `/doctor/questions/{id}`
- **Description:** Update a question
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "text": "Updated question text",
    "difficulty": "medium"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440053",
      "text": "Updated question text",
      "difficulty": "medium",
      "updated_at": "2024-01-15T13:00:00Z"
    }
  }
  ```

### Delete Question
- **Method:** DELETE
- **Route:** `/doctor/questions/{id}`
- **Description:** Delete a question
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Question deleted successfully"
  }
  ```

### Get Question Choices
- **Method:** GET
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Get all choices for a question
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440060",
        "choice_id": "550e8400-e29b-41d4-a716-446655440060",
        "question_id": "550e8400-e29b-41d4-a716-446655440052",
        "text": "The ability to have multiple forms",
        "choice_text": "The ability to have multiple forms",
        "is_correct": true
      }
    ]
  }
  ```

### Create Choice
- **Method:** POST
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Create a new choice for a question
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "text": "New choice text",
    "is_correct": false
  }
  ```
- **Success Response (201):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440062",
      "question_id": "550e8400-e29b-41d4-a716-446655440052",
      "text": "New choice text",
      "is_correct": false
    }
  }
  ```

### Update Choice
- **Method:** PUT
- **Route:** `/doctor/choices/{id}`
- **Description:** Update a choice
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "text": "Updated choice text",
    "is_correct": true
  }
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440062",
      "text": "Updated choice text",
      "is_correct": true,
      "updated_at": "2024-01-15T13:30:00Z"
    }
  }
  ```

### Delete Choice
- **Method:** DELETE
- **Route:** `/doctor/choices/{id}`
- **Description:** Delete a choice
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Choice deleted successfully"
  }
  ```

## Exam Management Routes (Doctor)

### Get Doctor Exams
- **Method:** GET
- **Route:** `/doctor/exams`
- **Description:** Get all exams created by the doctor
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Query Parameters:**
  - `doctor_id` (optional): Filter by specific doctor ID
  - `status` (optional): Filter by status (draft, published, archived)
  - `course_id` (optional): Filter by course
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "name": "Final Exam",
        "course_id": "550e8400-e29b-41d4-a716-446655440010",
        "exam_date": "2024-01-20T10:00:00Z",
        "duration": "120",
        "instructions": "Read all questions carefully",
        "status": "published",
        "created_by": "550e8400-e29b-41d4-a716-446655440020",
        "needs_grading": true,
        "course": {
          "name": "Introduction to Programming",
          "code": "CS101"
        },
        "questions_count": 25,
        "submissions_count": 42,
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-10T00:00:00Z"
      }
    ]
  }
  ```

### Create Exam
- **Method:** POST
- **Route:** `/doctor/exams`
- **Description:** Create a new exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Midterm Exam",
    "course_id": "550e8400-e29b-41d4-a716-446655440010",
    "exam_date": "2024-02-15T14:00:00Z",
    "duration": "90",
    "instructions": "Answer all questions. Show your work for partial credit.",
    "status": "draft"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440042",
      "name": "Midterm Exam",
      "course_id": "550e8400-e29b-41d4-a716-446655440010",
      "exam_date": "2024-02-15T14:00:00Z",
      "duration": "90",
      "instructions": "Answer all questions. Show your work for partial credit.",
      "status": "draft",
      "created_by": "550e8400-e29b-41d4-a716-446655440020",
      "needs_grading": false,
      "created_at": "2024-01-15T14:00:00Z",
      "updated_at": "2024-01-15T14:00:00Z"
    }
  }
  ```

### Update Exam
- **Method:** PUT
- **Route:** `/doctor/exams/{id}`
- **Description:** Update an exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Updated Midterm Exam",
    "duration": "120",
    "status": "published"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440042",
      "name": "Updated Midterm Exam",
      "duration": "120",
      "status": "published",
      "updated_at": "2024-01-15T15:00:00Z"
    }
  }
  ```

### Delete Exam
- **Method:** DELETE
- **Route:** `/doctor/exams/{id}`
- **Description:** Delete an exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Exam deleted successfully"
  }
  ```

### Add Question to Exam
- **Method:** POST
- **Route:** `/doctor/exams/{examId}/questions`
- **Description:** Add a question to an exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "question_id": "550e8400-e29b-41d4-a716-446655440052",
    "weight": 10
  }
  ```
- **Success Response (201):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440090",
      "exam_id": "550e8400-e29b-41d4-a716-446655440042",
      "question_id": "550e8400-e29b-41d4-a716-446655440052",
      "weight": 10,
      "created_at": "2024-01-15T15:30:00Z"
    }
  }
  ```

### Remove Question from Exam
- **Method:** DELETE
- **Route:** `/doctor/exam-questions/{id}`
- **Description:** Remove a question from an exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Question removed from exam successfully"
  }
  ```

## Grading Routes

### Get Exam Submissions
- **Method:** GET
- **Route:** `/exams/{id}/submissions`
- **Description:** Get all submissions for a specific exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Query Parameters:**
  - `status` (optional): Filter by grading status (graded, ungraded)
  - `student_id` (optional): Filter by specific student
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "student_exam_answer_id": "550e8400-e29b-41d4-a716-446655440080",
        "student_id": "550e8400-e29b-41d4-a716-446655440000",
        "student_name": "John Doe",
        "exam_question_id": "550e8400-e29b-41d4-a716-446655440090",
        "written_answer": "Inheritance allows a class to inherit properties and methods from another class.",
        "question_text": "What is inheritance in OOP?",
        "question_type": "written",
        "submitted_at": "2024-01-15T15:45:00Z",
        "grade": null,
        "feedback": null,
        "graded_at": null
      }
    ]
  }
  ```

### Grade Answer
- **Method:** POST
- **Route:** `/answers/{id}/grade`
- **Description:** Grade a specific answer
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "score": 8.5,
    "feedback": "Good understanding but could be more detailed"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Answer graded successfully",
    "grade": {
      "id": "550e8400-e29b-41d4-a716-446655440080",
      "score": 8.5,
      "feedback": "Good understanding but could be more detailed",
      "graded_by": "550e8400-e29b-41d4-a716-446655440020",
      "graded_at": "2024-01-16T10:00:00Z"
    }
  }
  ```

### Assign Final Grade
- **Method:** POST
- **Route:** `/exams/{examId}/student/{studentId}/grade`
- **Description:** Assign a final grade to a student's exam
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "score": 85.5,
    "feedback": "Overall good performance. Keep up the good work!"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Final grade assigned successfully",
    "grade": {
      "student_id": "550e8400-e29b-41d4-a716-446655440000",
      "exam_id": "550e8400-e29b-41d4-a716-446655440042",
      "score": 85.5,
      "feedback": "Overall good performance. Keep up the good work!",
      "graded_by": "550e8400-e29b-41d4-a716-446655440020",
      "graded_at": "2024-01-16T11:00:00Z"
    }
  }
  ```

### Submit Grade
- **Method:** POST
- **Route:** `/grades`
- **Description:** Submit a new grade
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "student_id": "550e8400-e29b-41d4-a716-446655440000",
    "exam_id": "550e8400-e29b-41d4-a716-446655440042",
    "grade": 88.5
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Grade submitted successfully",
    "grade": {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "student_id": "550e8400-e29b-41d4-a716-446655440000",
      "exam_id": "550e8400-e29b-41d4-a716-446655440042",
      "grade": 88.5,
      "submitted_at": "2024-01-16T12:00:00Z"
    }
  }
  ```

### Update Grade
- **Method:** PUT
- **Route:** `/grades/{id}`
- **Description:** Update an existing grade
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "grade": 90.0
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Grade updated successfully",
    "grade": {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "grade": 90.0,
      "updated_at": "2024-01-16T13:00:00Z"
    }
  }
  ```

## Admin Routes

### Get Dashboard Stats
- **Method:** GET
- **Route:** `/admin/stats`
- **Description:** Get system statistics
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": {
      "total_users": 1250,
      "total_students": 1000,
      "total_doctors": 200,
      "total_admins": 50,
      "total_courses": 150,
      "total_majors": 25,
      "total_exams": 500,
      "active_exams": 45,
      "system_health": "good",
      "recent_registrations": 25,
      "monthly_stats": {
        "new_users": 120,
        "new_courses": 8,
        "completed_exams": 340
      }
    }
  }
  ```

### User Management - Get All Users
- **Method:** GET
- **Route:** `/admin/users`
- **Description:** Get all users
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Query Parameters:**
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of users per page
  - `role` (optional): Filter by role (student, doctor, admin)
  - `search` (optional): Search by name or email
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "student@example.com",
        "role": "student",
        "gender": "male",
        "major_id": "550e8400-e29b-41d4-a716-446655440001",
        "major": {
          "name": "Computer Science"
        },
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "last_login": "2024-01-15T14:00:00Z",
        "status": "active"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 50,
      "total_count": 1250,
      "per_page": 25
    }
  }
  ```

### User Management - Create User
- **Method:** POST
- **Route:** `/admin/users`
- **Description:** Create a new user
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "doctor",
    "gender": "female",
    "major_id": "550e8400-e29b-41d4-a716-446655440001"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "doctor",
      "gender": "female",
      "major_id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2024-01-15T16:00:00Z",
      "updated_at": "2024-01-15T16:00:00Z"
    }
  }
  ```

### User Management - Update User
- **Method:** PUT
- **Route:** `/admin/users/{id}`
- **Description:** Update a user
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Jane Updated Smith",
    "role": "admin"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "User updated successfully"
  }
  ```

### User Management - Delete User
- **Method:** DELETE
- **Route:** `/admin/users/{id}`
- **Description:** Delete a user
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

### Major Management - Get All Majors
- **Method:** GET
- **Route:** `/majors`
- **Description:** Get all majors
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "major_id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Computer Science",
        "major_name": "Computer Science",
        "description": "Study of computational systems and design",
        "student_count": 450,
        "doctor_count": 25,
        "course_count": 35,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```

### Major Management - Create Major
- **Method:** POST
- **Route:** `/admin/majors`
- **Description:** Create a new major
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Data Science",
    "description": "Study of data analysis and machine learning"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Data Science",
      "description": "Study of data analysis and machine learning",
      "created_at": "2024-01-15T17:00:00Z",
      "updated_at": "2024-01-15T17:00:00Z"
    }
  }
  ```

### Assignment Routes - Assign Doctor to Course
- **Method:** POST
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Assign a doctor to a course
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Doctor assigned to course successfully",
    "assignment": {
      "doctor_id": "550e8400-e29b-41d4-a716-446655440020",
      "course_id": "550e8400-e29b-41d4-a716-446655440010",
      "assigned_at": "2024-01-15T18:00:00Z",
      "role": "instructor"
    }
  }
  ```

### Assignment Routes - Enroll Student in Course
- **Method:** POST
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Enroll a student in a course
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Student enrolled in course successfully",
    "enrollment": {
      "student_id": "550e8400-e29b-41d4-a716-446655440000",
      "course_id": "550e8400-e29b-41d4-a716-446655440010",
      "enrolled_at": "2024-01-15T18:30:00Z",
      "status": "active"
    }
  }
  ```

## Miscellaneous Routes

### Get Question Types
- **Method:** GET
- **Route:** `/question-types`
- **Description:** Get all available question types
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Accept: application/json
  ```
- **Success Response (200):**
  ```json
  {
    "data": [
      {
        "id": "mcq",
        "name": "Multiple Choice Question",
        "description": "Question with predefined choices"
      },
      {
        "id": "written",
        "name": "Written Answer",
        "description": "Question requiring written response"
      }
    ]
  }
  ```

### File Upload
- **Method:** POST
- **Route:** `/upload`
- **Description:** Upload files (images, documents)
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
  ```
- **Request Body (FormData):**
  ```
  file: [File object]
  type: "image" | "document"
  ```
- **Success Response (200):**
  ```json
  {
    "message": "File uploaded successfully",
    "file": {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "filename": "example.jpg",
      "original_name": "my-image.jpg",
      "mime_type": "image/jpeg",
      "size": 1024576,
      "url": "https://example.com/uploads/550e8400-e29b-41d4-a716-446655440200.jpg",
      "uploaded_at": "2024-01-15T19:00:00Z"
    }
  }
  ```

### System Health
- **Method:** GET
- **Route:** `/health`
- **Description:** Check system health status
- **Success Response (200):**
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-15T19:30:00Z",
    "services": {
      "database": "connected",
      "redis": "connected",
      "storage": "accessible"
    },
    "uptime": 86400,
    "version": "1.0.0"
  }
  ```

## Error Responses

### Common Error Codes

#### 400 - Bad Request
```json
{
  "message": "Invalid request data",
  "errors": {
    "field_name": ["Error description"]
  }
}
```

#### 401 - Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

#### 403 - Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

#### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

#### 422 - Unprocessable Entity (Validation Error)
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

#### 429 - Too Many Requests
```json
{
  "message": "Rate limit exceeded",
  "retry_after": 60
}
```

#### 500 - Internal Server Error
```json
{
  "message": "Internal server error",
  "error_id": "550e8400-e29b-41d4-a716-446655440999"
}
```

## Rate Limiting

All API endpoints are subject to rate limiting:
- **Authentication endpoints**: 10 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 20 requests per minute per user

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

## Pagination

Most list endpoints support pagination with these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 25, max: 100)

Paginated responses include metadata:
```json
{
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 250,
    "per_page": 25,
    "has_next": true,
    "has_prev": false
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:
- `sort`: Field to sort by (e.g., `created_at`)
- `order`: Sort direction (`asc` or `desc`)
- `filter[field]`: Filter by field value

Example: `/api/admin/users?sort=created_at&order=desc&filter[role]=student`

