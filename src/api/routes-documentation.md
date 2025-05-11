
# Laravel API Routes Documentation

This document provides detailed information about the API routes used in the frontend application, including request parameters and expected responses.

## Authentication Routes

### Login
- **Method:** POST
- **Route:** `/login`
- **Description:** Authenticate a user and get a token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "student|doctor|admin",
      "gender": "male|female|other"
    }
  }
  ```

### Register
- **Method:** POST
- **Route:** `/register`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "student|doctor|admin",
    "gender": "male|female|other"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "student|doctor|admin",
      "gender": "male|female|other"
    }
  }
  ```

### Logout
- **Method:** POST
- **Route:** `/logout`
- **Description:** Log out the authenticated user
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

### Forgot Password
- **Method:** POST
- **Route:** `/forgot-password`
- **Description:** Request a password reset
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset link sent to your email"
  }
  ```

### Reset Password
- **Method:** POST
- **Route:** `/reset-password`
- **Description:** Reset a password
- **Request Body:**
  ```json
  {
    "token": "reset_token",
    "email": "user@example.com",
    "password": "new_password",
    "password_confirmation": "new_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

### Get Current User
- **Method:** GET
- **Route:** `/user`
- **Description:** Get the currently authenticated user
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "id": "uuid",
    "name": "User Name", 
    "email": "user@example.com",
    "role": "student|doctor|admin",
    "gender": "male|female|other"
  }
  ```

## Student Routes

### Get Student Courses
- **Method:** GET
- **Route:** `/courses`
- **Description:** Get all courses the student is enrolled in
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Course Name",
        "code": "CS101",
        "description": "Course description",
        "doctors": [
          {
            "id": "uuid",
            "name": "Doctor Name"
          }
        ],
        "exam_count": 3
      }
    ]
  }
  ```

### Get Upcoming Exams
- **Method:** GET
- **Route:** `/exams/upcoming`
- **Description:** Get upcoming exams for the student
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Exam Name",
        "course_id": "uuid",
        "exam_date": "2025-06-15T10:00:00Z",
        "duration": "120",
        "instructions": "Exam instructions",
        "status": "published",
        "course": {
          "name": "Course Name",
          "code": "CS101"
        }
      }
    ]
  }
  ```

### Get Available Exams
- **Method:** GET
- **Route:** `/exams/available`
- **Description:** Get available exams for the student
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Exam Name",
        "course_id": "uuid",
        "exam_date": "2025-06-15T10:00:00Z",
        "duration": "120",
        "instructions": "Exam instructions",
        "status": "published",
        "course": {
          "name": "Course Name",
          "code": "CS101"
        }
      }
    ]
  }
  ```

### Get Exam Details
- **Method:** GET
- **Route:** `/exams/{id}`
- **Description:** Get details of a specific exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "Exam Name",
      "course_id": "uuid",
      "exam_date": "2025-06-15T10:00:00Z",
      "duration": "120",
      "instructions": "Exam instructions",
      "status": "published",
      "questions": [
        {
          "id": "uuid",
          "text": "Question text",
          "type": "mcq|written",
          "choices": [
            {
              "id": "uuid",
              "text": "Choice text"
            }
          ]
        }
      ]
    }
  }
  ```

### Start Exam
- **Method:** POST
- **Route:** `/exams/{id}/start`
- **Description:** Start an exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": {
      "student_exam_id": "uuid",
      "start_time": "2025-06-15T10:00:00Z",
      "end_time": "2025-06-15T12:00:00Z"
    }
  }
  ```

### Submit Answer
- **Method:** POST
- **Route:** `/exams/{examId}/questions/{questionId}/answer`
- **Description:** Submit an answer for a question
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "answer": "Answer text or choice ID",
    "student_exam_id": "uuid"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Answer submitted successfully"
  }
  ```

### Submit Exam
- **Method:** POST
- **Route:** `/exams/{id}/submit`
- **Description:** Submit a completed exam
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "student_exam_id": "uuid"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Exam submitted successfully"
  }
  ```

### Get Student Results
- **Method:** GET
- **Route:** `/results`
- **Description:** Get all exam results for the student
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "exam_id": "uuid",
        "exam_name": "Exam Name",
        "course_name": "Course Name",
        "score": 85,
        "status": "completed|graded",
        "submitted_at": "2025-06-15T11:45:00Z"
      }
    ]
  }
  ```

### Get Specific Exam Results
- **Method:** GET
- **Route:** `/results/{examId}`
- **Description:** Get results for a specific exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": {
      "exam_id": "uuid",
      "exam_name": "Exam Name",
      "course_name": "Course Name",
      "score": 85,
      "submitted_at": "2025-06-15T11:45:00Z",
      "answers": [
        {
          "question_text": "Question text",
          "answer": "Student answer",
          "correct_answer": "Correct answer",
          "score": 10,
          "feedback": "Feedback on answer"
        }
      ]
    }
  }
  ```

## Doctor Routes

### Get Doctor Courses
- **Method:** GET
- **Route:** `/doctor/courses`
- **Description:** Get all courses assigned to the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Course Name",
        "code": "CS101",
        "student_count": 45
      }
    ]
  }
  ```

### Get Course Students
- **Method:** GET
- **Route:** `/courses/{id}/students`
- **Description:** Get all students enrolled in a specific course
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Student Name",
        "email": "student@example.com"
      }
    ]
  }
  ```

### Get Doctor Questions
- **Method:** GET
- **Route:** `/doctor/questions`
- **Description:** Get all questions created by the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "text": "Question text",
        "type": "mcq|written",
        "chapter": "Chapter name",
        "difficulty": "easy|medium|hard",
        "created_by": "uuid",
        "evaluation_criteria": "Criteria for grading"
      }
    ]
  }
  ```

### Create Question
- **Method:** POST
- **Route:** `/doctor/questions`
- **Description:** Create a new question
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "text": "Question text",
    "type": "mcq|written",
    "chapter": "Chapter name",
    "difficulty": "easy|medium|hard",
    "created_by": "uuid",
    "evaluation_criteria": "Criteria for grading"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "text": "Question text",
      "type": "mcq|written",
      "chapter": "Chapter name",
      "difficulty": "easy|medium|hard",
      "created_by": "uuid",
      "evaluation_criteria": "Criteria for grading"
    }
  }
  ```

### Update Question
- **Method:** PUT
- **Route:** `/doctor/questions/{id}`
- **Description:** Update a question
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "text": "Updated question text",
    "type": "mcq|written",
    "chapter": "Updated chapter name",
    "difficulty": "easy|medium|hard",
    "evaluation_criteria": "Updated criteria for grading"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "text": "Updated question text",
      "type": "mcq|written",
      "chapter": "Updated chapter name",
      "difficulty": "easy|medium|hard",
      "created_by": "uuid",
      "evaluation_criteria": "Updated criteria for grading"
    }
  }
  ```

### Delete Question
- **Method:** DELETE
- **Route:** `/doctor/questions/{id}`
- **Description:** Delete a question
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Question deleted successfully"
  }
  ```

### Get Question Choices
- **Method:** GET
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Get all choices for a question
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "question_id": "uuid",
        "text": "Choice text",
        "is_correct": true
      }
    ]
  }
  ```

### Create Choice
- **Method:** POST
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Create a new choice for a question
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "text": "Choice text",
    "is_correct": true
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "question_id": "uuid",
      "text": "Choice text",
      "is_correct": true
    }
  }
  ```

### Update Choice
- **Method:** PUT
- **Route:** `/doctor/choices/{id}`
- **Description:** Update a choice
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "text": "Updated choice text",
    "is_correct": false
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "question_id": "uuid",
      "text": "Updated choice text",
      "is_correct": false
    }
  }
  ```

### Delete Choice
- **Method:** DELETE
- **Route:** `/doctor/choices/{id}`
- **Description:** Delete a choice
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Choice deleted successfully"
  }
  ```

### Get Doctor Exams
- **Method:** GET
- **Route:** `/doctor/exams`
- **Description:** Get all exams created by the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Exam Name",
        "course_id": "uuid",
        "exam_date": "2025-06-15T10:00:00Z",
        "duration": "120",
        "instructions": "Exam instructions",
        "status": "draft|published|archived",
        "created_by": "uuid",
        "course": {
          "name": "Course Name",
          "code": "CS101"
        },
        "needs_grading": false
      }
    ]
  }
  ```

### Create Exam
- **Method:** POST
- **Route:** `/doctor/exams`
- **Description:** Create a new exam
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "name": "Exam Name",
    "course_id": "uuid",
    "exam_date": "2025-06-15T10:00:00Z",
    "duration": "120",
    "instructions": "Exam instructions",
    "status": "draft|published|archived",
    "created_by": "uuid"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "Exam Name",
      "course_id": "uuid",
      "exam_date": "2025-06-15T10:00:00Z",
      "duration": "120",
      "instructions": "Exam instructions",
      "status": "draft|published|archived",
      "created_by": "uuid"
    }
  }
  ```

### Update Exam
- **Method:** PUT
- **Route:** `/doctor/exams/{id}`
- **Description:** Update an exam
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "name": "Updated Exam Name",
    "course_id": "uuid",
    "exam_date": "2025-06-15T10:00:00Z",
    "duration": "120",
    "instructions": "Updated exam instructions",
    "status": "draft|published|archived"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "Updated Exam Name",
      "course_id": "uuid",
      "exam_date": "2025-06-15T10:00:00Z",
      "duration": "120",
      "instructions": "Updated exam instructions",
      "status": "draft|published|archived",
      "created_by": "uuid"
    }
  }
  ```

### Delete Exam
- **Method:** DELETE
- **Route:** `/doctor/exams/{id}`
- **Description:** Delete an exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Exam deleted successfully"
  }
  ```

### Get Exam Questions
- **Method:** GET
- **Route:** `/doctor/exams/{id}/questions`
- **Description:** Get all questions for an exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "exam_id": "uuid",
        "question_id": "uuid",
        "weight": 1,
        "question": {
          "id": "uuid",
          "text": "Question text",
          "type": "mcq|written"
        }
      }
    ]
  }
  ```

### Add Question to Exam
- **Method:** POST
- **Route:** `/doctor/exams/{examId}/questions`
- **Description:** Add a question to an exam
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "question_id": "uuid",
    "weight": 1
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "exam_id": "uuid",
      "question_id": "uuid",
      "weight": 1
    }
  }
  ```

### Remove Question from Exam
- **Method:** DELETE
- **Route:** `/doctor/exam-questions/{id}`
- **Description:** Remove a question from an exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Question removed from exam successfully"
  }
  ```

### Get Exam Results
- **Method:** GET
- **Route:** `/exams/{id}/results`
- **Description:** Get all results for a specific exam
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": [
      {
        "student_id": "uuid",
        "student_name": "Student Name",
        "score": 85,
        "submitted_at": "2025-06-15T11:45:00Z",
        "graded": true
      }
    ]
  }
  ```

### Grade Written Answer
- **Method:** POST
- **Route:** `/answers/{id}/grade`
- **Description:** Grade a specific answer
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "score": 8,
    "feedback": "Good answer but missed some key points"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Answer graded successfully"
  }
  ```

### Assign Final Grade
- **Method:** POST
- **Route:** `/exams/{examId}/student/{studentId}/grade`
- **Description:** Assign a final grade to a student's exam
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "score": 85,
    "feedback": "Overall excellent work"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Final grade assigned successfully"
  }
  ```

## Admin Routes

### Get Dashboard Stats
- **Method:** GET
- **Route:** `/admin/stats`
- **Description:** Get system statistics
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "data": {
      "users": {
        "total": 500,
        "admins": 5,
        "doctors": 45,
        "students": 450
      },
      "courses": {
        "total": 30
      },
      "majors": {
        "total": 8
      },
      "exams": {
        "total": 120,
        "published": 90,
        "draft": 30
      }
    }
  }
  ```

### Get All Users
- **Method:** GET
- **Route:** `/admin/users`
- **Description:** Get all users
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** role=admin|doctor|student (optional), page=1, limit=20
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "User Name",
        "email": "user@example.com",
        "role": "admin|doctor|student",
        "gender": "male|female|other",
        "created_at": "2025-01-15T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 20,
      "total": 100
    }
  }
  ```

### Create User
- **Method:** POST
- **Route:** `/admin/users`
- **Description:** Create a new user
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "admin|doctor|student",
    "gender": "male|female|other"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin|doctor|student",
      "gender": "male|female|other"
    }
  }
  ```

### Update User
- **Method:** PUT
- **Route:** `/admin/users/{id}`
- **Description:** Update a user
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "name": "Updated User Name",
    "email": "updated@example.com",
    "role": "admin|doctor|student",
    "gender": "male|female|other"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "Updated User Name",
      "email": "updated@example.com",
      "role": "admin|doctor|student",
      "gender": "male|female|other"
    }
  }
  ```

### Delete User
- **Method:** DELETE
- **Route:** `/admin/users/{id}`
- **Description:** Delete a user
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

### Get All Courses
- **Method:** GET
- **Route:** `/admin/courses`
- **Description:** Get all courses
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** page=1, limit=20
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Course Name",
        "code": "CS101",
        "student_count": 45,
        "doctor_count": 2
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 20,
      "total": 100
    }
  }
  ```

### Create Course
- **Method:** POST
- **Route:** `/admin/courses`
- **Description:** Create a new course
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "name": "Course Name",
    "code": "CS101",
    "description": "Course description"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "Course Name",
      "code": "CS101",
      "description": "Course description"
    }
  }
  ```

### Update Course
- **Method:** PUT
- **Route:** `/admin/courses/{id}`
- **Description:** Update a course
- **Headers:** Authorization: Bearer {token}
- **Request Body:**
  ```json
  {
    "name": "Updated Course Name",
    "code": "CS102",
    "description": "Updated course description"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "name": "Updated Course Name",
      "code": "CS102",
      "description": "Updated course description"
    }
  }
  ```

### Delete Course
- **Method:** DELETE
- **Route:** `/admin/courses/{id}`
- **Description:** Delete a course
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Course deleted successfully"
  }
  ```

### Assign Doctor to Course
- **Method:** POST
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Assign a doctor to a course
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Doctor assigned to course successfully"
  }
  ```

### Remove Doctor from Course
- **Method:** DELETE
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Remove a doctor from a course
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Doctor removed from course successfully"
  }
  ```

### Enroll Student in Course
- **Method:** POST
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Enroll a student in a course
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Student enrolled in course successfully"
  }
  ```

### Remove Student from Course
- **Method:** DELETE
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Remove a student from a course
- **Headers:** Authorization: Bearer {token}
- **Response:**
  ```json
  {
    "success": true,
    "message": "Student removed from course successfully"
  }
  ```
