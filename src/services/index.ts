
// Centralized service exports
export { default as ApiService } from './api.service';
export { default as AuthService } from './auth.service';
export { default as UserService } from './user.service';
export { default as CourseService } from './course.service';
export { default as ExamService } from './exam.service';
export { default as QuestionService } from './question.service';
export { default as SchedulingService } from './scheduling.service';
export { default as AdminService } from './admin.service';
export { default as NotificationService } from './notification.service';
export { default as MajorService } from './major.service';
export { default as StudentService } from './student.service';
export { default as GradeService } from './grade.service';
export { default as DoctorService } from './doctor.service';

// Re-export types with proper naming to avoid conflicts
export type * from './auth.service';
export type { 
  UserFilters, 
  PaginationParams, 
  UserStats
} from './user.service';
export type * from './course.service';
export type { 
  ExamFilters,
  CreateExamData,
  UpdateExamData
} from './exam.service';
export type { 
  QuestionFilters,
  CreateQuestionData as QuestionServiceCreateData,
  UpdateQuestionData as QuestionServiceUpdateData,
  QuestionStats 
} from './question.service';
export type * from './scheduling.service';
export type { SystemStats as AdminSystemStats } from './admin.service';
export type * from './notification.service';
export type * from './major.service';
export type * from './student.service';
export type * from './grade.service';
export type * from './doctor.service';

// Re-export user types from the proper location
export type { CreateUserData, UpdateUserData } from '../types/user';
