
# System API

## Overview
System utility endpoints for health checks, file uploads, and miscellaneous operations.

## System Health

### Check System Health
**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T19:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected", 
    "storage": "accessible"
  },
  "uptime": 86400,
  "version": "1.0.0"
}
```

## File Management

### Upload File
**POST** `/upload`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request Body:** FormData with:
- `file` - File to upload
- `type` - File type ("image", "document", etc.)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "uuid",
    "filename": "generated_filename.jpg",
    "original_name": "my-image.jpg",
    "mime_type": "image/jpeg",
    "size": 1024576,
    "url": "https://example.com/uploads/uuid.jpg",
    "uploaded_at": "2024-01-15T19:00:00Z"
  }
}
```

## Question Types

### Get Question Types
**GET** `/question-types`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "id": "mcq",
      "name": "Multiple Choice Question",
      "description": "Question with predefined choices"
    },
    {
      "id": "written",
      "name": "Written Answer",
      "description": "Question requiring written response"
    }
  ]
}
```

## Error Handling

### Common Error Responses

#### 400 - Bad Request
```json
{
  "message": "Invalid request data",
  "errors": {
    "field_name": ["Error description"]
  }
}
```

#### 401 - Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

#### 403 - Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

#### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

#### 422 - Validation Error
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

#### 500 - Internal Server Error
```json
{
  "message": "Internal server error",
  "error_id": "uuid"
}
```

## Rate Limiting

API endpoints are subject to rate limiting:
- **Authentication endpoints**: 10 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 20 requests per minute per user

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

## Pagination

List endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 25, max: 100)

Pagination response format:
```json
{
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 250,
    "per_page": 25,
    "has_next": true,
    "has_prev": false
  }
}
```

## Filtering and Sorting

Many endpoints support:
- `sort` - Field to sort by
- `order` - Sort direction (asc/desc)
- `filter[field]` - Filter by field value

Example: `/api/admin/users?sort=created_at&order=desc&filter[role]=student`
