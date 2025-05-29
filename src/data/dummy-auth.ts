
export const dummyUsers = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "student" as const,
    gender: "male" as const,
    profile: {
      bio: "Computer Science student passionate about AI and machine learning",
      phone: "+1234567890",
      address: "123 University Ave, Campus City",
      date_of_birth: "2000-05-15",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:25:00Z",
    last_login: "2024-01-29T09:15:00Z"
  },
  {
    id: "user-2",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "doctor" as const,
    gender: "female" as const,
    profile: {
      bio: "Professor of Computer Science with 15 years of experience",
      phone: "+1234567891",
      address: "456 Faculty Row, Campus City",
      date_of_birth: "1980-03-22",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b2e1b1f0?w=150&h=150&fit=crop&crop=face"
    },
    created_at: "2023-08-10T08:00:00Z",
    updated_at: "2024-01-28T16:45:00Z",
    last_login: "2024-01-29T08:30:00Z"
  },
  {
    id: "user-3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin" as const,
    gender: "other" as const,
    profile: {
      bio: "System administrator managing university exam platform",
      phone: "+1234567892",
      address: "789 Admin Building, Campus City",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2024-01-25T12:00:00Z",
    last_login: "2024-01-29T07:45:00Z"
  }
];

export const dummyAuthResponse = {
  token: "dummy_jwt_token_12345",
  user: dummyUsers[0],
  expires_in: 3600
};
