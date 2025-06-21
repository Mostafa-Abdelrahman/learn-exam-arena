
// Standardized API endpoints with consistent patterns
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    PASSWORD: '/auth/password',
    AVATAR: '/auth/avatar',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Admin endpoints - consistent with resource-based URLs
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    USER_BY_ID: (userId: string) => `/admin/users/${userId}`,
    STUDENTS: '/admin/students',
    STUDENT_BY_ID: (studentId: string) => `/admin/students/${studentId}`,
    DOCTORS: '/admin/doctors',
    DOCTOR_BY_ID: (doctorId: string) => `/admin/doctors/${doctorId}`,
    COURSES: '/admin/courses',
    COURSE_BY_ID: (courseId: string) => `/admin/courses/${courseId}`,
    MAJORS: '/admin/majors',
    MAJOR_BY_ID: (majorId: string) => `/admin/majors/${majorId}`,
    SYSTEM: {
      STATS: '/admin/system/stats',
      LOGS: '/admin/system/logs',
      BACKUP: '/admin/system/backup',
      RESTORE: '/admin/system/restore',
      SETTINGS: '/admin/system/settings',
    }
  },

  // Doctor endpoints - standardized with current user context
  DOCTOR: {
    STATS: '/doctor/stats', // Current doctor's stats
    PROFILE: '/doctor/profile',
    COURSES: '/doctor/courses',
    COURSE_BY_ID: (courseId: string) => `/doctor/courses/${courseId}`,
    COURSE_STUDENTS: (courseId: string) => `/doctor/courses/${courseId}/students`,
    EXAMS: '/doctor/exams',
    EXAM_BY_ID: (examId: string) => `/doctor/exams/${examId}`,
    EXAM_QUESTIONS: (examId: string) => `/doctor/exams/${examId}/questions`,
    EXAM_SUBMISSIONS: (examId: string) => `/doctor/exams/${examId}/submissions`,
    QUESTIONS: '/doctor/questions',
    QUESTION_BY_ID: (questionId: string) => `/doctor/questions/${questionId}`,
    QUESTION_CHOICES: (questionId: string) => `/doctor/questions/${questionId}/choices`,
    CHOICES: '/doctor/choices',
    CHOICE_BY_ID: (choiceId: string) => `/doctor/choices/${choiceId}`,
    GRADES: '/doctor/grades',
    GRADE_SUBMISSION: (examId: string, studentId: string) => `/doctor/exams/${examId}/students/${studentId}/grade`,
  },

  // Student endpoints - standardized with current user context
  STUDENT: {
    STATS: '/student/stats', // Current student's stats
    PROFILE: '/student/profile',
    COURSES: '/student/courses',
    COURSE_ENROLL: (courseId: string) => `/student/courses/${courseId}/enroll`,
    COURSE_UNENROLL: (courseId: string) => `/student/courses/${courseId}/unenroll`,
    EXAMS: '/student/exams',
    EXAMS_UPCOMING: '/student/exams/upcoming',
    EXAM_BY_ID: (examId: string) => `/student/exams/${examId}`,
    EXAM_START: (examId: string) => `/student/exams/${examId}/start`,
    EXAM_SUBMIT: (examId: string) => `/student/exams/${examId}/submit`,
    EXAM_ANSWERS: (examId: string) => `/student/exams/${examId}/answers`,
    RESULTS: '/student/results',
    RESULT_BY_EXAM: (examId: string) => `/student/results/${examId}`,
    GRADES: '/student/grades',
  },

  // Public endpoints
  PUBLIC: {
    COURSES: '/courses',
    COURSE_BY_ID: (courseId: string) => `/courses/${courseId}`,
    MAJORS: '/majors',
    MAJOR_BY_ID: (majorId: string) => `/majors/${majorId}`,
    HEALTH: '/health',
  },

  // File upload endpoints
  UPLOADS: {
    AVATAR: '/uploads/avatar',
    DOCUMENTS: '/uploads/documents',
    BULK_IMPORT: '/uploads/bulk-import',
  }
} as const;
