
# Laravel API Routes Documentation

This file documents the Laravel API routes used in the frontend application.

## Authentication Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/login` | Authenticate a user and get a token |
| POST | `/register` | Register a new user |
| POST | `/logout` | Log out the authenticated user |
| POST | `/forgot-password` | Request a password reset |
| POST | `/reset-password` | Reset a password |
| GET | `/verify-email/{id}/{hash}` | Verify a user's email address |
| POST | `/email/verification-notification` | Resend a verification email |

## Student Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/courses` | Get all courses the student is enrolled in |
| GET | `/exams/upcoming` | Get upcoming exams for the student |
| GET | `/exams/available` | Get available exams for the student |
| GET | `/exams/{id}` | Get details of a specific exam |
| POST | `/exams/{id}/start` | Start an exam |
| POST | `/exams/{examId}/questions/{questionId}/answer` | Submit an answer for a question |
| POST | `/exams/{id}/submit` | Submit a completed exam |
| GET | `/results` | Get all exam results for the student |
| GET | `/results/{examId}` | Get results for a specific exam |

## Doctor Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/courses` | Get all courses assigned to the doctor |
| GET | `/courses/{id}/students` | Get all students enrolled in a specific course |
| GET | `/questions` | Get all questions created by the doctor |
| POST | `/questions` | Create a new question |
| PUT | `/questions/{id}` | Update a question |
| DELETE | `/questions/{id}` | Delete a question |
| GET | `/exams` | Get all exams created by the doctor |
| POST | `/exams` | Create a new exam |
| GET | `/exams/{id}` | Get details of a specific exam |
| PUT | `/exams/{id}` | Update an exam |
| DELETE | `/exams/{id}` | Delete an exam |
| PUT | `/exams/{id}/status` | Update the status of an exam |
| POST | `/exams/{id}/questions` | Add a question to an exam |
| DELETE | `/exams/{id}/questions/{questionId}` | Remove a question from an exam |
| GET | `/exams/{id}/results` | Get all results for a specific exam |
| POST | `/answers/{id}/grade` | Grade a specific answer |
| POST | `/exams/{id}/student/{studentId}/grade` | Assign a final grade to a student's exam |
| GET | `/students/search` | Search for students |
| GET | `/students/{id}` | Get details of a specific student |

## Admin Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin/dashboard` | Admin dashboard view |
| GET | `/admin/stats` | Get system statistics |
| GET | `/admin/users` | Get all users |
| POST | `/admin/users` | Create a new user |
| GET | `/admin/users/{id}` | Get details of a specific user |
| PUT | `/admin/users/{id}` | Update a user |
| DELETE | `/admin/users/{id}` | Delete a user |
| GET | `/admin/exams` | Get all exams |
| GET | `/admin/exams/{id}` | Get details of a specific exam |
| PATCH | `/admin/exams/{id}/status` | Update the status of an exam |
| DELETE | `/admin/exams/{id}` | Delete an exam |
| GET | `/admin/exams/{id}/results` | Get all results for a specific exam |
| GET | `/admin/courses` | Get all courses |
| POST | `/admin/courses` | Create a new course |
| GET | `/admin/courses/{id}` | Get details of a specific course |
| PUT | `/admin/courses/{id}` | Update a course |
| DELETE | `/admin/courses/{id}` | Delete a course |
| POST | `/admin/assignments/doctors/{doctorId}/courses/{courseId}` | Assign a doctor to a course |
| DELETE | `/admin/assignments/doctors/{doctorId}/courses/{courseId}` | Remove a doctor from a course |
| POST | `/admin/assignments/students/{studentId}/courses/{courseId}` | Enroll a student in a course |
| DELETE | `/admin/assignments/students/{studentId}/courses/{courseId}` | Remove a student from a course |
