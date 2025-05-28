
# Student API

## Overview
Student endpoints for course enrollment, exam taking, grade viewing, and academic progress tracking.

## Dashboard & Statistics

### Get Student Stats
**GET** `/student/stats`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": {
    "total_courses": 5,
    "total_exams": 12,
    "upcoming_exams": 3,
    "completed_exams": 9,
    "average_grade": 85.5,
    "total_credits": 18,
    "gpa": 3.7
  }
}
```

## Course Management

### Get Student Courses
**GET** `/courses`

**Headers:** `Authorization: Bearer {token}`

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
      "major_id": "uuid",
      "doctors": [
        {
          "id": "uuid",
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

### Enroll in Course
**POST** `/students/{studentId}/courses`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "course_id": "uuid"
}
```

### Unenroll from Course
**DELETE** `/students/{studentId}/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

## Exam Management

### Get Available Exams
**GET** `/exams/available`

**Headers:** `Authorization: Bearer {token}`

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
      "instructions": "This is a comprehensive exam",
      "status": "published",
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
**GET** `/exams/upcoming`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `limit` - Number of exams to return
- `days` - Days ahead to look

### Get Course Exams
**GET** `/courses/{courseId}/exams`

**Headers:** `Authorization: Bearer {token}`

### Get Exam Details
**GET** `/exams/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Final Exam",
    "course_id": "uuid",
    "exam_date": "2024-01-20T10:00:00Z",
    "duration": "120",
    "instructions": "Read all questions carefully",
    "status": "published",
    "course": {
      "name": "Introduction to Programming",
      "code": "CS101"
    },
    "questions": [
      {
        "id": "uuid",
        "text": "What is the difference between a stack and a queue?",
        "type": "written",
        "weight": 10,
        "difficulty_level": "medium"
      }
    ]
  }
}
```

### Get Exam Questions
**GET** `/exams/{id}/questions`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "text": "What is polymorphism in OOP?",
      "type": "mcq",
      "weight": 5,
      "difficulty_level": "medium",
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

### Start Exam
**POST** `/exams/{id}/start`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": {
    "student_exam_id": "uuid",
    "started_at": "2024-01-15T14:00:00Z",
    "ends_at": "2024-01-15T16:00:00Z",
    "time_remaining": 7200
  }
}
```

### Submit Answer
**POST** `/exams/{examId}/questions/{questionId}/answer`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "answer": "uuid_or_text_answer"
}
```

### Submit Exam
**POST** `/exams/{id}/submit`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "uuid",
      "answer": "uuid_or_text"
    }
  ]
}
```

## Grade Management

### Get Student Results
**GET** `/results`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "exam_id": "uuid",
      "student_id": "uuid",
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

### Get Specific Exam Results
**GET** `/results/{examId}`

**Headers:** `Authorization: Bearer {token}`

### Get Student Grades
**GET** `/students/{studentId}/grades`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "grade_id": "uuid",
      "student_id": "uuid",
      "exam": {
        "id": "uuid",
        "name": "Midterm Exam",
        "course": {
          "id": "uuid",
          "name": "Data Structures",
          "code": "CS201"
        }
      },
      "score": 88.5,
      "created_at": "2024-01-15T16:00:00Z"
    }
  ]
}
```
