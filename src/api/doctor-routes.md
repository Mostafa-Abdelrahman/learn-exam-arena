
# Doctor Routes Documentation

## Get Doctor Courses
- **Method:** GET
- **Route:** `/doctor/courses`
- **Description:** Get all courses assigned to the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid (optional)

## Get Doctor Stats
- **Method:** GET
- **Route:** `/doctor/stats`
- **Description:** Get doctor dashboard statistics
- **Headers:** Authorization: Bearer {token}

## Get Course Students
- **Method:** GET
- **Route:** `/courses/{id}/students`
- **Description:** Get all students enrolled in a specific course
- **Headers:** Authorization: Bearer {token}

## Get Course Doctors
- **Method:** GET
- **Route:** `/courses/{id}/doctors`
- **Description:** Get all doctors assigned to a specific course
- **Headers:** Authorization: Bearer {token}

## Question Management

### Get Doctor Questions
- **Method:** GET
- **Route:** `/doctor/questions`
- **Description:** Get all questions created by the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid (optional)

### Create Question
- **Method:** POST
- **Route:** `/doctor/questions`
- **Description:** Create a new question
- **Headers:** Authorization: Bearer {token}

### Update Question
- **Method:** PUT
- **Route:** `/doctor/questions/{id}`
- **Description:** Update a question
- **Headers:** Authorization: Bearer {token}

### Delete Question
- **Method:** DELETE
- **Route:** `/doctor/questions/{id}`
- **Description:** Delete a question
- **Headers:** Authorization: Bearer {token}

### Get Question Choices
- **Method:** GET
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Get all choices for a question
- **Headers:** Authorization: Bearer {token}

### Create Choice
- **Method:** POST
- **Route:** `/doctor/questions/{questionId}/choices`
- **Description:** Create a new choice for a question
- **Headers:** Authorization: Bearer {token}

### Update Choice
- **Method:** PUT
- **Route:** `/doctor/choices/{id}`
- **Description:** Update a choice
- **Headers:** Authorization: Bearer {token}

### Delete Choice
- **Method:** DELETE
- **Route:** `/doctor/choices/{id}`
- **Description:** Delete a choice
- **Headers:** Authorization: Bearer {token}

## Exam Management

### Get Doctor Exams
- **Method:** GET
- **Route:** `/doctor/exams`
- **Description:** Get all exams created by the doctor
- **Headers:** Authorization: Bearer {token}
- **Query Parameters:** doctor_id=uuid (optional)

### Create Exam
- **Method:** POST
- **Route:** `/doctor/exams`
- **Description:** Create a new exam
- **Headers:** Authorization: Bearer {token}

### Update Exam
- **Method:** PUT
- **Route:** `/doctor/exams/{id}`
- **Description:** Update an exam
- **Headers:** Authorization: Bearer {token}

### Delete Exam
- **Method:** DELETE
- **Route:** `/doctor/exams/{id}`
- **Description:** Delete an exam
- **Headers:** Authorization: Bearer {token}

### Add Question to Exam
- **Method:** POST
- **Route:** `/doctor/exams/{examId}/questions`
- **Description:** Add a question to an exam
- **Headers:** Authorization: Bearer {token}

### Remove Question from Exam
- **Method:** DELETE
- **Route:** `/doctor/exam-questions/{id}`
- **Description:** Remove a question from an exam
- **Headers:** Authorization: Bearer {token}

## Grading Routes

### Get Exam Submissions
- **Method:** GET
- **Route:** `/exams/{id}/submissions`
- **Description:** Get all submissions for a specific exam
- **Headers:** Authorization: Bearer {token}

### Grade Answer
- **Method:** POST
- **Route:** `/answers/{id}/grade`
- **Description:** Grade a specific answer
- **Headers:** Authorization: Bearer {token}

### Assign Final Grade
- **Method:** POST
- **Route:** `/exams/{examId}/student/{studentId}/grade`
- **Description:** Assign a final grade to a student's exam
- **Headers:** Authorization: Bearer {token}

### Submit Grade
- **Method:** POST
- **Route:** `/grades`
- **Description:** Submit a new grade
- **Headers:** Authorization: Bearer {token}

### Update Grade
- **Method:** PUT
- **Route:** `/grades/{id}`
- **Description:** Update an existing grade
- **Headers:** Authorization: Bearer {token}
