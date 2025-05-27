
# Exam Routes Documentation

## Get Available Exams
- **Method:** GET
- **Route:** `/exams/available`
- **Description:** Get available exams for the student
- **Headers:** Authorization: Bearer {token}

## Get Upcoming Exams
- **Method:** GET
- **Route:** `/exams/upcoming`
- **Description:** Get upcoming exams for the student
- **Headers:** Authorization: Bearer {token}

## Get Course Exams
- **Method:** GET
- **Route:** `/courses/{courseId}/exams`
- **Description:** Get all exams for a specific course
- **Headers:** Authorization: Bearer {token}

## Get Exam Details
- **Method:** GET
- **Route:** `/exams/{id}`
- **Description:** Get details of a specific exam
- **Headers:** Authorization: Bearer {token}

## Get Exam Questions
- **Method:** GET
- **Route:** `/exams/{id}/questions`
- **Description:** Get all questions for an exam
- **Headers:** Authorization: Bearer {token}

## Start Exam
- **Method:** POST
- **Route:** `/exams/{id}/start`
- **Description:** Start an exam
- **Headers:** Authorization: Bearer {token}

## Submit Answer
- **Method:** POST
- **Route:** `/exams/{examId}/questions/{questionId}/answer`
- **Description:** Submit an answer for a question
- **Headers:** Authorization: Bearer {token}

## Submit Exam
- **Method:** POST
- **Route:** `/exams/{id}/submit`
- **Description:** Submit a completed exam
- **Headers:** Authorization: Bearer {token}

## Get Student Results
- **Method:** GET
- **Route:** `/results`
- **Description:** Get all exam results for the student
- **Headers:** Authorization: Bearer {token}

## Get Specific Exam Results
- **Method:** GET
- **Route:** `/results/{examId}`
- **Description:** Get results for a specific exam
- **Headers:** Authorization: Bearer {token}
