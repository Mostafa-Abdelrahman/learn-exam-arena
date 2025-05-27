
# Admin Routes Documentation

## Get Dashboard Stats
- **Method:** GET
- **Route:** `/admin/stats`
- **Description:** Get system statistics
- **Headers:** Authorization: Bearer {token}

## User Management
- **Method:** GET
- **Route:** `/admin/users`
- **Description:** Get all users
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/users`
- **Description:** Create a new user
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/users/{id}`
- **Description:** Update a user
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/users/{id}`
- **Description:** Delete a user
- **Headers:** Authorization: Bearer {token}

## Student Management
- **Method:** GET
- **Route:** `/admin/students`
- **Description:** Get all students
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/students`
- **Description:** Create a new student
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/students/{id}`
- **Description:** Update a student
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/students/{id}`
- **Description:** Delete a student
- **Headers:** Authorization: Bearer {token}

## Doctor Management
- **Method:** GET
- **Route:** `/admin/doctors`
- **Description:** Get all doctors
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/doctors`
- **Description:** Create a new doctor
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/doctors/{id}`
- **Description:** Update a doctor
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/doctors/{id}`
- **Description:** Delete a doctor
- **Headers:** Authorization: Bearer {token}

## Course Management
- **Method:** GET
- **Route:** `/admin/courses`
- **Description:** Get all courses
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/courses`
- **Description:** Create a new course
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/courses/{id}`
- **Description:** Update a course
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/courses/{id}`
- **Description:** Delete a course
- **Headers:** Authorization: Bearer {token}

## Major Management
- **Method:** GET
- **Route:** `/majors`
- **Description:** Get all majors
- **Headers:** Authorization: Bearer {token}

- **Method:** GET
- **Route:** `/admin/majors/{id}`
- **Description:** Get a specific major with statistics
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/majors`
- **Description:** Create a new major
- **Headers:** Authorization: Bearer {token}

- **Method:** PUT
- **Route:** `/admin/majors/{id}`
- **Description:** Update a major
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/majors/{id}`
- **Description:** Delete a major
- **Headers:** Authorization: Bearer {token}

## Assignment Routes
- **Method:** POST
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Assign a doctor to a course
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/assignments/doctors/{doctorId}/courses/{courseId}`
- **Description:** Remove a doctor from a course
- **Headers:** Authorization: Bearer {token}

- **Method:** POST
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Enroll a student in a course
- **Headers:** Authorization: Bearer {token}

- **Method:** DELETE
- **Route:** `/admin/assignments/students/{studentId}/courses/{courseId}`
- **Description:** Remove a student from a course
- **Headers:** Authorization: Bearer {token}
