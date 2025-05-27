
# Authentication Routes Documentation

## Login
- **Method:** POST
- **Route:** `/login`
- **Description:** Authenticate a user and get a token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "student|doctor|admin",
      "gender": "male|female|other",
      "major_id": "uuid"
    }
  }
  ```

## Register
- **Method:** POST
- **Route:** `/register`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "student|doctor|admin",
    "gender": "male|female|other",
    "major_id": "uuid"
  }
  ```

## Logout
- **Method:** POST
- **Route:** `/logout`
- **Description:** Log out the authenticated user
- **Headers:** Authorization: Bearer {token}

## Get Current User
- **Method:** GET
- **Route:** `/user`
- **Description:** Get the currently authenticated user
- **Headers:** Authorization: Bearer {token}

## Update Profile
- **Method:** PUT
- **Route:** `/user/profile`
- **Description:** Update user profile
- **Headers:** Authorization: Bearer {token}

## Change Password
- **Method:** PUT
- **Route:** `/user/password`
- **Description:** Change user password
- **Headers:** Authorization: Bearer {token}
