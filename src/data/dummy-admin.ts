export const dummySystemStats = {
  users: {
    total: 1250,
    admins: 5,
    doctors: 45,
    students: 1000
  },
  courses: {
    total: 120
  },
  majors: {
    total: 15
  },
  exams: {
    total: 450,
    published: 380,
    draft: 45
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
    updated_at: "2024-01-15T10:30:00Z",
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
    updated_at: "2023-08-10T08:00:00Z",
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
    updated_at: "2024-01-10T14:20:00Z",
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
    updated_at: "2023-09-15T10:00:00Z",
    last_login: "2024-01-28T12:30:00Z",
    status: "active" as const
  }
];

export const dummyStudents = dummyUsers.filter(user => user.role === "student");
export const dummyDoctors = dummyUsers.filter(user => user.role === "doctor");
