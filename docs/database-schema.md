
# Database Schema Documentation

## Overview
This document describes the database schema for the Exam Management System. The system supports three user roles: Admin, Doctor (Instructor), and Student, with comprehensive exam creation, management, and grading capabilities.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   PROFILES  │       │   COURSES   │       │  QUESTIONS  │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ name        │       │ name        │       │ text        │
│ email       │       │ code        │       │ type        │
│ role        │       │ created_at  │       │ chapter     │
│ gender      │       │ updated_at  │       │ difficulty  │
│ created_at  │       └─────────────┘       │ created_by  │
│ updated_at  │                            │ created_at  │
└─────────────┘                            │ updated_at  │
                                           └─────────────┘
       │                    │                      │
       │                    │                      │
       ▼                    ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│DOCTOR_COURS │       │STUDENT_COURS│       │   CHOICES   │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ doctor_id   │       │ student_id  │       │question_id  │
│ course_id   │       │ course_id   │       │ text        │
│ created_at  │       │ enrolled_at │       │ is_correct  │
└─────────────┘       │ created_at  │       │ created_at  │
                      │ updated_at  │       │ updated_at  │
                      └─────────────┘       └─────────────┘
                             │                      
                             │                      
                             ▼                      
                      ┌─────────────┐              
                      │    EXAMS    │              
                      │─────────────│              
                      │ id (PK)     │              
                      │ name        │              
                      │ course_id   │              
                      │ exam_date   │              
                      │ duration    │              
                      │ instructions│              
                      │ status      │              
                      │ created_by  │              
                      │ created_at  │              
                      │ updated_at  │              
                      └─────────────┘              
                             │                      
                             │                      
                             ▼                      
                      ┌─────────────┐              
                      │EXAM_QUESTIO │              
                      │─────────────│              
                      │ id (PK)     │              
                      │ exam_id     │              
                      │ question_id │              
                      │ weight      │              
                      │ created_at  │              
                      └─────────────┘              
                             │                      
                             │                      
                             ▼                      
                      ┌─────────────┐              
                      │STUDENT_EXAMS│              
                      │─────────────│              
                      │ id (PK)     │              
                      │ student_id  │              
                      │ exam_id     │              
                      │ start_time  │              
                      │ end_time    │              
                      │ completed   │              
                      │ score       │              
                      │ created_at  │              
                      │ updated_at  │              
                      └─────────────┘              
                             │                      
                             │                      
                             ▼                      
                      ┌─────────────┐              
                      │STUDENT_EXAM │              
                      │   ANSWERS   │              
                      │─────────────│              
                      │ id (PK)     │              
                      │student_exam │              
                      │exam_question│              
                      │ answer      │              
                      │ is_correct  │              
                      │ score       │              
                      │ graded      │              
                      │ graded_by   │              
                      │ graded_at   │              
                      │ created_at  │              
                      │ updated_at  │              
                      └─────────────┘              
```

## Table Definitions

### 1. PROFILES
Stores user information for all system users (Admin, Doctor, Student).

| Column     | Type      | Constraints           | Description                    |
|------------|-----------|----------------------|--------------------------------|
| id         | UUID      | PRIMARY KEY          | Unique user identifier         |
| name       | VARCHAR   | NOT NULL             | Full name of the user          |
| email      | VARCHAR   | UNIQUE, NOT NULL     | User's email address           |
| role       | ENUM      | NOT NULL             | User role: admin/doctor/student|
| gender     | ENUM      | NOT NULL             | Gender: male/female/other      |
| created_at | TIMESTAMP | DEFAULT NOW()        | Record creation timestamp      |
| updated_at | TIMESTAMP | DEFAULT NOW()        | Record last update timestamp   |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `role`

### 2. COURSES
Stores course information.

| Column     | Type      | Constraints      | Description                    |
|------------|-----------|------------------|--------------------------------|
| id         | UUID      | PRIMARY KEY      | Unique course identifier       |
| name       | VARCHAR   | NOT NULL         | Course name                    |
| code       | VARCHAR   | UNIQUE, NOT NULL | Course code (e.g., CS101)      |
| created_at | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp      |
| updated_at | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp   |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `code`

### 3. DOCTOR_COURSES
Many-to-many relationship between doctors and courses.

| Column     | Type      | Constraints      | Description                    |
|------------|-----------|------------------|--------------------------------|
| id         | UUID      | PRIMARY KEY      | Unique assignment identifier   |
| doctor_id  | UUID      | FOREIGN KEY      | Reference to profiles.id       |
| course_id  | UUID      | FOREIGN KEY      | Reference to courses.id        |
| created_at | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp      |

**Constraints:**
- FOREIGN KEY `doctor_id` REFERENCES `profiles(id)` ON DELETE CASCADE
- FOREIGN KEY `course_id` REFERENCES `courses(id)` ON DELETE CASCADE
- UNIQUE INDEX on `(doctor_id, course_id)`

### 4. STUDENT_COURSES
Many-to-many relationship between students and courses.

| Column      | Type      | Constraints      | Description                    |
|-------------|-----------|------------------|--------------------------------|
| id          | UUID      | PRIMARY KEY      | Unique enrollment identifier   |
| student_id  | UUID      | FOREIGN KEY      | Reference to profiles.id       |
| course_id   | UUID      | FOREIGN KEY      | Reference to courses.id        |
| enrolled_at | TIMESTAMP | DEFAULT NOW()    | Enrollment timestamp           |
| created_at  | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp      |
| updated_at  | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp   |

**Constraints:**
- FOREIGN KEY `student_id` REFERENCES `profiles(id)` ON DELETE CASCADE
- FOREIGN KEY `course_id` REFERENCES `courses(id)` ON DELETE CASCADE
- UNIQUE INDEX on `(student_id, course_id)`

### 5. QUESTIONS
Stores question bank created by doctors.

| Column              | Type      | Constraints      | Description                         |
|---------------------|-----------|------------------|-------------------------------------|
| id                  | UUID      | PRIMARY KEY      | Unique question identifier          |
| text                | TEXT      | NOT NULL         | Question content                    |
| type                | ENUM      | NOT NULL         | Question type: mcq/written          |
| chapter             | VARCHAR   | NULLABLE         | Chapter or topic reference          |
| difficulty          | ENUM      | NULLABLE         | Difficulty: easy/medium/hard        |
| created_by          | UUID      | FOREIGN KEY      | Reference to profiles.id (doctor)   |
| evaluation_criteria | TEXT      | NULLABLE         | Grading criteria for written qs     |
| created_at          | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp           |
| updated_at          | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp        |

**Constraints:**
- FOREIGN KEY `created_by` REFERENCES `profiles(id)` ON DELETE CASCADE
- INDEX on `created_by`
- INDEX on `type`

### 6. CHOICES
Stores multiple choice options for MCQ questions.

| Column      | Type      | Constraints      | Description                    |
|-------------|-----------|------------------|--------------------------------|
| id          | UUID      | PRIMARY KEY      | Unique choice identifier       |
| question_id | UUID      | FOREIGN KEY      | Reference to questions.id      |
| text        | VARCHAR   | NOT NULL         | Choice text content            |
| is_correct  | BOOLEAN   | DEFAULT FALSE    | Whether this is correct answer |
| created_at  | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp      |
| updated_at  | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp   |

**Constraints:**
- FOREIGN KEY `question_id` REFERENCES `questions(id)` ON DELETE CASCADE
- INDEX on `question_id`

### 7. EXAMS
Stores exam information created by doctors.

| Column       | Type      | Constraints      | Description                       |
|--------------|-----------|------------------|-----------------------------------|
| id           | UUID      | PRIMARY KEY      | Unique exam identifier            |
| name         | VARCHAR   | NOT NULL         | Exam name                         |
| course_id    | UUID      | FOREIGN KEY      | Reference to courses.id           |
| exam_date    | TIMESTAMP | NOT NULL         | Scheduled exam date/time          |
| duration     | VARCHAR   | NOT NULL         | Exam duration in minutes          |
| instructions | TEXT      | NULLABLE         | Exam instructions for students    |
| status       | ENUM      | DEFAULT 'draft'  | Status: draft/published/archived  |
| created_by   | UUID      | FOREIGN KEY      | Reference to profiles.id (doctor) |
| created_at   | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp         |
| updated_at   | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp      |

**Constraints:**
- FOREIGN KEY `course_id` REFERENCES `courses(id)` ON DELETE CASCADE
- FOREIGN KEY `created_by` REFERENCES `profiles(id)` ON DELETE CASCADE
- INDEX on `course_id`
- INDEX on `created_by`
- INDEX on `status`

### 8. EXAM_QUESTIONS
Links questions to specific exams with weights.

| Column      | Type      | Constraints      | Description                    |
|-------------|-----------|------------------|--------------------------------|
| id          | UUID      | PRIMARY KEY      | Unique association identifier  |
| exam_id     | UUID      | FOREIGN KEY      | Reference to exams.id          |
| question_id | UUID      | FOREIGN KEY      | Reference to questions.id      |
| weight      | INTEGER   | DEFAULT 1        | Point value for this question  |
| created_at  | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp      |

**Constraints:**
- FOREIGN KEY `exam_id` REFERENCES `exams(id)` ON DELETE CASCADE
- FOREIGN KEY `question_id` REFERENCES `questions(id)` ON DELETE CASCADE
- UNIQUE INDEX on `(exam_id, question_id)`

### 9. STUDENT_EXAMS
Tracks student exam sessions and results.

| Column     | Type      | Constraints      | Description                    |
|------------|-----------|------------------|--------------------------------|
| id         | UUID      | PRIMARY KEY      | Unique session identifier      |
| student_id | UUID      | FOREIGN KEY      | Reference to profiles.id       |
| exam_id    | UUID      | FOREIGN KEY      | Reference to exams.id          |
| start_time | TIMESTAMP | NULLABLE         | When student started exam      |
| end_time   | TIMESTAMP | NULLABLE         | When student finished exam     |
| completed  | BOOLEAN   | DEFAULT FALSE    | Whether exam was completed     |
| score      | INTEGER   | NULLABLE         | Final calculated score         |
| created_at | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp      |
| updated_at | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp   |

**Constraints:**
- FOREIGN KEY `student_id` REFERENCES `profiles(id)` ON DELETE CASCADE
- FOREIGN KEY `exam_id` REFERENCES `exams(id)` ON DELETE CASCADE
- UNIQUE INDEX on `(student_id, exam_id)`

### 10. STUDENT_EXAM_ANSWERS
Stores individual answers for each question in an exam session.

| Column           | Type      | Constraints      | Description                        |
|------------------|-----------|------------------|------------------------------------|
| id               | UUID      | PRIMARY KEY      | Unique answer identifier           |
| student_exam_id  | UUID      | FOREIGN KEY      | Reference to student_exams.id      |
| exam_question_id | UUID      | FOREIGN KEY      | Reference to exam_questions.id     |
| answer           | TEXT      | NULLABLE         | Student's answer (text or choice)  |
| is_correct       | BOOLEAN   | NULLABLE         | Whether answer is correct (MCQ)    |
| score            | INTEGER   | NULLABLE         | Points awarded for this answer     |
| graded           | BOOLEAN   | DEFAULT FALSE    | Whether answer has been graded     |
| graded_by        | UUID      | NULLABLE         | Reference to profiles.id (doctor)  |
| graded_at        | TIMESTAMP | NULLABLE         | When answer was graded             |
| created_at       | TIMESTAMP | DEFAULT NOW()    | Record creation timestamp          |
| updated_at       | TIMESTAMP | DEFAULT NOW()    | Record last update timestamp       |

**Constraints:**
- FOREIGN KEY `student_exam_id` REFERENCES `student_exams(id)` ON DELETE CASCADE
- FOREIGN KEY `exam_question_id` REFERENCES `exam_questions(id)` ON DELETE CASCADE
- FOREIGN KEY `graded_by` REFERENCES `profiles(id)` ON DELETE SET NULL
- UNIQUE INDEX on `(student_exam_id, exam_question_id)`

## Database Functions

### 1. get_student_courses(student_id UUID)
Returns all courses a student is enrolled in with doctor information and exam counts.

**Returns:**
```sql
{
  id: UUID,
  name: VARCHAR,
  code: VARCHAR,
  description: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  doctors: JSON,
  exam_count: INTEGER
}[]
```

### 2. get_student_exams(student_id UUID)
Returns all available exams for a specific student based on their course enrollments.

**Returns:**
```sql
{
  id: UUID,
  name: VARCHAR,
  course_id: UUID,
  exam_date: TIMESTAMP,
  duration: VARCHAR,
  instructions: TEXT,
  status: VARCHAR,
  created_by: UUID,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  course: JSON
}[]
```

## Data Flow

### 1. User Management
- Admin creates user accounts with roles
- Users authenticate and receive JWT tokens
- Role-based access controls restrict feature access

### 2. Course Management
- Admin creates courses with unique codes
- Admin assigns doctors to courses
- Admin enrolls students in courses

### 3. Question Bank Management
- Doctors create questions for their subjects
- Questions can be MCQ or written type
- MCQ questions have associated choices
- Written questions have evaluation criteria

### 4. Exam Creation
- Doctors create exams for their assigned courses
- Questions are added to exams with weights
- Exams can be in draft, published, or archived status

### 5. Exam Taking
- Students see available exams for their enrolled courses
- Starting an exam creates a student_exam record
- Answers are auto-saved during the exam
- Exam submission finalizes the session

### 6. Grading
- MCQ answers are auto-graded
- Written answers require manual grading by doctors
- Final scores are calculated and stored

## Security Considerations

### 1. Authentication
- JWT tokens for stateless authentication
- Token validation on each API request
- Role-based route protection

### 2. Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- Course enrollment verification for students

### 3. Data Integrity
- Foreign key constraints maintain referential integrity
- Unique constraints prevent duplicate records
- Cascading deletes maintain consistency

### 4. Audit Trail
- Created/updated timestamps on all tables
- Grading attribution with graded_by references
- Immutable exam sessions once started

## Performance Optimizations

### 1. Indexing Strategy
- Primary keys for fast record lookups
- Foreign key indexes for join operations
- Composite indexes for common query patterns
- Status-based indexes for filtering

### 2. Query Optimization
- Database functions for complex aggregations
- Proper use of JOINS vs subqueries
- Pagination for large result sets
- Caching strategies for frequently accessed data

### 3. Scalability Considerations
- UUID primary keys for distributed systems
- Soft deletes where audit trail is needed
- Partitioning strategies for large tables
- Read replicas for reporting queries
