
# Backend System Design for Educational Management System

## Overview
This document outlines the complete backend architecture for the Educational Management System, including API routes, database design, controller logic, and data flow patterns.

## Technology Stack
- **Framework**: Laravel 10.x (PHP)
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API with Laravel Sanctum
- **File Storage**: Laravel Storage (Local/S3)
- **Queue System**: Redis/Database queues
- **Cache**: Redis Cache

## Database Schema Design

### Core Tables

#### 1. users
```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'student') NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    avatar VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);
```

#### 2. majors
```sql
CREATE TABLE majors (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (is_active)
);
```

#### 3. students
```sql
CREATE TABLE students (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    major_id CHAR(36) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    total_credits INT DEFAULT 0,
    enrollment_date DATE NOT NULL,
    graduation_date DATE NULL,
    status ENUM('active', 'suspended', 'graduated', 'withdrawn') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE RESTRICT,
    INDEX idx_student_number (student_number),
    INDEX idx_major (major_id),
    INDEX idx_status (status)
);
```

#### 4. doctors
```sql
CREATE TABLE doctors (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    specialization TEXT NULL,
    hire_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'retired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee_number (employee_number),
    INDEX idx_department (department),
    INDEX idx_status (status)
);
```

#### 5. courses
```sql
CREATE TABLE courses (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NULL,
    credits INT NOT NULL DEFAULT 3,
    semester ENUM('fall', 'spring', 'summer') NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    max_students INT DEFAULT 50,
    prerequisites TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_semester_year (semester, academic_year),
    INDEX idx_active (is_active)
);
```

#### 6. course_majors
```sql
CREATE TABLE course_majors (
    id CHAR(36) PRIMARY KEY,
    course_id CHAR(36) NOT NULL,
    major_id CHAR(36) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_major (course_id, major_id)
);
```

#### 7. doctor_courses
```sql
CREATE TABLE doctor_courses (
    id CHAR(36) PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    role ENUM('primary', 'assistant', 'coordinator') DEFAULT 'primary',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doctor_course_role (doctor_id, course_id, role)
);
```

#### 8. student_courses
```sql
CREATE TABLE student_courses (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    enrollment_status ENUM('enrolled', 'completed', 'dropped', 'failed') DEFAULT 'enrolled',
    final_grade CHAR(2) NULL,
    gpa_points DECIMAL(3,2) NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_course (student_id, course_id),
    INDEX idx_enrollment_status (enrollment_status)
);
```

#### 9. questions
```sql
CREATE TABLE questions (
    id CHAR(36) PRIMARY KEY,
    text TEXT NOT NULL,
    type ENUM('mcq', 'written', 'multiple-choice') NOT NULL,
    chapter VARCHAR(255) NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    points INT DEFAULT 1,
    time_limit INT NULL COMMENT 'in minutes',
    evaluation_criteria TEXT NULL,
    tags JSON NULL,
    created_by CHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_chapter (chapter),
    INDEX idx_created_by (created_by),
    FULLTEXT idx_text (text)
);
```

#### 10. choices
```sql
CREATE TABLE choices (
    id CHAR(36) PRIMARY KEY,
    question_id CHAR(36) NOT NULL,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    explanation TEXT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_question (question_id),
    INDEX idx_correct (is_correct)
);
```

#### 11. exams
```sql
CREATE TABLE exams (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course_id CHAR(36) NOT NULL,
    exam_date DATETIME NOT NULL,
    duration INT NOT NULL COMMENT 'in minutes',
    instructions TEXT NULL,
    passing_score INT DEFAULT 60,
    max_score INT NOT NULL,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_choices BOOLEAN DEFAULT FALSE,
    show_results BOOLEAN DEFAULT TRUE,
    allow_review BOOLEAN DEFAULT TRUE,
    status ENUM('draft', 'published', 'active', 'completed', 'archived') DEFAULT 'draft',
    created_by CHAR(36) NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_exam_date (exam_date),
    INDEX idx_created_by (created_by)
);
```

#### 12. exam_questions
```sql
CREATE TABLE exam_questions (
    id CHAR(36) PRIMARY KEY,
    exam_id CHAR(36) NOT NULL,
    question_id CHAR(36) NOT NULL,
    weight INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_exam_question (exam_id, question_id),
    INDEX idx_exam (exam_id),
    INDEX idx_order (order_index)
);
```

#### 13. student_exams
```sql
CREATE TABLE student_exams (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL,
    exam_id CHAR(36) NOT NULL,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    submitted_at TIMESTAMP NULL,
    total_score INT DEFAULT 0,
    max_possible_score INT NOT NULL,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('not_started', 'in_progress', 'submitted', 'graded', 'expired') DEFAULT 'not_started',
    time_spent INT DEFAULT 0 COMMENT 'in minutes',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_exam (student_id, exam_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);
```

#### 14. student_exam_answers
```sql
CREATE TABLE student_exam_answers (
    id CHAR(36) PRIMARY KEY,
    student_exam_id CHAR(36) NOT NULL,
    exam_question_id CHAR(36) NOT NULL,
    answer TEXT NULL,
    selected_choice_id CHAR(36) NULL,
    is_correct BOOLEAN NULL,
    points_earned INT DEFAULT 0,
    max_points INT NOT NULL,
    graded BOOLEAN DEFAULT FALSE,
    graded_by CHAR(36) NULL,
    graded_at TIMESTAMP NULL,
    feedback TEXT NULL,
    answer_time INT NULL COMMENT 'time taken to answer in seconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_exam_id) REFERENCES student_exams(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_question_id) REFERENCES exam_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_choice_id) REFERENCES choices(id) ON DELETE SET NULL,
    FOREIGN KEY (graded_by) REFERENCES doctors(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_exam_question (student_exam_id, exam_question_id),
    INDEX idx_graded (graded),
    INDEX idx_graded_by (graded_by)
);
```

#### 15. grades
```sql
CREATE TABLE grades (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    exam_id CHAR(36) NULL,
    grade_type ENUM('exam', 'assignment', 'project', 'participation', 'final') NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    letter_grade CHAR(2) NULL,
    gpa_points DECIMAL(3,2) NULL,
    weight DECIMAL(3,2) DEFAULT 1.00,
    feedback TEXT NULL,
    graded_by CHAR(36) NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL,
    FOREIGN KEY (graded_by) REFERENCES doctors(id) ON DELETE RESTRICT,
    INDEX idx_student_course (student_id, course_id),
    INDEX idx_grade_type (grade_type),
    INDEX idx_published (is_published)
);
```

## API Route Structure

### Authentication Routes
```php
// routes/auth.php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::put('/user/profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::put('/user/password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
```

### Student Routes
```php
// routes/student.php
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    // Dashboard & Stats
    Route::get('/student/stats', [StudentController::class, 'getStats']);
    
    // Courses
    Route::get('/courses', [StudentCourseController::class, 'getCourses']);
    Route::post('/students/{student}/courses', [StudentCourseController::class, 'enrollInCourse']);
    Route::delete('/students/{student}/courses/{course}', [StudentCourseController::class, 'unenrollFromCourse']);
    
    // Exams
    Route::get('/exams/available', [StudentExamController::class, 'getAvailableExams']);
    Route::get('/exams/upcoming', [StudentExamController::class, 'getUpcomingExams']);
    Route::get('/courses/{course}/exams', [StudentExamController::class, 'getCourseExams']);
    Route::get('/exams/{exam}', [StudentExamController::class, 'getExam']);
    Route::get('/exams/{exam}/questions', [StudentExamController::class, 'getExamQuestions']);
    Route::post('/exams/{exam}/start', [StudentExamController::class, 'startExam']);
    Route::post('/exams/{exam}/questions/{question}/answer', [StudentExamController::class, 'submitAnswer']);
    Route::post('/exams/{exam}/submit', [StudentExamController::class, 'submitExam']);
    
    // Results & Grades
    Route::get('/results', [StudentResultController::class, 'getAllResults']);
    Route::get('/results/{exam}', [StudentResultController::class, 'getExamResults']);
    Route::get('/students/{student}/grades', [StudentGradeController::class, 'getGrades']);
});
```

### Doctor Routes
```php
// routes/doctor.php
Route::middleware(['auth:sanctum', 'role:doctor'])->group(function () {
    // Dashboard & Stats
    Route::get('/doctor/stats', [DoctorController::class, 'getStats']);
    
    // Courses
    Route::get('/doctor/courses', [DoctorCourseController::class, 'getCourses']);
    Route::get('/courses/{course}/students', [DoctorCourseController::class, 'getCourseStudents']);
    Route::get('/courses/{course}/doctors', [DoctorCourseController::class, 'getCourseDoctors']);
    
    // Questions
    Route::get('/doctor/questions', [DoctorQuestionController::class, 'getQuestions']);
    Route::post('/doctor/questions', [DoctorQuestionController::class, 'createQuestion']);
    Route::put('/doctor/questions/{question}', [DoctorQuestionController::class, 'updateQuestion']);
    Route::delete('/doctor/questions/{question}', [DoctorQuestionController::class, 'deleteQuestion']);
    Route::get('/doctor/questions/{question}/choices', [DoctorQuestionController::class, 'getChoices']);
    Route::post('/doctor/questions/{question}/choices', [DoctorQuestionController::class, 'createChoice']);
    Route::put('/doctor/choices/{choice}', [DoctorQuestionController::class, 'updateChoice']);
    Route::delete('/doctor/choices/{choice}', [DoctorQuestionController::class, 'deleteChoice']);
    
    // Exams
    Route::get('/doctor/exams', [DoctorExamController::class, 'getExams']);
    Route::post('/doctor/exams', [DoctorExamController::class, 'createExam']);
    Route::put('/doctor/exams/{exam}', [DoctorExamController::class, 'updateExam']);
    Route::delete('/doctor/exams/{exam}', [DoctorExamController::class, 'deleteExam']);
    Route::post('/doctor/exams/{exam}/questions', [DoctorExamController::class, 'addQuestionToExam']);
    Route::delete('/doctor/exam-questions/{examQuestion}', [DoctorExamController::class, 'removeQuestionFromExam']);
    
    // Grading
    Route::get('/exams/{exam}/submissions', [DoctorGradingController::class, 'getExamSubmissions']);
    Route::post('/answers/{answer}/grade', [DoctorGradingController::class, 'gradeAnswer']);
    Route::post('/exams/{exam}/student/{student}/grade', [DoctorGradingController::class, 'assignFinalGrade']);
    Route::post('/grades', [DoctorGradingController::class, 'submitGrade']);
    Route::put('/grades/{grade}', [DoctorGradingController::class, 'updateGrade']);
});
```

### Admin Routes
```php
// routes/admin.php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Dashboard & Stats
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    
    // User Management
    Route::apiResource('/admin/users', AdminUserController::class);
    Route::apiResource('/admin/students', AdminStudentController::class);
    Route::apiResource('/admin/doctors', AdminDoctorController::class);
    
    // Academic Management
    Route::apiResource('/admin/courses', AdminCourseController::class);
    Route::get('/majors', [AdminMajorController::class, 'index']);
    Route::get('/admin/majors/{major}', [AdminMajorController::class, 'show']);
    Route::apiResource('/admin/majors', AdminMajorController::class)->except(['index']);
    
    // Assignments
    Route::post('/admin/assignments/doctors/{doctor}/courses/{course}', [AdminAssignmentController::class, 'assignDoctorToCourse']);
    Route::delete('/admin/assignments/doctors/{doctor}/courses/{course}', [AdminAssignmentController::class, 'removeDoctorFromCourse']);
    Route::post('/admin/assignments/students/{student}/courses/{course}', [AdminAssignmentController::class, 'enrollStudentInCourse']);
    Route::delete('/admin/assignments/students/{student}/courses/{course}', [AdminAssignmentController::class, 'removeStudentFromCourse']);
});
```

## Controller Logic Examples

### AuthController
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load(['student.major', 'doctor', 'admin'])
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:student,doctor,admin',
            'gender' => 'required|in:male,female,other',
            'major_id' => 'required_if:role,student|exists:majors,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'gender' => $request->gender,
        ]);

        // Create role-specific record
        if ($request->role === 'student') {
            $user->student()->create([
                'student_number' => $this->generateStudentNumber(),
                'major_id' => $request->major_id,
                'academic_year' => now()->year,
                'enrollment_date' => now(),
            ]);
        } elseif ($request->role === 'doctor') {
            $user->doctor()->create([
                'employee_number' => $this->generateEmployeeNumber(),
                'department' => $request->department ?? 'General',
                'title' => $request->title ?? 'Instructor',
                'hire_date' => now(),
            ]);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->load(['student.major', 'doctor'])
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load(['student.major', 'doctor', 'admin']));
    }

    private function generateStudentNumber()
    {
        $year = now()->year;
        $lastStudent = Student::whereYear('created_at', $year)
            ->orderBy('student_number', 'desc')
            ->first();
        
        $sequence = $lastStudent ? intval(substr($lastStudent->student_number, -4)) + 1 : 1;
        
        return $year . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    private function generateEmployeeNumber()
    {
        $year = now()->year;
        $lastDoctor = Doctor::whereYear('created_at', $year)
            ->orderBy('employee_number', 'desc')
            ->first();
        
        $sequence = $lastDoctor ? intval(substr($lastDoctor->employee_number, -4)) + 1 : 1;
        
        return 'EMP' . $year . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
```

### StudentExamController
```php
<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\StudentExam;
use App\Models\StudentExamAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentExamController extends Controller
{
    public function getAvailableExams(Request $request)
    {
        $student = $request->user()->student;
        
        $exams = Exam::with(['course', 'questions'])
            ->whereHas('course.students', function($query) use ($student) {
                $query->where('student_id', $student->id)
                      ->where('enrollment_status', 'enrolled');
            })
            ->where('status', 'published')
            ->where('exam_date', '>=', now())
            ->orderBy('exam_date')
            ->get()
            ->map(function($exam) use ($student) {
                $studentExam = StudentExam::where('student_id', $student->id)
                    ->where('exam_id', $exam->id)
                    ->first();
                
                $exam->needs_grading = $studentExam && 
                    $studentExam->status === 'submitted' && 
                    $studentExam->answers()->where('graded', false)->exists();
                
                return $exam;
            });

        return response()->json(['data' => $exams]);
    }

    public function startExam(Request $request, Exam $exam)
    {
        $student = $request->user()->student;
        
        // Check if student is enrolled in the course
        if (!$exam->course->students()->where('student_id', $student->id)->exists()) {
            return response()->json(['message' => 'Not enrolled in course'], 403);
        }
        
        // Check if exam is available
        if ($exam->status !== 'published' || $exam->exam_date > now()) {
            return response()->json(['message' => 'Exam not available'], 403);
        }
        
        // Check if already taken
        $existingExam = StudentExam::where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->first();
            
        if ($existingExam) {
            return response()->json(['message' => 'Exam already taken'], 403);
        }
        
        $studentExam = StudentExam::create([
            'student_id' => $student->id,
            'exam_id' => $exam->id,
            'start_time' => now(),
            'max_possible_score' => $exam->max_score,
            'status' => 'in_progress',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        
        return response()->json([
            'data' => ['student_exam_id' => $studentExam->id]
        ]);
    }

    public function submitAnswer(Request $request, Exam $exam, $questionId)
    {
        $validator = Validator::make($request->all(), [
            'answer' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = $request->user()->student;
        $studentExam = StudentExam::where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->where('status', 'in_progress')
            ->firstOrFail();

        $examQuestion = $exam->examQuestions()
            ->where('question_id', $questionId)
            ->firstOrFail();

        $answer = StudentExamAnswer::updateOrCreate(
            [
                'student_exam_id' => $studentExam->id,
                'exam_question_id' => $examQuestion->id,
            ],
            [
                'answer' => $request->answer,
                'max_points' => $examQuestion->weight,
            ]
        );

        // Auto-grade MCQ questions
        if ($examQuestion->question->type === 'mcq') {
            $correctChoice = $examQuestion->question->choices()
                ->where('is_correct', true)
                ->first();
            
            if ($correctChoice && $request->answer === $correctChoice->id) {
                $answer->update([
                    'is_correct' => true,
                    'points_earned' => $examQuestion->weight,
                    'graded' => true,
                    'selected_choice_id' => $correctChoice->id,
                ]);
            } else {
                $answer->update([
                    'is_correct' => false,
                    'points_earned' => 0,
                    'graded' => true,
                    'selected_choice_id' => $request->answer,
                ]);
            }
        }

        return response()->json(['message' => 'Answer submitted successfully']);
    }

    public function submitExam(Request $request, Exam $exam)
    {
        $student = $request->user()->student;
        $studentExam = StudentExam::where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->where('status', 'in_progress')
            ->firstOrFail();

        DB::transaction(function() use ($studentExam) {
            // Calculate total score
            $totalScore = $studentExam->answers()->sum('points_earned');
            $percentage = ($totalScore / $studentExam->max_possible_score) * 100;

            $studentExam->update([
                'end_time' => now(),
                'submitted_at' => now(),
                'total_score' => $totalScore,
                'percentage' => $percentage,
                'status' => 'submitted',
                'time_spent' => now()->diffInMinutes($studentExam->start_time),
            ]);

            // Check if all answers are graded (auto-graded MCQs)
            $ungradedAnswers = $studentExam->answers()->where('graded', false)->count();
            if ($ungradedAnswers === 0) {
                $studentExam->update(['status' => 'graded']);
            }
        });

        return response()->json(['message' => 'Exam submitted successfully']);
    }
}
```

### DoctorGradingController
```php
<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\StudentExamAnswer;
use App\Models\StudentExam;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoctorGradingController extends Controller
{
    public function getExamSubmissions(Request $request, Exam $exam)
    {
        $doctor = $request->user()->doctor;
        
        // Verify doctor has access to this exam
        if ($exam->created_by !== $doctor->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $submissions = StudentExam::with([
            'student.user',
            'answers.examQuestion.question',
            'answers.selectedChoice'
        ])
        ->where('exam_id', $exam->id)
        ->where('status', '!=', 'not_started')
        ->orderBy('submitted_at', 'desc')
        ->get()
        ->map(function($submission) {
            return [
                'id' => $submission->id,
                'student' => [
                    'id' => $submission->student->id,
                    'name' => $submission->student->user->name,
                    'student_number' => $submission->student->student_number,
                ],
                'submitted_at' => $submission->submitted_at,
                'status' => $submission->status,
                'total_score' => $submission->total_score,
                'max_possible_score' => $submission->max_possible_score,
                'percentage' => $submission->percentage,
                'needs_grading' => $submission->answers()->where('graded', false)->exists(),
                'answers' => $submission->answers->map(function($answer) {
                    return [
                        'id' => $answer->id,
                        'question' => [
                            'id' => $answer->examQuestion->question->id,
                            'text' => $answer->examQuestion->question->text,
                            'type' => $answer->examQuestion->question->type,
                        ],
                        'answer' => $answer->answer,
                        'selected_choice' => $answer->selectedChoice,
                        'is_correct' => $answer->is_correct,
                        'points_earned' => $answer->points_earned,
                        'max_points' => $answer->max_points,
                        'graded' => $answer->graded,
                        'feedback' => $answer->feedback,
                    ];
                }),
            ];
        });
        
        return response()->json(['data' => $submissions]);
    }

    public function gradeAnswer(Request $request, StudentExamAnswer $answer)
    {
        $validator = Validator::make($request->all(), [
            'score' => 'required|integer|min:0|max:' . $answer->max_points,
            'feedback' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $doctor = $request->user()->doctor;
        
        $answer->update([
            'points_earned' => $request->score,
            'graded' => true,
            'graded_by' => $doctor->id,
            'graded_at' => now(),
            'feedback' => $request->feedback,
        ]);

        // Update student exam total score
        $studentExam = $answer->studentExam;
        $totalScore = $studentExam->answers()->sum('points_earned');
        $percentage = ($totalScore / $studentExam->max_possible_score) * 100;

        $studentExam->update([
            'total_score' => $totalScore,
            'percentage' => $percentage,
        ]);

        // Check if all answers are graded
        $ungradedAnswers = $studentExam->answers()->where('graded', false)->count();
        if ($ungradedAnswers === 0) {
            $studentExam->update(['status' => 'graded']);
        }

        return response()->json(['message' => 'Answer graded successfully']);
    }

    public function assignFinalGrade(Request $request, Exam $exam, $studentId)
    {
        $validator = Validator::make($request->all(), [
            'score' => 'required|integer|min:0|max:' . $exam->max_score,
            'feedback' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $doctor = $request->user()->doctor;
        $percentage = ($request->score / $exam->max_score) * 100;
        $letterGrade = $this->calculateLetterGrade($percentage);
        $gpaPoints = $this->calculateGpaPoints($letterGrade);

        Grade::updateOrCreate(
            [
                'student_id' => $studentId,
                'course_id' => $exam->course_id,
                'exam_id' => $exam->id,
                'grade_type' => 'exam',
            ],
            [
                'score' => $request->score,
                'max_score' => $exam->max_score,
                'percentage' => $percentage,
                'letter_grade' => $letterGrade,
                'gpa_points' => $gpaPoints,
                'feedback' => $request->feedback,
                'graded_by' => $doctor->id,
                'graded_at' => now(),
                'is_published' => true,
                'published_at' => now(),
            ]
        );

        return response()->json(['message' => 'Final grade assigned successfully']);
    }

    private function calculateLetterGrade($percentage)
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 85) return 'A';
        if ($percentage >= 80) return 'A-';
        if ($percentage >= 75) return 'B+';
        if ($percentage >= 70) return 'B';
        if ($percentage >= 65) return 'B-';
        if ($percentage >= 60) return 'C+';
        if ($percentage >= 55) return 'C';
        if ($percentage >= 50) return 'C-';
        return 'F';
    }

    private function calculateGpaPoints($letterGrade)
    {
        $gradePoints = [
            'A+' => 4.00, 'A' => 4.00, 'A-' => 3.70,
            'B+' => 3.30, 'B' => 3.00, 'B-' => 2.70,
            'C+' => 2.30, 'C' => 2.00, 'C-' => 1.70,
            'F' => 0.00
        ];

        return $gradePoints[$letterGrade] ?? 0.00;
    }
}
```

## Model Relationships

### User Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'gender', 'avatar', 'is_active'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isDoctor()
    {
        return $this->role === 'doctor';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
```

### Exam Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'course_id', 'exam_date', 'duration', 'instructions',
        'passing_score', 'max_score', 'shuffle_questions', 'shuffle_choices',
        'show_results', 'allow_review', 'status', 'created_by', 'published_at'
    ];

    protected $casts = [
        'exam_date' => 'datetime',
        'published_at' => 'datetime',
        'shuffle_questions' => 'boolean',
        'shuffle_choices' => 'boolean',
        'show_results' => 'boolean',
        'allow_review' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function creator()
    {
        return $this->belongsTo(Doctor::class, 'created_by');
    }

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class)->orderBy('order_index');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'exam_questions')
                    ->withPivot('weight', 'order_index')
                    ->orderBy('exam_questions.order_index');
    }

    public function studentExams()
    {
        return $this->hasMany(StudentExam::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function getNeedsGradingAttribute()
    {
        return $this->studentExams()
            ->where('status', 'submitted')
            ->whereHas('answers', function($query) {
                $query->where('graded', false);
            })
            ->exists();
    }

    public function getSubmissionCountAttribute()
    {
        return $this->studentExams()->where('status', '!=', 'not_started')->count();
    }
}
```

## Middleware & Security

### Role-based Access Control
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
```

### Exam Access Control
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Exam;

class ExamAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $examId = $request->route('exam');
        $user = $request->user();
        
        if ($user->role === 'student') {
            $exam = Exam::find($examId);
            if (!$exam || !$exam->course->students()->where('student_id', $user->student->id)->exists()) {
                return response()->json(['message' => 'Access denied'], 403);
            }
        } elseif ($user->role === 'doctor') {
            $exam = Exam::find($examId);
            if (!$exam || $exam->created_by !== $user->doctor->id) {
                return response()->json(['message' => 'Access denied'], 403);
            }
        }

        return $next($request);
    }
}
```

## Database Views & Functions

### Student Courses View
```sql
CREATE VIEW student_courses_view AS
SELECT 
    sc.id,
    sc.student_id,
    sc.course_id,
    c.name as course_name,
    c.code as course_code,
    c.description,
    sc.enrollment_status,
    sc.enrolled_at,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', d.id,
            'name', du.name,
            'title', d.title
        )
    ) as doctors,
    COUNT(DISTINCT e.id) as exam_count,
    COUNT(DISTINCT scs.student_id) as student_count
FROM student_courses sc
JOIN courses c ON sc.course_id = c.id
JOIN doctor_courses dc ON c.id = dc.course_id
JOIN doctors d ON dc.doctor_id = d.id
JOIN users du ON d.user_id = du.id
LEFT JOIN exams e ON c.id = e.course_id AND e.status = 'published'
LEFT JOIN student_courses scs ON c.id = scs.course_id AND scs.enrollment_status = 'enrolled'
WHERE sc.enrollment_status = 'enrolled'
GROUP BY sc.id, sc.student_id, sc.course_id, c.name, c.code, c.description, sc.enrollment_status, sc.enrolled_at;
```

### Student Exam Statistics Function
```sql
DELIMITER //
CREATE FUNCTION get_student_exam_stats(student_id CHAR(36))
RETURNS JSON
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE exam_stats JSON;
    
    SELECT JSON_OBJECT(
        'total_exams', COUNT(*),
        'completed_exams', SUM(CASE WHEN status IN ('submitted', 'graded') THEN 1 ELSE 0 END),
        'average_score', ROUND(AVG(CASE WHEN status = 'graded' THEN percentage ELSE NULL END), 2),
        'pending_exams', SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END)
    ) INTO exam_stats
    FROM student_exams
    WHERE student_exams.student_id = student_id;
    
    RETURN exam_stats;
END //
DELIMITER ;
```

## Caching Strategy

### Cache Configuration
```php
// config/cache.php - Redis configuration for exam data
'exam_cache' => [
    'driver' => 'redis',
    'connection' => 'exam_cache',
    'prefix' => 'exam:',
    'ttl' => 3600, // 1 hour
],

'question_cache' => [
    'driver' => 'redis',
    'connection' => 'question_cache',
    'prefix' => 'question:',
    'ttl' => 7200, // 2 hours
],
```

### Cache Implementation
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use App\Models\Exam;
use App\Models\Question;

class ExamCacheService
{
    public function getExamQuestions($examId)
    {
        $cacheKey = "exam:questions:{$examId}";
        
        return Cache::remember($cacheKey, 3600, function() use ($examId) {
            return Exam::with(['questions.choices'])
                ->find($examId)
                ->questions
                ->toArray();
        });
    }

    public function clearExamCache($examId)
    {
        Cache::forget("exam:questions:{$examId}");
        Cache::forget("exam:details:{$examId}");
    }

    public function getStudentExamSession($studentId, $examId)
    {
        $cacheKey = "student:exam:session:{$studentId}:{$examId}";
        
        return Cache::get($cacheKey);
    }

    public function setStudentExamSession($studentId, $examId, $sessionData)
    {
        $cacheKey = "student:exam:session:{$studentId}:{$examId}";
        
        Cache::put($cacheKey, $sessionData, 7200); // 2 hours
    }
}
```

## Queue Jobs for Background Processing

### Auto-Grade Job
```php
<?php

namespace App\Jobs;

use App\Models\StudentExam;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AutoGradeExamJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $studentExamId;

    public function __construct($studentExamId)
    {
        $this->studentExamId = $studentExamId;
    }

    public function handle()
    {
        $studentExam = StudentExam::with(['answers.examQuestion.question.choices'])
            ->find($this->studentExamId);

        if (!$studentExam) {
            return;
        }

        $totalScore = 0;

        foreach ($studentExam->answers as $answer) {
            $question = $answer->examQuestion->question;

            if ($question->type === 'mcq' && !$answer->graded) {
                $correctChoice = $question->choices->where('is_correct', true)->first();
                
                if ($correctChoice && $answer->selected_choice_id === $correctChoice->id) {
                    $answer->update([
                        'is_correct' => true,
                        'points_earned' => $answer->max_points,
                        'graded' => true,
                    ]);
                    $totalScore += $answer->max_points;
                } else {
                    $answer->update([
                        'is_correct' => false,
                        'points_earned' => 0,
                        'graded' => true,
                    ]);
                }
            } else {
                $totalScore += $answer->points_earned;
            }
        }

        $percentage = ($totalScore / $studentExam->max_possible_score) * 100;

        $studentExam->update([
            'total_score' => $totalScore,
            'percentage' => $percentage,
        ]);

        // Check if all answers are graded
        $ungradedAnswers = $studentExam->answers()->where('graded', false)->count();
        if ($ungradedAnswers === 0) {
            $studentExam->update(['status' => 'graded']);
        }
    }
}
```

This comprehensive backend design provides a robust foundation for the Educational Management System with proper authentication, role-based access control, efficient database design, and scalable architecture patterns.
