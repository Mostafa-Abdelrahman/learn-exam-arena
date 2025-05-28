
# Authentication API

## Overview
Authentication endpoints for user login, registration, profile management, and password operations.

## Endpoints

### Login
**POST** `/auth/login`

Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_access_token",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student|doctor|admin",
    "gender": "male|female|other",
    "major_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "expires_in": 3600
}
```

### Register
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "student|doctor|admin",
  "gender": "male|female|other",
  "major_id": "uuid"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "gender": "male",
    "major_id": "uuid"
  }
}
```

### Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### Get Current User
**GET** `/auth/user`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": "uuid",
  "name": "User Name",
  "email": "user@example.com",
  "role": "student|doctor|admin",
  "gender": "male|female|other",
  "major_id": "uuid",
  "profile": {
    "bio": "User bio",
    "phone": "+1234567890",
    "address": "User address",
    "date_of_birth": "1990-01-01",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "bio": "Updated bio",
  "phone": "+1234567890",
  "address": "New address",
  "date_of_birth": "1990-01-01"
}
```

### Change Password
**PUT** `/auth/password`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "current_password": "old_password",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

### Upload Avatar
**POST** `/auth/avatar`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request Body:** FormData with `file` field

**Response:**
```json
{
  "avatar_url": "https://example.com/new_avatar.jpg"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token",
  "email": "user@example.com",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

### Refresh Token
**POST** `/auth/refresh`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "token": "new_jwt_token",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student"
  },
  "expires_in": 3600
}
```
