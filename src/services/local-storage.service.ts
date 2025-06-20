
import { User, CreateUserData, UpdateUserData } from '@/types/user';
import { Major } from '@/types/major';
import { dummyUsers } from '@/data/dummy-comprehensive';
import { dummyMajors } from '@/data/dummy-comprehensive';
import { dummyCourses } from '@/data/dummy-comprehensive';
import { dummyExams } from '@/data/dummy-exams';
import { dummyGrades } from '@/data/dummy-grades';
import { dummyNotifications } from '@/data/dummy-notifications';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'exam_arena_users',
  MAJORS: 'exam_arena_majors',
  COURSES: 'exam_arena_courses',
  EXAMS: 'exam_arena_exams',
  GRADES: 'exam_arena_grades',
  NOTIFICATIONS: 'exam_arena_notifications',
  SYSTEM_STATS: 'exam_arena_system_stats'
};

class LocalStorageService {
  // Initialize data if not exists
  initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(dummyUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAJORS)) {
      localStorage.setItem(STORAGE_KEYS.MAJORS, JSON.stringify(dummyMajors));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(dummyCourses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(dummyExams));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GRADES)) {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(dummyGrades));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(dummyNotifications));
    }
  }

  // Generic methods for CRUD operations
  getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  setData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(data),
      storageArea: localStorage
    }));
  }

  // User operations
  getUsers(): User[] {
    return this.getData<User>(STORAGE_KEYS.USERS);
  }

  createUser(userData: CreateUserData): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    this.setData(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  updateUser(id: string, userData: UpdateUserData): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...userData,
      updated_at: new Date().toISOString()
    };
    users[index] = updatedUser;
    this.setData(STORAGE_KEYS.USERS, users);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    if (filteredUsers.length === users.length) return false;
    
    this.setData(STORAGE_KEYS.USERS, filteredUsers);
    return true;
  }

  // Major operations
  getMajors(): Major[] {
    return this.getData<Major>(STORAGE_KEYS.MAJORS);
  }

  createMajor(majorData: Partial<Major>): Major {
    const majors = this.getMajors();
    const newMajor: Major = {
      id: `major-${Date.now()}`,
      name: majorData.name || '',
      code: majorData.code || '',
      description: majorData.description || '',
      status: 'active',
      student_count: 0,
      course_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    majors.push(newMajor);
    this.setData(STORAGE_KEYS.MAJORS, majors);
    return newMajor;
  }

  updateMajor(id: string, majorData: Partial<Major>): Major | null {
    const majors = this.getMajors();
    const index = majors.findIndex(major => major.id === id);
    if (index === -1) return null;

    const updatedMajor = {
      ...majors[index],
      ...majorData,
      updated_at: new Date().toISOString()
    };
    majors[index] = updatedMajor;
    this.setData(STORAGE_KEYS.MAJORS, majors);
    return updatedMajor;
  }

  deleteMajor(id: string): boolean {
    const majors = this.getMajors();
    const filteredMajors = majors.filter(major => major.id !== id);
    if (filteredMajors.length === majors.length) return false;
    
    this.setData(STORAGE_KEYS.MAJORS, filteredMajors);
    return true;
  }

  // System stats
  getSystemStats() {
    const users = this.getUsers();
    const majors = this.getMajors();
    const courses = this.getData(STORAGE_KEYS.COURSES);
    const exams = this.getData(STORAGE_KEYS.EXAMS);

    return {
      users: {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        doctors: users.filter(u => u.role === 'doctor').length,
        students: users.filter(u => u.role === 'student').length
      },
      courses: {
        total: courses.length,
        active: courses.filter((c: any) => c.status === 'active').length,
        inactive: courses.filter((c: any) => c.status === 'inactive').length
      },
      majors: {
        total: majors.length,
        active: majors.filter(m => m.status === 'active').length,
        inactive: majors.filter(m => m.status === 'inactive').length
      },
      exams: {
        total: exams.length,
        published: exams.filter((e: any) => e.status === 'published').length,
        draft: exams.filter((e: any) => e.status === 'draft').length
      }
    };
  }

  getMajorStats() {
    const majors = this.getMajors();
    const users = this.getUsers();
    const courses = this.getData(STORAGE_KEYS.COURSES);

    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalCourses = courses.length;

    return {
      total_majors: majors.length,
      total_students: totalStudents,
      total_courses: totalCourses
    };
  }
}

export default new LocalStorageService();
