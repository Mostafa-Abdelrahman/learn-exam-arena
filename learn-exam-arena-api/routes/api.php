<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Doctor\DoctorController;
use App\Http\Controllers\Student\StudentController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::apiResource('users', AdminUserController::class);
        Route::apiResource('majors', AdminMajorController::class);
        Route::apiResource('courses', AdminCourseController::class);
    });

    // Doctor routes
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        Route::get('/stats', [DoctorController::class, 'getStats']);
        Route::apiResource('courses', DoctorCourseController::class);
        Route::apiResource('questions', DoctorQuestionController::class);
        Route::apiResource('exams', DoctorExamController::class);
    });

    // Student routes
    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('/stats', [StudentController::class, 'getStats']);
        Route::get('/courses', [StudentController::class, 'getCourses']);
        Route::get('/exams', [StudentController::class, 'getExams']);
        Route::get('/grades', [StudentController::class, 'getGrades']);
    });
});