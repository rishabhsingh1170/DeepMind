# Frontend-Backend Integration Guide

## Overview

This document describes the integration between the DocuMind AI frontend (React/Vite) and backend (FastAPI).

## Architecture

### Backend (FastAPI)

- **Base URL**: `http://127.0.0.1:8000`
- **Port**: 8000
- **CORS**: Configured for `localhost:5173` (Vite dev server)
- **Auth**: JWT-based Bearer token authentication

### Frontend (React/Vite)

- **Dev Server**: `http://127.0.0.1:5173`
- **Port**: 5173
- **State Management**: Context API (AuthContext)
- **HTTP Client**: Custom fetch wrapper in `apiClient.js`

## API Client Setup

### Location

`frontend/src/utils/apiClient.js`

### Features

- Automatic JWT token management
- Bearer token injection in Authorization header
- Token storage in localStorage
- Error handling with try-catch
- Multipart/form-data support for file uploads
- TypeScript-like documentation

### Usage Example

```javascript
import { authAPI, setAuthData, getToken } from "../utils/apiClient";

// Login
const response = await authAPI.login(email, password);
setAuthData(response); // Stores token + user in localStorage

// Authenticated request
const chats = await chatAPI.listChats(); // Token auto-included
```

## Authentication Flow

### Registration (OTP-based)

1. User enters email, name, password
2. Frontend calls `/auth/send-otp` with email
3. Backend sends OTP to email (10-min expiration)
4. User enters OTP in signup form
5. Frontend calls `/auth/verify-otp-and-signup` with OTP + user details
6. Backend creates user and returns JWT token + user data
7. Frontend stores `{access_token, user, expires_in}` in localStorage
8. User redirected to `/dashboard`

### Login

1. User enters email and password
2. Frontend calls `/auth/login`
3. Backend verifies credentials, returns JWT token + user data
4. Frontend stores auth data in localStorage
5. User redirected to `/dashboard`

### Protected Routes

- `/dashboard` - Requires authentication, redirects to `/login` if not authenticated
- Other authenticated endpoints auto-include Bearer token

### Logout

- Clears localStorage data
- Redirects to home page

## Authentication Context (AuthContext)

### Location

`frontend/src/context/AuthContext.jsx`

### Provides

```javascript
const {
  user, // Current user object {_id, name, email, role, ...}
  token, // JWT access token
  isLoading, // Initial load state
  isAuthenticated, // Boolean (!!token && !!user)
  login, // Function to update auth state
  logout, // Function to clear auth state
} = useAuth();
```

### Auto-initialization

- Checks localStorage on app mount
- Restores user session if valid token exists

## Protected Route Component

### Location

`frontend/src/components/ProtectedRoute.jsx`

### Usage

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## API Endpoints Reference

### Authentication

- `POST /auth/send-otp` - Send OTP (email)
- `POST /auth/verify-otp-and-signup` - Verify OTP and signup
- `POST /auth/login` - Login with email/password

### Users

- `GET /users/` - List all users
- `POST /users/{user_id}/profile-image` - Upload profile picture

### Chats

- `POST /chats/create` - Create chat (admin, multipart form-data)
- `GET /chats/` - List user's chats
- `GET /chats/{chat_id}` - Get chat details
- `POST /chats/{chat_id}/ask` - Ask question to chat
- `GET /chats/admin/me` - Get admin's chat
- `GET /chats/admin/access-code` - Get sharing code
- `POST /chats/access/verify-code` - Verify access code
- `POST /chats/access/request` - Request access
- `GET /chats/access/requests` - List requests (admin)
- `POST /chats/access/requests/{request_id}/decision` - Approve/deny request

### Documents

- `GET /documents/` - List documents

## Form Field Mapping

### Login

| Frontend  | Backend  |
| --------- | -------- |
| workEmail | email    |
| password  | password |

### Signup

| Frontend    | Backend           |
| ----------- | ----------------- |
| fullName    | name              |
| workEmail   | email             |
| password    | password          |
| (generated) | role: "employee"  |
| (empty)     | profile_url: null |
| (empty)     | company_id: null  |

**Note**: Signup process is two-step:

1. Send OTP with email
2. Verify OTP and submit registration details

## Response Format

### Auth Response (login/signup)

```javascript
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "admin" | "employee",
    "company_id": "507f1f77bcf86cd799439012" | null,
    "profile_url": "https://..."
  }
}
```

### OTP Response

```javascript
{
  "message": "OTP sent successfully",
  "email": "user@company.com",
  "expires_in": 600
}
```

## Error Handling

### API Client

- Throws error with `status` and `data` properties
- Error message from `data.detail` or `data.message`
- Frontend catches and displays in UI

### Common Errors

- `401` - Invalid credentials / Expired token
- `409` - Email already registered
- `403` - Insufficient permissions
- `404` - Resource not found
- `500` - Server error

## Token Management

### Storage

- JWT token stored in localStorage as `auth` (JSON object)
- Format: `{access_token, user, expires_in, message}`

### Expiration

- Default: 60 minutes (configurable in backend)
- No automatic refresh implemented yet
- Token provided in `Expires_In` field (seconds)

### Refresh Strategy (TODO)

- Implement token refresh mechanism
- Use refresh tokens (not yet implemented)
- Handle token expiry gracefully

## CORS Configuration

### Backend

Configured in `backend/config.py`:

```python
CORS_ALLOW_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", ...]
CORS_ALLOW_CREDENTIALS = True
```

### Required for

- Sending cookies with requests
- Preflight requests for non-simple methods

## Environment Variables

### Frontend (.env)

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Backend (.env)

```
CORS_ALLOW_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,...
JWT_SECRET_KEY=DocMintSecretKey
JWT_EXPIRES_MINUTES=60
```

## Development Workflow

### Start Backend

```bash
cd backend
python -m uvicorn main:app --reload
# Runs on http://127.0.0.1:8000
```

### Start Frontend

```bash
cd frontend
npm run dev
# Runs on http://127.0.0.1:5173
```

### API Testing

- Use Postman/Insomnia for testing backend directly
- Include `Authorization: Bearer <token>` header for protected endpoints
- Use Content-Type: `application/json` for JSON payloads
- Use Content-Type: `multipart/form-data` for file uploads

## Testing Checklist

### Auth Flow

- [ ] Send OTP works with valid email
- [ ] OTP expires after 10 minutes
- [ ] Cannot signup without valid OTP
- [ ] Duplicate email prevents signup
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password fails with 401
- [ ] Token stored in localStorage after login
- [ ] Logout clears localStorage
- [ ] Protected route redirects when not authenticated

### API Calls

- [ ] All authenticated endpoints include Bearer token
- [ ] Token automatically included in headers
- [ ] 401 errors handled gracefully
- [ ] Network errors display user-friendly messages
- [ ] File uploads work with multipart/form-data

### State Management

- [ ] User context accessible in components
- [ ] Auth state persists on page refresh
- [ ] Role-based access control ready

## Future Improvements

1. **Token Refresh**
   - Implement refresh token flow
   - Auto-refresh on 401
   - Handle token expiry before request

2. **Error Boundaries**
   - Add error boundary component
   - Global error handling

3. **Request Interceptors**
   - Centralized request/response handling
   - Automatic retry logic

4. **Validation**
   - Frontend form validation
   - Email validation before OTP send
   - Password strength requirements

5. **Loading States**
   - Global loading indicator
   - Per-request loading states

6. **Notifications**
   - Toast notifications for errors/success
   - Better UX feedback

## Troubleshooting

### CORS Errors

- Check backend CORS origins include frontend URL
- Ensure credentials header set correctly
- Verify OPTIONS requests allowed

### 401 Unauthorized

- Token may have expired (60 min default)
- Check localStorage for valid token
- Re-login to get new token

### API Base URL Wrong

- Frontend `.env` file must specify VITE_API_BASE_URL
- Check network tab for actual request URL
- Ensure backend running on correct port

### Form Data Not Sending

- Ensure fetch includes FormData for file uploads
- Don't set Content-Type header for FormData (browser auto-sets it)
- Check file actually selected before upload

## References

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [JWT Authentication](https://tools.ietf.org/html/rfc7519)
- [HTTP CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
