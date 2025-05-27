
# Student Routes Documentation

## Get Student Courses
- **Method:** GET
- **Route:** `/courses`
- **Description:** Get all courses the student is enrolled in
- **Headers:** Authorization: Bearer {token}

## Get Student Stats
- **Method:** GET
- **Route:** `/student/stats`
- **Description:** Get student dashboard statistics
- **Headers:** Authorization: Bearer {token}

## Enroll in Course
- **Method:** POST
- **Route:** `/students/{studentId}/courses`
- **Description:** Enroll student in a course
- **Headers:** Authorization: Bearer {token}

## Unenroll from Course
- **Method:** DELETE
- **Route:** `/students/{studentId}/courses/{courseId}`
- **Description:** Unenroll student from a course
- **Headers:** Authorization: Bearer {token}

## Get Student Grades
- **Method:** GET
- **Route:** `/students/{studentId}/grades`
- **Description:** Get all grades for a student
- **Headers:** Authorization: Bearer {token}
