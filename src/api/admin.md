
# Admin API

## Overview
Administrative endpoints for system management, user administration, and statistics.

## System Statistics

### Get System Stats
**GET** `/admin/system/stats`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": {
    "users": {
      "total": 1250,
      "admins": 50,
      "doctors": 200,
      "students": 1000
    },
    "courses": {
      "total": 150
    },
    "majors": {
      "total": 25
    },
    "exams": {
      "total": 500,
      "published": 450,
      "draft": 50
    }
  }
}
```

### Get Admin Stats
**GET** `/admin/stats`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": {
    "total_users": 1250,
    "total_doctors": 200,
    "total_students": 1000,
    "total_courses": 150,
    "total_exams": 500,
    "total_majors": 25
  }
}
```

## User Management

### Get All Users
**GET** `/admin/users`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `role` - Filter by role
- `search` - Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "gender": "male",
      "major_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 100,
    "per_page": 10
  }
}
```

### Create User
**POST** `/admin/users`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "student|doctor|admin",
  "gender": "male|female|other",
  "major_id": "uuid"
}
```

### Update User
**PUT** `/admin/users/{id}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "doctor"
}
```

### Delete User
**DELETE** `/admin/users/{id}`

**Headers:** `Authorization: Bearer {token}`

## Student Management

### Get All Students
**GET** `/admin/students`

**Headers:** `Authorization: Bearer {token}`

### Create Student
**POST** `/admin/students`

**Headers:** `Authorization: Bearer {token}`

### Update Student
**PUT** `/admin/students/{id}`

**Headers:** `Authorization: Bearer {token}`

### Delete Student
**DELETE** `/admin/students/{id}`

**Headers:** `Authorization: Bearer {token}`

## Doctor Management

### Get All Doctors
**GET** `/admin/doctors`

**Headers:** `Authorization: Bearer {token}`

### Create Doctor
**POST** `/admin/doctors`

**Headers:** `Authorization: Bearer {token}`

### Update Doctor
**PUT** `/admin/doctors/{id}`

**Headers:** `Authorization: Bearer {token}`

### Delete Doctor
**DELETE** `/admin/doctors/{id}`

**Headers:** `Authorization: Bearer {token}`

## Course Management

### Get All Courses
**GET** `/admin/courses`

**Headers:** `Authorization: Bearer {token}`

### Create Course
**POST** `/admin/courses`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Introduction to Programming",
  "code": "CS101",
  "description": "Basic programming concepts",
  "credits": 3,
  "semester": "Fall 2024",
  "major_id": "uuid"
}
```

### Update Course
**PUT** `/admin/courses/{id}`

**Headers:** `Authorization: Bearer {token}`

### Delete Course
**DELETE** `/admin/courses/{id}`

**Headers:** `Authorization: Bearer {token}`

## Major Management

### Get All Majors
**GET** `/majors`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Computer Science",
      "code": "CS",
      "description": "Study of computational systems",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Major Details
**GET** `/admin/majors/{id}`

**Headers:** `Authorization: Bearer {token}`

### Create Major
**POST** `/admin/majors`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Computer Science",
  "code": "CS",
  "description": "Study of computational systems",
  "status": "active"
}
```

### Update Major
**PUT** `/admin/majors/{id}`

**Headers:** `Authorization: Bearer {token}`

### Delete Major
**DELETE** `/admin/majors/{id}`

**Headers:** `Authorization: Bearer {token}`

## Assignment Management

### Assign Doctor to Course
**POST** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

### Remove Doctor from Course
**DELETE** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

### Enroll Student in Course
**POST** `/admin/assignments/students/{studentId}/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

### Remove Student from Course
**DELETE** `/admin/assignments/students/{studentId}/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

## System Management

### Get System Settings
**GET** `/admin/settings`

**Headers:** `Authorization: Bearer {token}`

### Update System Settings
**PUT** `/admin/settings`

**Headers:** `Authorization: Bearer {token}`

### Get System Logs
**GET** `/admin/logs`

**Headers:** `Authorization: Bearer {token}`

### Backup Database
**POST** `/admin/backup`

**Headers:** `Authorization: Bearer {token}`

### Restore Database
**POST** `/admin/restore`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

### Clear Cache
**POST** `/admin/cache/clear`

**Headers:** `Authorization: Bearer {token}`
