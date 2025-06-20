
export const dummyNotifications = [
  {
    id: "notif-1",
    title: "New Exam Available",
    message: "Introduction to Programming Midterm has been published. Check the exam schedule for details.",
    type: "exam" as const,
    read: false,
    user_id: "student-1",
    created_at: "2024-07-18T14:30:00Z",
    updated_at: "2024-07-18T14:30:00Z"
  },
  {
    id: "notif-2",
    title: "Grade Published",
    message: "Your grade for Introduction to Programming Midterm is now available in your grades section.",
    type: "grade" as const,
    read: true,
    user_id: "student-1",
    created_at: "2024-07-21T10:00:00Z",
    updated_at: "2024-07-21T15:20:00Z"
  },
  {
    id: "notif-3",
    title: "Course Enrollment Confirmed",
    message: "You have been successfully enrolled in Data Structures and Algorithms (CS201).",
    type: "enrollment" as const,
    read: false,
    user_id: "student-1",
    created_at: "2024-01-16T11:45:00Z",
    updated_at: "2024-01-16T11:45:00Z"
  },
  {
    id: "notif-4",
    title: "Submissions to Grade",
    message: "35 submissions pending grading for Introduction to Programming Midterm",
    type: "grading" as const,
    read: false,
    user_id: "doctor-1",
    created_at: "2024-07-20T18:00:00Z",
    updated_at: "2024-07-20T18:00:00Z"
  },
  {
    id: "notif-5",
    title: "New Course Assignment",
    message: "You have been assigned to teach Computer Vision (AI501) for Fall 2024 semester.",
    type: "assignment" as const,
    read: true,
    user_id: "doctor-6",
    created_at: "2024-06-15T09:00:00Z",
    updated_at: "2024-06-15T14:30:00Z"
  },
  {
    id: "notif-6",
    title: "System Maintenance",
    message: "Scheduled system maintenance on August 25th from 2-4 AM. Platform will be unavailable.",
    type: "system" as const,
    read: false,
    user_id: "admin-1",
    created_at: "2024-08-20T10:00:00Z",
    updated_at: "2024-08-20T10:00:00Z"
  },
  {
    id: "notif-7",
    title: "Exam Deadline Reminder",
    message: "Reminder: Data Structures Final Exam deadline is tomorrow at 5:00 PM",
    type: "reminder" as const,
    read: false,
    user_id: "student-6",
    created_at: "2024-08-24T09:00:00Z",
    updated_at: "2024-08-24T09:00:00Z"
  },
  {
    id: "notif-8",
    title: "Profile Update Required",
    message: "Please update your profile information to include your current contact details.",
    type: "profile" as const,
    read: true,
    user_id: "student-3",
    created_at: "2024-08-01T12:00:00Z",
    updated_at: "2024-08-01T16:45:00Z"
  },
  {
    id: "notif-9",
    title: "New Student Enrolled",
    message: "Henry Chen has enrolled in your Computer Vision course.",
    type: "enrollment" as const,
    read: false,
    user_id: "doctor-6",
    created_at: "2024-08-22T14:20:00Z",
    updated_at: "2024-08-22T14:20:00Z"
  },
  {
    id: "notif-10",
    title: "Course Material Updated",
    message: "New lecture materials have been uploaded for Machine Learning Fundamentals.",
    type: "material" as const,
    read: false,
    user_id: "student-5",
    created_at: "2024-08-28T11:30:00Z",
    updated_at: "2024-08-28T11:30:00Z"
  }
];

export const dummyUnreadCount = {
  count: dummyNotifications.filter(notif => !notif.read).length
};
