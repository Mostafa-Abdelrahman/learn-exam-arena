
export const dummySystemStats = {
  total_users: 1250,
  total_students: 1000,
  total_doctors: 45,
  total_admins: 5,
  total_courses: 120,
  total_exams: 450,
  active_exams: 25,
  completed_exams: 380,
  system_health: {
    status: "healthy" as const,
    uptime: "99.8%",
    response_time: 145,
    error_rate: 0.02,
    services: {
      database: "up" as const,
      cache: "up" as const,
      storage: "up" as const,
      email: "up" as const
    }
  }
};

export const dummyUsers = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "student" as const,
    gender: "male" as const,
    created_at: "2024-01-15T10:30:00Z",
    last_login: "2024-01-29T09:15:00Z",
    status: "active" as const
  },
  {
    id: "user-2", 
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "doctor" as const,
    gender: "female" as const,
    created_at: "2023-08-10T08:00:00Z",
    last_login: "2024-01-29T08:30:00Z",
    status: "active" as const
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@university.edu", 
    role: "student" as const,
    gender: "female" as const,
    created_at: "2024-01-10T14:20:00Z",
    last_login: "2024-01-28T16:45:00Z",
    status: "active" as const
  },
  {
    id: "user-5",
    name: "Dr. Michael Brown",
    email: "michael.brown@university.edu",
    role: "doctor" as const,
    gender: "male" as const,
    created_at: "2023-09-15T10:00:00Z",
    last_login: "2024-01-28T12:30:00Z",
    status: "active" as const
  }
];

export const dummyStudents = dummyUsers.filter(user => user.role === "student");
export const dummyDoctors = dummyUsers.filter(user => user.role === "doctor");
