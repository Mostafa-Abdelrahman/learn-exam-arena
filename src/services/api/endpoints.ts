
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Student endpoints
  STUDENT: {
    COURSES: '/student/courses',
    EXAMS: '/student/exams',
    UPCOMING_EXAMS: '/student/exams/upcoming',
    RESULTS: '/student/results',
    ENROLL: (courseId: string) => `/student/courses/${courseId}/enroll`,
    EXAM_TAKE: (examId: string) => `/student/exams/${examId}/take`,
    EXAM_START: (examId: string) => `/student/exams/${examId}/start`,
    EXAM_SUBMIT: (examId: string) => `/student/exams/${examId}/submit`,
    SUBMIT_ANSWER: (examId: string) => `/student/exams/${examId}/answers`,
  },

  // Doctor endpoints
  DOCTOR: {
    COURSES: '/doctor/courses',
    EXAMS: '/doctor/exams',
    QUESTIONS: '/doctor/questions',
    EXAM_BY_ID: (examId: string) => `/doctor/exams/${examId}`,
    QUESTION_BY_ID: (questionId: string) => `/doctor/questions/${questionId}`,
  },

  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    COURSES: '/admin/courses',
    MAJORS: '/admin/majors',
    SYSTEM_STATS: '/admin/system-stats',
    USER_BY_ID: (userId: string) => `/admin/users/${userId}`,
  },

  // Course endpoints
  COURSES: {
    BASE: '/courses',
    BY_ID: (courseId: string) => `/courses/${courseId}`,
    EXAMS: (courseId: string) => `/courses/${courseId}/exams`,
    UNENROLL: (courseId: string) => `/courses/${courseId}/unenroll`,
  },

  // Exam endpoints
  EXAMS: {
    BASE: '/exams',
    BY_ID: (examId: string) => `/exams/${examId}`,
    QUESTIONS: (examId: string) => `/exams/${examId}/questions`,
  },

  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  },

  // Major endpoints
  MAJORS: {
    BASE: '/majors',
    BY_ID: (majorId: string) => `/majors/${majorId}`,
  },
} as const;
