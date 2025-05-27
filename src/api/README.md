
# API Documentation

This directory contains the complete API documentation for the Laravel backend system, organized by functionality:

## Documentation Structure

- **[auth-routes.md](./auth-routes.md)** - Authentication and user management routes
- **[student-routes.md](./student-routes.md)** - Student-specific functionality routes
- **[exam-routes.md](./exam-routes.md)** - Exam taking and results routes
- **[doctor-routes.md](./doctor-routes.md)** - Doctor/instructor functionality routes
- **[admin-routes.md](./admin-routes.md)** - Administrative management routes
- **[misc-routes.md](./misc-routes.md)** - Miscellaneous utility routes
- **[comprehensive-api-documentation.md](./comprehensive-api-documentation.md)** - Complete detailed API reference

## Base URL
All routes are prefixed with the base API URL of your Laravel backend.

## Authentication
Most routes require authentication using Bearer tokens. Include the token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Response Format
All API responses follow a consistent JSON format with appropriate HTTP status codes.
