
# API Documentation

This directory contains the API documentation for the University Exam Management System. The system is built with Laravel backend and provides RESTful APIs for authentication, user management, course management, exam creation and taking, and administrative functions.

## Base Configuration

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:8000/api`)
- **Authentication**: Bearer token authentication
- **Content Type**: `application/json`
- **CORS**: Enabled with credentials support

## Documentation Structure

- **[Authentication API](./authentication.md)** - Login, registration, profile management, password reset
- **[Admin API](./admin.md)** - Administrative functions, user management, system statistics
- **[Doctor API](./doctor.md)** - Course management, exam creation, question management, grading
- **[Student API](./student.md)** - Course enrollment, exam taking, grade viewing
- **[System API](./system.md)** - Health checks, file uploads, system utilities

## Quick Start

1. **Authentication**: All API calls require a valid Bearer token (except login/register)
2. **Headers**: Include `Authorization: Bearer {token}` in all authenticated requests
3. **Error Handling**: All endpoints return standardized error responses with appropriate HTTP status codes
4. **Pagination**: List endpoints support pagination with `page` and `limit` parameters

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "data": "response_data",
  "message": "optional_message"
}
```

### Error Response
```json
{
  "message": "error_description",
  "errors": {
    "field": ["validation_error"]
  }
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error
