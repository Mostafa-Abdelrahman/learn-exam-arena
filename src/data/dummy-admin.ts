
export const dummySystemStats = {
  users: {
    total: 1580,
    admins: 8,
    doctors: 15,
    students: 1557
  },
  courses: {
    total: 85,
    active: 78,
    inactive: 7
  },
  majors: {
    total: 12,
    active: 11,
    inactive: 1
  },
  exams: {
    total: 127,
    published: 98,
    draft: 29
  }
};

export const dummyUsers = [
  {
    id: "admin-1",
    name: "John Administrator",
    email: "admin@university.edu",
    role: "admin" as const,
    gender: "male" as const,
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
    last_login: "2024-01-29T07:45:00Z",
    status: "active" as const
  },
  {
    id: "admin-2", 
    name: "Sarah Manager",
    email: "sarah.manager@university.edu",
    role: "admin" as const,
    gender: "female" as const,
    created_at: "2024-01-02T08:00:00Z",
    updated_at: "2024-01-02T08:00:00Z",
    last_login: "2024-01-29T08:15:00Z",
    status: "active" as const
  },
  {
    id: "admin-3",
    name: "David Wilson",
    email: "david.wilson@university.edu",
    role: "admin" as const,
    gender: "male" as const,
    created_at: "2024-01-03T08:00:00Z",
    updated_at: "2024-01-03T08:00:00Z",
    last_login: "2024-01-28T19:30:00Z",
    status: "active" as const
  },
  {
    id: "doctor-1",
    name: "Dr. Michael Smith",
    email: "michael.smith@university.edu", 
    role: "doctor" as const,
    gender: "male" as const,
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z",
    last_login: "2024-01-29T08:30:00Z",
    status: "active" as const
  },
  {
    id: "doctor-2",
    name: "Dr. Emily Johnson", 
    email: "emily.johnson@university.edu",
    role: "doctor" as const,
    gender: "female" as const,
    created_at: "2024-01-11T09:00:00Z",
    updated_at: "2024-01-11T09:00:00Z",
    last_login: "2024-01-29T09:15:00Z",
    status: "active" as const
  },
  {
    id: "doctor-3",
    name: "Dr. Robert Wilson",
    email: "robert.wilson@university.edu",
    role: "doctor" as const, 
    gender: "male" as const,
    created_at: "2024-01-12T09:00:00Z",
    updated_at: "2024-01-12T09:00:00Z",
    last_login: "2024-01-28T16:45:00Z",
    status: "active" as const
  },
  {
    id: "doctor-4",
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@university.edu",
    role: "doctor" as const,
    gender: "female" as const,
    created_at: "2024-01-13T09:00:00Z",
    updated_at: "2024-01-13T09:00:00Z",
    last_login: "2024-01-29T10:00:00Z",
    status: "active" as const
  },
  {
    id: "doctor-5",
    name: "Dr. James Brown",
    email: "james.brown@university.edu",
    role: "doctor" as const,
    gender: "male" as const,
    created_at: "2024-01-14T09:00:00Z",
    updated_at: "2024-01-14T09:00:00Z",
    last_login: "2024-01-28T14:20:00Z",
    status: "active" as const
  },
  {
    id: "doctor-6",
    name: "Dr. Maria Garcia",
    email: "maria.garcia@university.edu",
    role: "doctor" as const,
    gender: "female" as const,
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-01-15T09:00:00Z",
    last_login: "2024-01-29T11:30:00Z",
    status: "active" as const
  },
  {
    id: "student-1",
    name: "Alice Johnson",
    email: "alice.johnson@student.edu",
    role: "student" as const,
    gender: "female" as const,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
    last_login: "2024-01-29T09:15:00Z",
    status: "active" as const
  },
  {
    id: "student-2", 
    name: "Bob Smith",
    email: "bob.smith@student.edu",
    role: "student" as const,
    gender: "male" as const,
    created_at: "2024-02-02T10:00:00Z",
    updated_at: "2024-02-02T10:00:00Z",
    last_login: "2024-01-28T18:45:00Z",
    status: "active" as const
  },
  {
    id: "student-3",
    name: "Carol Davis",
    email: "carol.davis@student.edu",
    role: "student" as const, 
    gender: "female" as const,
    created_at: "2024-02-03T10:00:00Z",
    updated_at: "2024-02-03T10:00:00Z",
    last_login: "2024-01-29T12:00:00Z",
    status: "active" as const
  },
  {
    id: "student-4",
    name: "David Wilson",
    email: "david.wilson@student.edu",
    role: "student" as const,
    gender: "male" as const, 
    created_at: "2024-02-04T10:00:00Z",
    updated_at: "2024-02-04T10:00:00Z",
    last_login: "2024-01-28T20:15:00Z",
    status: "active" as const
  },
  {
    id: "student-5",
    name: "Emma Brown",
    email: "emma.brown@student.edu",
    role: "student" as const,
    gender: "female" as const,
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z",
    last_login: "2024-01-29T13:30:00Z",
    status: "active" as const
  },
  {
    id: "student-6",
    name: "Frank Miller",
    email: "frank.miller@student.edu",
    role: "student" as const,
    gender: "male" as const,
    created_at: "2024-02-06T10:00:00Z",
    updated_at: "2024-02-06T10:00:00Z",
    last_login: "2024-01-29T08:45:00Z",
    status: "active" as const
  },
  {
    id: "student-7",
    name: "Grace Lee",
    email: "grace.lee@student.edu",
    role: "student" as const,
    gender: "female" as const,
    created_at: "2024-02-07T10:00:00Z",
    updated_at: "2024-02-07T10:00:00Z",
    last_login: "2024-01-28T17:20:00Z",
    status: "active" as const
  },
  {
    id: "student-8",
    name: "Henry Chen",
    email: "henry.chen@student.edu",
    role: "student" as const,
    gender: "male" as const,
    created_at: "2024-02-08T10:00:00Z",
    updated_at: "2024-02-08T10:00:00Z",
    last_login: "2024-01-29T15:10:00Z",
    status: "active" as const
  },
  {
    id: "student-9",
    name: "Isabella Rodriguez",
    email: "isabella.rodriguez@student.edu",
    role: "student" as const,
    gender: "female" as const,
    created_at: "2024-02-09T10:00:00Z",
    updated_at: "2024-02-09T10:00:00Z",
    last_login: "2024-01-28T21:45:00Z",
    status: "active" as const
  },
  {
    id: "student-10",
    name: "Jack Thompson",
    email: "jack.thompson@student.edu",
    role: "student" as const,
    gender: "male" as const,
    created_at: "2024-02-10T10:00:00Z",
    updated_at: "2024-02-10T10:00:00Z",
    last_login: "2024-01-29T10:30:00Z",
    status: "active" as const
  }
];

export const dummyStudents = dummyUsers.filter(user => user.role === "student");
export const dummyDoctors = dummyUsers.filter(user => user.role === "doctor");
export const dummyAdmins = dummyUsers.filter(user => user.role === "admin");
