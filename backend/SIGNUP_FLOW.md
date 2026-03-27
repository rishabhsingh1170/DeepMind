# Updated Signup Flow: Admin-Driven Company Assignment

## Overview

The signup process has been refactored to remove mandatory company assignment during registration. Instead, admins now manage company assignments after users sign up. This allows for a flexible workflow where:

1. Users can register without needing a company
2. Admin assigns users to companies based on business logic
3. Users gain chatbot access only after company assignment

## Key Changes

### 1. Removed Company Requirement from Signup

**Before:**

```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "employee",
  "company_id": "60d5ec49c1234567890abcde"  // REQUIRED
}
```

**After:**

```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "employee"
  // company_id is OPTIONAL (defaults to null)
}
```

### 2. JWT Token Behavior

- **Without Company:** JWT token issued without `company_id` claim (user can access general features)
- **With Company:** After admin assignment, JWT will include `company_id` claim (user can access company-specific features)

**Example JWT payloads:**

_New User (No Company Assignment):_

```json
{
  "sub": "60d5ec49c1234567890abcde",
  "email": "john@example.com",
  "role": "employee",
  "iat": 1709000000,
  "exp": 1709003600
}
```

_After Admin Assignment:_

```json
{
  "sub": "60d5ec49c1234567890abcde",
  "email": "john@example.com",
  "role": "employee",
  "company_id": "60d5ec49c1234567890abcd1",
  "iat": 1709000001,
  "exp": 1709003601
}
```

### 3. Admin Assignment Endpoint

**New endpoint added:** `POST /users/{user_id}/assign-company/{company_id}`

Admin can assign a company to a user:

```bash
curl -X POST http://localhost:8000/users/60d5ec49c1234567890abcde/assign-company/60d5ec49c1234567890abcd1
```

**Response:**

```json
{
  "_id": "60d5ec49c1234567890abcde",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "profile_url": null,
  "company_id": "60d5ec49c1234567890abcd1"
}
```

## Future Implementation: Admin Controls

Once token refresh is implemented, recommended admin workflow:

1. **Company Management**
   - `POST /companies` - Create company
   - `GET /companies` - List companies

2. **User Assignment**
   - `POST /users/{user_id}/assign-company/{company_id}` - Assign user
   - `DELETE /users/{user_id}/remove-company` - Remove user from company (optional)
   - `GET /companies/{company_id}/users` - List company employees

3. **Access Control**
   - Middleware validates `company_id` claim in JWT
   - Protected endpoints check if user has access to requested company resources

## Impact on Frontend

### Signup Page Changes

1. **Remove** company selection/input from signup form
2. **Add** confirmation message after successful signup
3. **Show** message: "Your account has been created. An admin will assign you to your company shortly."

### Login Flow Unchanged

- Users can log in immediately after signup
- They'll have a valid JWT token without company_id claim initially
- After admin assignment, next login will include company_id in token

## Database Schema Changes

### User Document Before/After

**Before:**

```json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "$2b$12$...",
  "role": "employee",
  "profile_url": null,
  "company_id": ObjectId("60d5ec49c1234567890abcd1")
}
```

**After (New User):**

```json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "$2b$12$...",
  "role": "employee",
  "profile_url": null,
  "company_id": null  // Or field omitted
}
```

**After Admin Assignment:**

```json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "$2b$12$...",
  "role": "employee",
  "profile_url": null,
  "company_id": ObjectId("60d5ec49c1234567890abcd1")  // Assigned
}
```

## Error Handling

### Signup Validation

- ✅ Email uniqueness validated
- ✅ Password complexity validated (min 8 chars)
- ❌ Company existence NO LONGER validated

**Errors:**

```json
{
  "detail": "Email already registered" // 409 Conflict
}
```

### Admin Assignment Errors

- ❌ Invalid user ID → 400 Bad Request
- ❌ User not found → 404 Not Found
- ❌ Invalid company ID → 400 Bad Request
- ❌ Company not found → 404 Not Found

## API Documentation Updates

### Modified Endpoints

#### POST /auth/signup

**Request:**

```json
{
  "name": "string (required)",
  "email": "string (required, must be email format)",
  "password": "string (required, min 8 characters)",
  "role": "admin|employee (required)",
  "profile_url": "string|null (optional)"
}
```

**Note:** `company_id` field removed from required parameters

#### POST /users

- Company validation removed
- Same behavior as signup but through direct user creation endpoint

### New Endpoint

#### POST /users/{user_id}/assign-company/{company_id}

**Description:** Assign a user to a company (Admin only)

**Parameters:**

- `user_id` - ObjectId string
- `company_id` - ObjectId string

**Response:** Updated user object with company_id

## Migration Guide (If Upgrading Existing System)

For existing deployments, consider:

1. **Data Migration:**
   - All existing users already have company_id
   - No database migration required
   - Continue allowing company_id in signup (handled as optional)

2. **Access Control:**
   - Implement middleware to check company_id claim
   - Users without company_id get limited access
   - Add admin role verification for assignment endpoint

3. **Frontend Updates:**
   - Remove company selection from signup form
   - Add admin panel for company assignment
   - Display company assignment status to users

## Testing

### Test scenarios:

1. **Basic Signup (No Company)**

   ```bash
   curl -X POST http://localhost:8000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "testpass123",
       "role": "employee"
     }'
   ```

2. **Verify JWT (No company_id claim)**
   - Decode returned JWT token
   - Confirm `company_id` is NOT in payload

3. **Admin Assignment**

   ```bash
   curl -X POST http://localhost:8000/users/{user_id}/assign-company/{company_id}
   ```

4. **Login After Assignment**
   - User logs in
   - New JWT should include `company_id` claim
