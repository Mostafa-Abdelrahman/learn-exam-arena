
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
      "gender": "male|female|other",
      "major_id": "uuid"
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
    "gender": "male|female|other",
    "major_id": "uuid"
  }
  ```

### Logout
- **Method:** POST
- **Route:** `/logout`
- **Description:** Log out the authenticated user
- **Headers:** Authorization: Bearer {token}

### Get Current User
- **Method:** GET
- **Route:** `/user`
- **Description:** Get the currently authenticated user
- **Headers:** Authorization: Bearer {token}

### Update Profile
- **Method:** PUT
- **Route:** `/user/profile`
- **Description:** Update user profile
- **Headers:** Authorization: Bearer {token}

### Change Password
- **Method:** PUT
- **Route:** `/user/password`
- **Description:** Change user password
- **Headers:** Authorization: Bearer {token}

## Student Routes

### Get Student Courses
- **Method:** GET
- **Route:** `/courses`
- **Description:** Get all courses the student is enrolled in
- **Headers:** Authorization: Bearer {token}

### Get Student Stats
- **Method:** GET
- **Route:** `/student/stats`
- **Description:** Get student dashboard statistics
- **Headers:** Authorization: Bearer {token}

### Enroll in Course
- **Method:** POST
- **Route:** `/students/{studentId}/courses`
- **Description:** Enroll student in a course
- **Headers:** Authorization: Bearer {token}

### Unenroll from Course
- **Method:** DELETE
- **Route:** `/students/{studentId}/courses/{courseId}`
- **Description:** Unenroll student from a course
- **Headers:** Authorization: Bearer {token}

### Get Student Grades
- **Method:** GET
- **Route:** `/students/{studentId}/grades`
- **Description:** Get all grades for a student
- **Headers:** Authorization: Bearer {token}

## Exam Routes

### Get Available Exams
- **Method:** GET
- **Route:** `/exams/available`
- **Description:** Get available exams for the student
- **Headers:** Authorization: Bearer {token}

### Get Upcoming Exams
- **Method:** GET
- **Route:** `/exams/upcoming`
- **Description:** Get upcoming exams for the student
- **Headers:** Authorization: Bearer {token}

### Get Course Exams
- **Method:** GET
- **Route:** `/courses/{courseId}/exams`
- **Description:** Get all exams for a specific course
- **Headers:** Authorization: Bearer {token}

### Get Exam Details
- **Method:** GET
- **Route:** `/exams/{id}`
- **Description:** Get details of a specific exam
- **Headers:** Authorization: Bearer {token}

### Get Exam Questions
- **Method:** GET
- **Route:** `/exams/{id}/questions`
- **Description:** Get all questions for an exam
- **Headers:** Authorization: Bearer {token}

### Start Exam
- **Method:** POST
- **Route:** `/exams/{id}/start`
- **Description:** Start an exam
- **Headers:** Authorization: Bearer {token}

### Submit Answer
- **Method:** POST
- **Route:** `/exams/{examId}/questions/{questionId}/answer`
- **Description:** Submit an answer for a question
- **Headers:** Authorization: Bearer {token}

### Submit Exam
- **Method:** POST
- **Route:** `/exams/{id}/submit`
- **Description:** Submit a completed exam
- **Headers:** Authorization: Bearer {token}

### Get Student Results
- **Method:** GET
- **Route:** `/results`
- **Description:** Get all exam results for the student
- **Headers:** Authorization: Bearer {token}

### Get Specific Exam Results
- **Method:** GET
- **Route:** `/results/{examId}`
- **Description:** Get results for a specific exam
- **Headers:** Authorization: Bearer {token}

## Doctor Routes

### Get Doctor Courses
- **Method:** GET
- **Route:** `/doctor/courses`
- **Description:** Get all courses assigned to the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid (optional)

### Get Doctor Stats
- **Method:** GET
- **Route:** `/doctor/stats`
- **Description:** Get doctor dashboard statistics
- **Headers:** Authorization: Bearer {token}

### Get Course Students
- **Method:** GET
- **Route:** `/courses/{id}/students`
- **Description:** Get all students enrolled in a specific course
- **Headers:** Authorization: Bearer {token}

### Get Course Doctors
- **Method:** GET
- **Route:** `/courses/{id}/doctors`
- **Description:** Get all doctors assigned to a specific course
- **Headers:** Authorization: Bearer {token}

## Question Management Routes

### Get Doctor Questions
- **Method:** GET
- **Route:** `/doctor/questions`
- **Description:** Get all questions created by the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid (optional)

### Create Question
- **Method:** POST
- **Route:** `/doctor/questions`
- **Description:** Create a new question
- **Headers:** Authorization: Bearer {token}

### Update Question
- **Method:** PUT
- **Route:** `/doctor/questions/{id}`
- **Description:** Update a question
- **Headers:** Authorization: Bearer {token}

### Delete Question
- **Method:** DELETE
- **Route:** `/doctor/questions/{id}`
- **Description:** Delete a question
- **Headers:** Authorization: Bearer {token}

### Get Question Choices
- **Method:** GET
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Get all choices for a question
- **Headers:** Authorization: Bearer {token}

### Create Choice
- **Method:** POST
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Create a new choice for a question
- **Headers:** Authorization: Bearer {token}

### Update Choice
- **Method:** PUT
- **Route:** `/doctor/choices/{id}`
- **Description:** Update a choice
- **Headers:** Authorization: Bearer {token}

### Delete Choice
- **Method:** DELETE
- **Route:** `/doctor/choices/{id}`
- **Description:** Delete a choice
- **Headers:** Authorization: Bearer {token}

## Exam Management Routes (Doctor)

### Get Doctor Exams
- **Method:** GET
- **Route:** `/doctor/exams`
- **Description:** Get all exams created by the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid (optional)

### Create Exam
- **Method:** POST
- **Route:** `/doctor/exams`
- **Description:** Create a new exam
- **Headers:** Authorization: Bearer {token}

### Update Exam
- **Method:** PUT
- **Route:** `/doctor/exams/{id}`
- **Description:** Update an exam
- **Headers:** Authorization: Bearer {token}

### Delete Exam
- **Method:** DELETE
- **Route:** `/doctor/exams/{id}`
- **Description:** Delete an exam
- **Headers:** Authorization: Bearer {token}

### Add Question to Exam
- **Method:** POST
- **Route:** `/doctor/exams/{examId}/questions`
- **Description:** Add a question to an exam
- **Headers:** Authorization: Bearer {token}

### Remove Question from Exam
- **Method:** DELETE
- **Route:** `/doctor/exam-questions/{id}`
- **Description:** Remove a question from an exam
- **Headers:** Authorization: Bearer {token}

## Grading Routes

### Get Exam Submissions
- **Method:** GET
- **Route:** `/exams/{id}/submissions`
- **Description:** Get all submissions for a specific exam
- **Headers:** Authorization: Bearer {token}

### Grade Answer
- **Method:** POST
- **Route:** `/answers/{id}/grade`
- **Description:** Grade a specific answer
- **Headers:** Authorization: Bearer {token}

### Assign Final Grade
- **Method:** POST
- **Route:** `/exams/{examId}/student/{studentId}/grade`
- **Description:** Assign a final grade to a student's exam
- **Headers:** Authorization: Bearer {token}

### Submit Grade
- **Method:** POST
- **Route:** `/grades`
- **Description:** Submit a new grade
- **Headers:** Authorization: Bearer {token}

### Update Grade
- **Method:** PUT
- **Route:** `/grades/{id}`
- **Description:** Update an existing grade
- **Headers:** Authorization: Bearer {token}

## Admin Routes

### Get Dashboard Stats
- **Method:** GET
- **Route:** `/admin/stats`
- **Description:** Get system statistics
- **Headers:** Authorization: Bearer {token}

### User Management
- **Method:** GET
- **Route:** `/admin/users`
- **Description:** Get all users
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/users`
- **Description:** Create a new user
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/users/{id}`
- **Description:** Update a user
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/users/{id}`
- **Description:** Delete a user
- **Headers:** Authorization: Bearer {token}

### Student Management
- **Method:** GET
- **Route:** `/admin/students`
- **Description:** Get all students
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/students`
- **Description:** Create a new student
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/students/{id}`
- **Description:** Update a student
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/students/{id}`
- **Description:** Delete a student
- **Headers:** Authorization: Bearer {token}

### Doctor Management
- **Method:** GET
- **Route:** `/admin/doctors`
- **Description:** Get all doctors
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/doctors`
- **Description:** Create a new doctor
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/doctors/{id}`
- **Description:** Update a doctor
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/doctors/{id}`
- **Description:** Delete a doctor
- **Headers:** Authorization: Bearer {token}

### Course Management
- **Method:** GET
- **Route:** `/admin/courses`
- **Description:** Get all courses
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/courses`
- **Description:** Create a new course
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/courses/{id}`
- **Description:** Update a course
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/courses/{id}`
- **Description:** Delete a course
- **Headers:** Authorization: Bearer {token}

### Major Management
- **Method:** GET
- **Route:** `/majors`
- **Description:** Get all majors
- **Headers:** Authorization: Bearer {token}

- **Method:** GET
- **Route:** `/admin/majors/{id}`
- **Description:** Get a specific major with statistics
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/majors`
- **Description:** Create a new major
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/majors/{id}`
- **Description:** Update a major
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/majors/{id}`
- **Description:** Delete a major
- **Headers:** Authorization: Bearer {token}

### Assignment Routes
- **Method:** POST
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Assign a doctor to a course
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Remove a doctor from a course
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Enroll a student in a course
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Remove a student from a course
- **Headers:** Authorization: Bearer {token}

## Miscellaneous Routes

### Get Question Types
- **Method:** GET
- **Route:** `/question-types`
- **Description:** Get all available question types
- **Headers:** Authorization: Bearer {token}

### File Upload
- **Method:** POST
- **Route:** `/upload`
- **Description:** Upload files (images, documents)
- **Headers:** Authorization: Bearer {token}

### System Health
- **Method:** GET
- **Route:** `/health`
- **Description:** Check system health status
