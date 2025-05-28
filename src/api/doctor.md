
# Doctor API

## Overview
Doctor endpoints for course management, exam creation, question management, and grading.

## Dashboard & Statistics

### Get Doctor Stats
**GET** `/doctor/stats`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": {
    "total_courses": 5,
    "total_exams": 20,
    "total_students": 150,
    "pending_grades": 25,
    "total_questions": 200,
    "recent_submissions": 10
  }
}
```

## Course Management

### Get Doctor Courses
**GET** `/doctor/courses`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `doctor_id` - Filter by doctor ID

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Introduction to Programming",
      "code": "CS101",
      "description": "Basic programming concepts",
      "credits": 3,
      "semester": "Fall 2024",
      "students_count": 45,
      "exams_count": 4
    }
  ]
}
```

### Get Course Students
**GET** `/courses/{id}/students`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "major": {
        "name": "Computer Science"
      },
      "enrollment": {
        "enrolled_at": "2024-01-01T00:00:00Z",
        "status": "active"
      }
    }
  ]
}
```

### Get Course Doctors
**GET** `/courses/{id}/doctors`

**Headers:** `Authorization: Bearer {token}`

## Question Management

### Get Doctor Questions
**GET** `/doctor/questions`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `doctor_id` - Filter by doctor ID
- `type` - Filter by question type (mcq, written)
- `difficulty` - Filter by difficulty level

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "text": "What is polymorphism in OOP?",
      "type": "mcq",
      "difficulty": "medium",
      "chapter": "Object-Oriented Programming",
      "evaluation_criteria": "Understanding of OOP concepts",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "choices": [
        {
          "id": "uuid",
          "text": "The ability to have multiple forms",
          "is_correct": true
        }
      ]
    }
  ]
}
```

### Create Question
**POST** `/doctor/questions`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "text": "What is inheritance in OOP?",
  "type": "mcq",
  "chapter": "Object-Oriented Programming",
  "difficulty": "easy",
  "evaluation_criteria": "Basic understanding of inheritance"
}
```

### Update Question
**PUT** `/doctor/questions/{id}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "text": "Updated question text",
  "difficulty": "medium"
}
```

### Delete Question
**DELETE** `/doctor/questions/{id}`

**Headers:** `Authorization: Bearer {token}`

### Get Question Choices
**GET** `/doctor/questions/{questionId}/choices`

**Headers:** `Authorization: Bearer {token}`

### Create Choice
**POST** `/doctor/questions/{questionId}/choices`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "text": "Choice text",
  "is_correct": false
}
```

### Update Choice
**PUT** `/doctor/choices/{id}`

**Headers:** `Authorization: Bearer {token}`

### Delete Choice
**DELETE** `/doctor/choices/{id}`

**Headers:** `Authorization: Bearer {token}`

## Exam Management

### Get Doctor Exams
**GET** `/doctor/exams`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `doctor_id` - Filter by doctor ID
- `status` - Filter by status
- `course_id` - Filter by course

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Final Exam",
      "course_id": "uuid",
      "exam_date": "2024-01-20T10:00:00Z",
      "duration": "120",
      "instructions": "Read all questions carefully",
      "status": "published",
      "needs_grading": true,
      "questions_count": 25,
      "submissions_count": 42
    }
  ]
}
```

### Create Exam
**POST** `/doctor/exams`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Midterm Exam",
  "course_id": "uuid",
  "exam_date": "2024-02-15T14:00:00Z",
  "duration": "90",
  "instructions": "Answer all questions",
  "status": "draft"
}
```

### Update Exam
**PUT** `/doctor/exams/{id}`

**Headers:** `Authorization: Bearer {token}`

### Delete Exam
**DELETE** `/doctor/exams/{id}`

**Headers:** `Authorization: Bearer {token}`

### Add Question to Exam
**POST** `/doctor/exams/{examId}/questions`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "question_id": "uuid",
  "weight": 10
}
```

### Remove Question from Exam
**DELETE** `/doctor/exam-questions/{id}`

**Headers:** `Authorization: Bearer {token}`

## Grading

### Get Exam Submissions
**GET** `/exams/{id}/submissions`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "student_exam_answer_id": "uuid",
      "student_id": "uuid",
      "student_name": "John Doe",
      "exam_question_id": "uuid",
      "written_answer": "Student's written answer",
      "question_text": "What is inheritance?",
      "question_type": "written",
      "submitted_at": "2024-01-15T15:45:00Z",
      "grade": null,
      "feedback": null
    }
  ]
}
```

### Grade Answer
**POST** `/answers/{id}/grade`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "score": 8.5,
  "feedback": "Good understanding but could be more detailed"
}
```

### Assign Final Grade
**POST** `/exams/{examId}/student/{studentId}/grade`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "score": 85.5,
  "feedback": "Overall good performance"
}
```

### Submit Grade
**POST** `/grades`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "student_id": "uuid",
  "exam_id": "uuid",
  "grade": 88.5
}
```

### Update Grade
**PUT** `/grades/{id}`

**Headers:** `Authorization: Bearer {token}`
