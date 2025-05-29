
export const dummyNotifications = [
  {
    id: "notif-1",
    title: "New Exam Available",
    message: "Midterm Exam for CS101 has been published. Check the exam schedule.",
    type: "exam" as const,
    read: false,
    user_id: "user-1",
    created_at: "2024-01-25T14:30:00Z",
    updated_at: "2024-01-25T14:30:00Z"
  },
  {
    id: "notif-2",
    title: "Grade Published",
    message: "Your grade for Quiz 1 - Data Structures is now available.",
    type: "grade" as const,
    read: true,
    user_id: "user-1",
    created_at: "2024-02-06T10:00:00Z",
    updated_at: "2024-02-06T15:20:00Z"
  },
  {
    id: "notif-3",
    title: "Course Enrollment Confirmed",
    message: "You have been successfully enrolled in Database Systems (CS301).",
    type: "enrollment" as const,
    read: false,
    user_id: "user-1",
    created_at: "2024-01-28T11:45:00Z",
    updated_at: "2024-01-28T11:45:00Z"
  }
];

export const dummyUnreadCount = {
  count: dummyNotifications.filter(notif => !notif.read).length
};
