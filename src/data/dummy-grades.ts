
export const dummyGrades = [
  {
    grade_id: "grade-1",
    student_id: "user-1",
    exam_id: "exam-1",
    score: 85,
    feedback: "Excellent work on programming concepts. Minor improvements needed in algorithm analysis.",
    graded_by: "user-2",
    created_at: "2024-02-16T10:30:00Z",
    updated_at: "2024-02-16T10:30:00Z",
    exam: {
      id: "exam-1",
      name: "Midterm Exam - CS101",
      course: {
        id: "course-1",
        name: "Introduction to Computer Science",
        code: "CS101"
      }
    }
  },
  {
    grade_id: "grade-2", 
    student_id: "user-1",
    exam_id: "exam-3",
    score: 92,
    feedback: "Perfect understanding of data structures. Keep up the excellent work!",
    graded_by: "user-2",
    created_at: "2024-02-06T09:15:00Z",
    updated_at: "2024-02-06T09:15:00Z",
    exam: {
      id: "exam-3",
      name: "Quiz 1 - Data Structures",
      course: {
        id: "course-2",
        name: "Data Structures and Algorithms",
        code: "CS201"
      }
    }
  }
];
